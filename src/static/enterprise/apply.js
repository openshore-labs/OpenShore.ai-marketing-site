// The design partner form (2026-11-18). It sends the three answers to the
// Worker (POST /design-partners/apply, worker/leads.js) without leaving the
// page, then offers a call. If the Worker cannot send yet (503) or the
// network fails, it opens an email to the founder with the same answers,
// so nothing is lost. Without this script the form posts normally and the
// Worker answers with /thanks/.
(function () {
  'use strict';
  var forms = document.querySelectorAll('form[data-apply]');
  if (!forms.length || !window.fetch) return;

  function mailtoFor(form, data) {
    var to = form.getAttribute('data-contact') || '';
    var subject = 'Design partner: OpenShore';
    var body =
      'Hi Jack,\n\nI would like to be an OpenShore design partner.\n\n' +
      'Work email: ' + data.email + '\n' +
      'Company size: ' + data.size + '\n' +
      'Where a bot would help first: ' + data.focus + '\n';
    return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function show(form, text, isError) {
    var status = form.querySelector('.ent-form-status');
    status.textContent = text;
    status.classList.toggle('is-error', !!isError);
    status.hidden = false;
  }

  function sent(form) {
    form.classList.add('is-sent');
    show(form, 'Thanks. Your answers are with Jack, and he will reply personally.');
    var call = form.closest('.ent-apply') && form.closest('.ent-apply').querySelector('.ent-call .ent-btn');
    if (call) {
      var next = document.createElement('p');
      next.className = 'ent-form-next';
      var a = call.cloneNode(true);
      a.className = 'ent-btn ent-btn--primary';
      a.textContent = 'Pick a time for a call now';
      next.appendChild(a);
      form.appendChild(next);
    }
  }

  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var fd = new FormData(form);
      var data = {
        email: String(fd.get('email') || '').trim(),
        size: String(fd.get('size') || ''),
        focus: String(fd.get('focus') || ''),
        website: String(fd.get('website') || ''),
      };
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin',
      })
        .then(function (res) {
          if (res.ok) {
            sent(form);
            return;
          }
          if (res.status === 400) {
            button.disabled = false;
            show(form, 'Check your email address and both answers, then try again.', true);
            return;
          }
          throw new Error('status ' + res.status);
        })
        .catch(function () {
          button.disabled = false;
          window.location.href = mailtoFor(form, data);
          show(form, 'Your email app should open with your answers filled in. Send it and Jack will reply personally.');
        });
    });
  });
})();
