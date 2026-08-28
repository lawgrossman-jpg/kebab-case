// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Mark current page link as active
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Video modal (placeholder — swap data-video with a real embed URL per clip)
  var overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    document.querySelectorAll('[data-video-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        overlay.classList.add('open');
      });
    });
    overlay.querySelectorAll('[data-video-close]').forEach(function (el) {
      el.addEventListener('click', function () { overlay.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') overlay.classList.remove('open');
    });
  }

  // Blog category filter
  var filterButtons = document.querySelectorAll('.filter-btn');
  var articles = document.querySelectorAll('[data-category]');
  if (filterButtons.length && articles.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        articles.forEach(function (card) {
          var show = cat === 'all' || card.getAttribute('data-category') === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Contact forms: client-side validation + confirmation.
  // NOTE: no backend exists yet — wire the fetch() call below to a real
  // endpoint (or a form service) so submissions reach the office inbox.
  document.querySelectorAll('form[data-contact-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');

      var phoneOk = phone && /^0\d{1,2}-?\d{7}$|^0\d{9}$/.test(phone.value.replace(/\s/g, ''));
      if (!name.value.trim() || !phoneOk) {
        status.textContent = 'נא למלא שם וטלפון תקין.';
        status.className = 'form-status error';
        return;
      }

      status.textContent = 'הפנייה נשלחה בהצלחה. נחזור אליכם בהקדם האפשרי.';
      status.className = 'form-status success';
      form.reset();
    });
  });
});
