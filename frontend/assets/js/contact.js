/* LUXORA - Contact page */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI;
  function init() {
    const s = DB.getSettings();
    document.getElementById('cEmail').textContent = s.contactEmail;
    document.getElementById('cPhone').textContent = s.contactPhone;
    document.getElementById('cAddr').textContent = s.address;

    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      let ok = true;
      ['name', 'email', 'subject', 'message'].forEach(n => {
        const el = form.elements[n];
        const field = el.closest('.field');
        if (!el.value.trim() || (n === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value))) { field.classList.add('invalid'); ok = false; }
        else field.classList.remove('invalid');
      });
      if (ok) { form.reset(); UI.toast('Message sent! We will reply shortly.', 'success'); }
      else UI.toast('Please complete all fields.', 'error');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
