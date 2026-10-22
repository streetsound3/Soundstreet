/* Sound Street Research: forms and the research filter. No dependencies. */
(function () {
  'use strict';
  var CFG = window.SOUND_STREET || {};
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function show(name, on) { $all('[data-if="' + name + '"]').forEach(function (el) { el.style.display = on ? 'contents' : 'none'; }); }
  function focus(id) { setTimeout(function () { var el = document.getElementById(id); if (el) el.focus(); }, 0); }
  function emailProblem(v) {
    v = String(v || '').trim();
    if (!v) return 'empty';
    return EMAIL_RE.test(v) ? '' : 'invalid';
  }
  function say(statusEl, text, color) { if (statusEl) { statusEl.textContent = text; if (color) statusEl.style.color = color; } }

  function sendSample(fields) {
    if (!CFG.sampleEndpoint) return Promise.reject(new Error('not-configured'));
    var data = new FormData();
    Object.keys(fields).forEach(function (k) { data.append(k, fields[k]); });
    data.append('_subject', 'Advisor sample request');
    return fetch(CFG.sampleEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('failed'); });
  }

  /* Sample request form (homepage band and For Advisors page) */
  function wireSample(opts) {
    var form = $('form[data-on="' + opts.submit + '"]');
    if (!form) return;
    var email = document.getElementById(opts.emailId);
    var status = document.getElementById(opts.statusId);
    var errColor = opts.errColor;
    var busy = false;
    email.addEventListener('input', function () {
      if (email.getAttribute('aria-invalid') === 'true') {
        var p = emailProblem(email.value);
        if (!p) { email.setAttribute('aria-invalid', 'false'); say(status, ''); }
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var p = emailProblem(email.value);
      if (p) {
        email.setAttribute('aria-invalid', 'true');
        say(status, p === 'empty' ? 'Enter a work email so we know where to send the sample.'
          : 'That email looks incomplete. It needs an @ and a domain, like name@firm.com.', errColor);
        email.focus();
        return;
      }
      email.setAttribute('aria-invalid', 'false');
      if (!CFG.sampleEndpoint) { say(status, 'Sample requests open soon. Check back in a few days.', errColor); return; }
      busy = true;
      say(status, 'Sending…', opts.okColor);
      var fields = { email: email.value.trim() };
      opts.extra.forEach(function (id) { var el = document.getElementById(id); if (el) fields[id.replace(/^(sample|adv)-/, '')] = el.value.trim(); });
      fields.page = location.pathname;
      sendSample(fields).then(function () {
        var done = document.getElementById(opts.doneId);
        done.textContent = 'Request received. We will email the advisor edition to ' + fields.email + '.';
        opts.onSent();
        focus(opts.doneId);
      }).catch(function () {
        say(status, 'That didn’t go through. Try again in a minute.', errColor);
      }).then(function () { busy = false; });
    });
  }

  // Homepage advisor band: button reveals the form
  var openBtn = $('[data-on="openSample"]');
  if (openBtn) {
    openBtn.addEventListener('click', function () { show('sampleClosed', false); show('sampleOpen', true); focus('sample-name'); });
    $all('[data-on="closeSample"]').forEach(function (b) {
      b.addEventListener('click', function () { show('sampleOpen', false); show('sampleClosed', true); say($('#sample-status'), ''); focus('sample-open'); });
    });
  }
  wireSample({ submit: 'submitSample', emailId: 'sample-email', statusId: 'sample-status', doneId: 'sample-done',
    extra: ['sample-name', 'sample-firm'], errColor: '#f0a99e', okColor: '#d6e1ec',
    onSent: function () { show('sampleOpen', false); show('sampleSent', true); } });
  wireSample({ submit: 'submit', emailId: 'adv-email', statusId: 'adv-status', doneId: 'adv-done',
    extra: ['adv-name', 'adv-firm'], errColor: '#9c3524', okColor: '#55606b',
    onSent: function () { show('notSent', false); show('sent', true); } });

  /* Subscribe form (homepage) */
  var sub = $('form[data-on="submitSub"]');
  if (sub) {
    var subEmail = document.getElementById('email');
    var subStatus = document.getElementById('sub-status');
    subEmail.addEventListener('input', function () {
      if (subEmail.getAttribute('aria-invalid') === 'true' && !emailProblem(subEmail.value)) {
        subEmail.setAttribute('aria-invalid', 'false'); subEmail.style.borderColor = '#55606b'; say(subStatus, '');
      }
    });
    sub.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = emailProblem(subEmail.value);
      if (p) {
        subEmail.setAttribute('aria-invalid', 'true'); subEmail.style.borderColor = '#9c3524';
        say(subStatus, p === 'empty' ? 'Enter your email address to subscribe.'
          : 'That email looks incomplete. It needs an @ and a domain, like name@example.com.', '#9c3524');
        subEmail.focus();
        return;
      }
      if (!CFG.substackUrl) { say(subStatus, 'Subscriptions open soon. Check back in a few days.', '#55606b'); return; }
      say(subStatus, 'Taking you to Substack to confirm…', '#1e6b44');
      var base = CFG.substackUrl.replace(/\/+$/, '');
      location.href = base + '/subscribe?email=' + encodeURIComponent(subEmail.value.trim());
    });
  }

  /* Research page theme filter */
  var themeBtns = $all('button[data-theme]');
  if (themeBtns.length) {
    var cards = $all('[data-themes]');
    var result = $('[data-result]');
    var emptyName = $('[data-empty-theme]');
    var pick = function (name) {
      var n = 0;
      cards.forEach(function (c) {
        var on = name === 'All' || c.getAttribute('data-themes').split('|').indexOf(name) !== -1;
        c.style.display = on ? '' : 'none';
        if (on) n++;
      });
      themeBtns.forEach(function (b) {
        var on = b.getAttribute('data-theme') === name;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.background = on ? '#12324f' : '#ffffff';
        b.style.color = on ? '#ffffff' : '#0f1f2e';
        b.style.borderColor = on ? '#12324f' : '#d9d3c7';
      });
      var lower = name.toLowerCase();
      if (result) {
        result.textContent = name === 'All'
          ? (n === 1 ? '1 note published so far.' : n + ' notes published so far.')
          : (n === 0 ? 'No notes on ' + lower + ' yet.' : (n === 1 ? '1 note on ' : n + ' notes on ') + lower + '.');
      }
      if (emptyName) emptyName.textContent = lower;
      show('isEmpty', n === 0);
    };
    themeBtns.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-theme')); }); });
    $all('[data-on="showAll"], [data-show-all]').forEach(function (b) { b.addEventListener('click', function () { pick('All'); }); });
  }

  /* Close the phone menu after choosing a link (same-page anchors) */
  $all('.nav-menu').forEach(function (d) {
    $all('a', d).forEach(function (a) { a.addEventListener('click', function () { d.removeAttribute('open'); }); });
  });
})();
