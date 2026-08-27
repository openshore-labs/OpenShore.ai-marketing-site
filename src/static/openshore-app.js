// OpenShore web purchase flow. Commercial seats are bought HERE, on the web, so
// Apple takes no cut and there is no in-app purchase (guideline 3.1.1). A buyer
// signs into the same account they use in the app, and their org is billed; the
// Stripe webhook writes the entitlement the app then reads. Dependency-free and
// same-origin so the site's strict CSP holds (connect-src allows Supabase).
(() => {
  const mount = document.getElementById('oscode-billing');
  if (!mount) return;
  const BASE = mount.dataset.supabaseUrl;
  const ANON = mount.dataset.anonKey;
  if (!BASE || !ANON) return;

  const SESSION_KEY = 'oscode.web.session.v1';
  const authEl = document.getElementById('oscode-auth');
  const dialog = document.getElementById('oscode-login');
  const form = dialog?.querySelector('form');
  const emailInput = dialog?.querySelector('#oscode-email');
  const pwInput = dialog?.querySelector('#oscode-password');
  const errEl = dialog?.querySelector('.oscode-login-error');
  const titleEl = dialog?.querySelector('.oscode-login-title');
  const submitEl = dialog?.querySelector('.oscode-login-submit');
  const toggleEl = dialog?.querySelector('.oscode-login-toggle');

  let session = loadSession();
  let account = null; // { role, org: {id,name,tierId}, entitlement }
  let mode = 'signin'; // or 'signup'
  let pendingTier = null; // a tier the user tapped Buy on before signing in
  let pendingBtn = null; // the button that tier was tapped on, for its label

  // Put a control into a labelled busy state and hand back a restore fn. No tap
  // is ever silent: a Buy button reads "Starting checkout..." while the Stripe
  // session is created, then the page redirects.
  function busy(el, label) {
    if (!el) return () => {};
    const html = el.innerHTML;
    const wasDisabled = el.disabled;
    el.dataset.busy = '1';
    el.disabled = true;
    el.textContent = label;
    return () => {
      delete el.dataset.busy;
      el.disabled = wasDisabled;
      el.innerHTML = html;
    };
  }
  function setError(text) {
    if (!errEl) return;
    errEl.textContent = text || '';
    errEl.classList.toggle('is-shown', Boolean(text));
  }

  // ---- session ------------------------------------------------------------
  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  }
  function saveSession(s) {
    session = s;
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  }
  function toSession(g) {
    return {
      accessToken: g.access_token,
      refreshToken: g.refresh_token,
      expiresAt: Date.now() + (g.expires_in || 3600) * 1000,
      user: { id: g.user?.id, email: g.user?.email },
    };
  }
  async function fresh() {
    if (!session) return null;
    if (session.expiresAt - Date.now() > 60000) return session;
    const res = await fetch(`${BASE}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: ANON },
      body: JSON.stringify({ refresh_token: session.refreshToken }),
    });
    if (!res.ok) {
      saveSession(null);
      return null;
    }
    saveSession(toSession(await res.json()));
    return session;
  }
  function headers(token) {
    return {
      'content-type': 'application/json',
      apikey: ANON,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    };
  }

  // Entitlement gate, mirrored from supabase/functions/_shared/entitlement.ts.
  // Access is decided by status (never by orgs.tier_id). Keep these in sync.
  const ENTITLED = new Set(['active', 'trialing']);
  function isEntitled(ent) {
    return (
      !!ent &&
      ENTITLED.has(ent.status) &&
      (!ent.valid_until || new Date(ent.valid_until).getTime() > Date.now())
    );
  }

  // ---- data ---------------------------------------------------------------
  async function loadAccount() {
    const s = await fresh();
    if (!s) {
      account = null;
      return;
    }
    try {
      // The individual (Personal) entitlement rides on the user, not an org.
      const userEnt = await get(
        `user_entitlements?select=tier_id,status,valid_until&user_id=eq.${s.user.id}`,
        s.accessToken,
      );
      const userEntitlement = userEnt[0] || null;
      const rows = await get(
        `org_members?select=role,status,orgs(id,name,tier_id)&user_id=eq.${s.user.id}&status=eq.active`,
        s.accessToken,
      );
      const row = rows[0];
      if (!row?.orgs) {
        account = { role: null, org: null, entitlement: null, userEntitlement };
        return;
      }
      const org = { id: row.orgs.id, name: row.orgs.name, tierId: row.orgs.tier_id };
      const ent = await get(
        `org_entitlements?select=tier_id,status,valid_until&org_id=eq.${org.id}`,
        s.accessToken,
      );
      account = { role: row.role, org, entitlement: ent[0] || null, userEntitlement };
    } catch {
      // A6: a fetch failure is NOT "no org". Mark it retryable so a paying admin
      // is never told to set up a company they already have.
      account = { error: true, role: null, org: null, entitlement: null, userEntitlement: null };
    }
  }
  async function get(query, token) {
    const res = await fetch(`${BASE}/rest/v1/${query}`, { headers: headers(token) });
    if (!res.ok) throw new Error(await errText(res));
    return res.json();
  }
  async function errText(res) {
    try {
      const b = await res.json();
      return b.error_description || b.msg || b.message || b.error || `Request failed (${res.status}).`;
    } catch {
      return `Request failed (${res.status}).`;
    }
  }

  // ---- auth actions -------------------------------------------------------
  async function signIn(email, password) {
    const res = await fetch(`${BASE}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await errText(res));
    saveSession(toSession(await res.json()));
  }
  async function signUp(email, password) {
    const res = await fetch(`${BASE}/auth/v1/signup`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await errText(res));
    const body = await res.json();
    if (body.access_token) saveSession(toSession(body));
    return Boolean(body.access_token);
  }
  async function signOut() {
    const s = session;
    saveSession(null);
    account = null;
    if (s) {
      fetch(`${BASE}/auth/v1/logout`, { method: 'POST', headers: headers(s.accessToken) }).catch(() => {});
    }
  }

  // ---- checkout / portal --------------------------------------------------
  async function invoke(fn, body) {
    const s = await fresh();
    if (!s) throw new Error('Sign in first.');
    const res = await fetch(`${BASE}/functions/v1/${fn}`, {
      method: 'POST',
      headers: headers(s.accessToken),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await errText(res));
    return res.json();
  }
  async function startCheckout(tierId, btn) {
    if (!session) {
      pendingTier = tierId;
      pendingBtn = btn || null;
      openDialog();
      return;
    }
    // Personal is an INDIVIDUAL purchase: one person, no org, no admin check.
    // The edge function bills the signed-in user directly, so we send no orgId.
    if (tierId === 'personal') {
      const restore = busy(btn, 'Starting checkout...');
      try {
        if (!account || account.error) await loadAccount();
        // Already an individual subscriber: the function returns a portal URL
        // (alreadySubscribed) instead of a fresh checkout. Either way, go there.
        const { url } = await invoke('stripe-checkout', { tierId: 'personal' });
        if (!url) {
          restore();
          alert('Could not start checkout. Try again.');
          return;
        }
        window.location.href = url; // leaving the page; keep the busy label
      } catch (e) {
        restore();
        alert(e.message || 'Could not start checkout.');
      }
      return;
    }
    const restore = busy(btn, 'Starting checkout...');
    try {
      if (!account || account.error) await loadAccount();
      if (account?.error) {
        restore();
        alert('We could not reach your account. Check your connection and try again.');
        return;
      }
      if (!account?.org) {
        restore();
        alert('Set up your company in the OpenShore app first, then come back here to subscribe.');
        return;
      }
      if (account.role !== 'admin') {
        restore();
        alert('Only a company admin can buy or change seats.');
        return;
      }
      // A3: an already-subscribed org manages its plan, it never double-buys.
      if (isEntitled(account.entitlement)) {
        restore();
        await manageBilling();
        return;
      }
      const { url } = await invoke('stripe-checkout', { orgId: account.org.id, tierId });
      if (!url) {
        // A6: never navigate to /os-code/undefined.
        restore();
        alert('Could not start checkout. Try again.');
        return;
      }
      window.location.href = url; // leaving the page; keep the busy label
    } catch (e) {
      restore();
      alert(e.message || 'Could not start checkout.');
    }
  }
  // Open the Stripe billing portal. Pass orgId for a company, or nothing for an
  // individual (Personal) subscriber, whose billing rides on the user.
  async function manageBilling(scope) {
    try {
      const body = scope === 'individual' ? {} : account?.org ? { orgId: account.org.id } : null;
      if (!body) return;
      const { url } = await invoke('stripe-portal', body);
      if (!url) {
        alert('Could not open billing. Try again.');
        return;
      }
      window.location.href = url;
    } catch (e) {
      alert(e.message || 'Could not open billing.');
    }
  }

  // ---- render -------------------------------------------------------------
  function renderAuth() {
    if (!authEl) return;
    authEl.innerHTML = '';
    if (!session) {
      const btn = document.createElement('button');
      btn.className = 'oscode-auth-btn';
      btn.textContent = 'Log in';
      btn.addEventListener('click', () => openDialog());
      authEl.append(btn);
      return;
    }
    const wrap = document.createElement('div');
    wrap.className = 'oscode-auth-in';
    const label = document.createElement('span');
    label.className = 'oscode-auth-email';
    const ent = account?.entitlement;
    const userEnt = account?.userEntitlement;
    const individualActive = isEntitled(userEnt);
    let plan = '';
    if (isEntitled(ent) || individualActive) plan = ' · subscribed';
    else if (ent || userEnt) plan = ' · billing needs attention';
    label.textContent = (session.user?.email || 'Signed in') + plan;
    wrap.append(label);
    // Individual (Personal) subscriber: manage their own billing, no org.
    if (userEnt) {
      const manage = document.createElement('button');
      manage.className = 'oscode-auth-btn ghost';
      manage.textContent = 'Manage billing';
      manage.addEventListener('click', () => manageBilling('individual'));
      wrap.append(manage);
    } else if (account?.org && account.role === 'admin' && account.entitlement) {
      const manage = document.createElement('button');
      manage.className = 'oscode-auth-btn ghost';
      manage.textContent = 'Manage billing';
      manage.addEventListener('click', () => manageBilling());
      wrap.append(manage);
    }
    const out = document.createElement('button');
    out.className = 'oscode-auth-btn ghost';
    out.textContent = 'Log out';
    out.addEventListener('click', async () => {
      await signOut();
      renderAuth();
    });
    wrap.append(out);
    authEl.append(wrap);
  }

  // ---- login dialog -------------------------------------------------------
  function setMode(next) {
    mode = next;
    if (titleEl) titleEl.textContent = mode === 'signin' ? 'Log in' : 'Create your account';
    if (submitEl) submitEl.textContent = mode === 'signin' ? 'Log in' : 'Create account';
    if (toggleEl)
      toggleEl.textContent = mode === 'signin' ? 'New here? Create an account' : 'Have an account? Log in';
    setError('');
  }
  function openDialog() {
    if (!dialog) return;
    setMode('signin');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    emailInput?.focus();
  }
  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  toggleEl?.addEventListener('click', () => setMode(mode === 'signin' ? 'signup' : 'signin'));
  dialog?.querySelector('.oscode-login-close')?.addEventListener('click', () => closeDialog());
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = pwInput.value;
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    const restore = busy(submitEl, mode === 'signin' ? 'Logging in...' : 'Creating account...');
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        const signedIn = await signUp(email, password);
        if (!signedIn) {
          setError('Account created. Check your email to confirm, then log in.');
          setMode('signin');
          restore();
          return;
        }
      }
      await loadAccount();
      closeDialog();
      renderAuth();
      if (pendingTier) {
        const t = pendingTier;
        const b = pendingBtn;
        pendingTier = null;
        pendingBtn = null;
        startCheckout(t, b);
      }
    } catch (err) {
      setError(err.message || 'Could not sign in.');
      restore();
    }
  });

  // ---- wire plan buttons --------------------------------------------------
  document.querySelectorAll('[data-tier]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      startCheckout(btn.dataset.tier, btn);
    });
  });

  // A calm confirmation banner on the way back from Stripe.
  function showWelcome() {
    const anchor = document.querySelector('.masthead');
    if (!anchor) return;
    const b = document.createElement('div');
    b.className = 'oscode-banner';
    b.setAttribute('role', 'status');
    b.textContent = 'You are subscribed. Welcome aboard.';
    anchor.parentNode.insertBefore(b, anchor);
    requestAnimationFrame(() => b.classList.add('is-shown'));
  }

  // ---- boot ---------------------------------------------------------------
  (async () => {
    renderAuth();
    if (session) {
      await loadAccount();
      renderAuth();
    }
    // A checkout can bounce back with ?checkout=success; refresh state so the
    // subscribed label appears once the webhook has written the entitlement.
    if (/[?&]checkout=success/.test(location.search) && session) {
      showWelcome();
      setTimeout(async () => {
        await loadAccount();
        renderAuth();
      }, 1500);
    }
  })();
})();
