// The design partner form's back end (founder, 2026-11-18): three answers,
// checked here and sent to the founder by email through Cloudflare's
// send_email binding (LEADS in wrangler.jsonc). Nothing is stored: the
// answers exist only in the email. Without the binding the route answers
// 503 and the page's script opens a prefilled email instead.
//
// The answers must be one of the form's own options (src/_includes/ent-apply.njk),
// so nothing free-form but the email address reaches the founder's inbox.

export const APPLY_PATH = '/design-partners/apply';
export const MAX_BODY = 4096;

export const SIZES = ['Under 50', '50 to 150', '150 to 300', 'Over 300'];
export const FOCI = [
  'Revenue ops and commissions',
  'Finance and accounting',
  'Planning and forecasting',
  'Supply chain and logistics',
  'Support and ticket triage',
  'Something else',
];

const EMAIL = /^[^\s@<>()",;:\\[\]]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

/** Checks the three answers. A filled honeypot is spam: accept it quietly and send nothing. */
export function parseLead(input) {
  const v = input && typeof input === 'object' ? input : {};
  if (typeof v.website === 'string' && v.website.trim() !== '') return { ok: true, spam: true };
  const email = typeof v.email === 'string' ? v.email.trim() : '';
  const size = typeof v.size === 'string' ? v.size : '';
  const focus = typeof v.focus === 'string' ? v.focus : '';
  if (email.length > 200 || !EMAIL.test(email)) return { ok: false, reason: 'email' };
  if (!SIZES.includes(size)) return { ok: false, reason: 'size' };
  if (!FOCI.includes(focus)) return { ok: false, reason: 'focus' };
  return { ok: true, lead: { email, size, focus } };
}

function headerSafe(s) {
  return String(s).replace(/[\r\n]+/g, ' ').trim();
}

/** The email to the founder, as a raw RFC 5322 message. */
export function leadMessage(lead, { from, to, now = new Date(), id = '' }) {
  const date = now.toUTCString();
  const body = [
    'A new design partner application from openshore.ai.',
    '',
    `Work email: ${lead.email}`,
    `Company size: ${lead.size}`,
    `Where a bot would help first: ${lead.focus}`,
    '',
    'Reply to this email to answer them directly.',
    '',
  ].join('\r\n');
  return [
    `From: OpenShore site <${headerSafe(from)}>`,
    `To: ${headerSafe(to)}`,
    `Reply-To: ${headerSafe(lead.email)}`,
    `Subject: Design partner: ${headerSafe(lead.size)}, ${headerSafe(lead.focus)}`,
    `Date: ${date}`,
    `Message-ID: <${headerSafe(id || String(now.getTime()))}@${headerSafe(from.split('@')[1] || 'openshore.ai')}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    body,
  ].join('\r\n');
}

/** Reads the body as JSON (the page's script) or a plain form post (no script). */
export async function readAnswers(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    try {
      return { answers: await request.json(), wantsJson: true };
    } catch {
      return { answers: null, wantsJson: true };
    }
  }
  if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
    const fd = await request.formData();
    return { answers: Object.fromEntries(fd.entries()), wantsJson: false };
  }
  return { answers: null, wantsJson: false };
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function seeOther(location) {
  return new Response(null, { status: 303, headers: { location, 'cache-control': 'no-store' } });
}

/**
 * POST /design-partners/apply. `send(raw, from, to)` delivers the message,
 * or is null when the site has no way to send yet.
 */
export async function handleApply(request, { send, from, to }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
  }
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return json(403, { ok: false });
  const length = Number(request.headers.get('content-length') || '0');
  if (length > MAX_BODY) return json(413, { ok: false });

  const { answers, wantsJson } = await readAnswers(request);
  const parsed = parseLead(answers);
  if (!parsed.ok) return wantsJson ? json(400, { ok: false, reason: parsed.reason }) : seeOther('/#apply');
  if (parsed.spam) return wantsJson ? json(200, { ok: true }) : seeOther('/thanks/');
  if (!send) return wantsJson ? json(503, { ok: false, fallback: 'email' }) : seeOther('/support/');
  try {
    await send(leadMessage(parsed.lead, { from, to, id: crypto.randomUUID() }), from, to);
  } catch (err) {
    // The reason shows in the Worker logs; the answers themselves never do.
    console.error('[apply] send failed', err instanceof Error ? err.message : String(err));
    return wantsJson ? json(503, { ok: false, fallback: 'email' }) : seeOther('/support/');
  }
  return wantsJson ? json(200, { ok: true }) : seeOther('/thanks/');
}
