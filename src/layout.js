import { escapeHtml } from './seo.js';

export function renderDocument({ head, body }) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Frank+Ruhl+Libre:wght@500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/fontawesome/css/all.min.css">
<link rel="stylesheet" href="/assets/tailwind.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
${head}
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased selection:bg-navy-800 selection:text-white">
${body}
</body>
</html>`;
}

export function renderHeader(c, { activePath = '/' } = {}) {
  const phone = escapeHtml(c.contact_phone);
  const mobile = escapeHtml(c.contact_mobile);
  const address = escapeHtml(c.contact_address);
  const nameShort = escapeHtml(c.site_name_short);
  const tagline = escapeHtml(c.site_tagline);
  const wa = escapeHtml(c.contact_whatsapp);

  const navLink = (href, label, extra = '') =>
    `<a href="${href}" class="text-slate-200 hover:text-silver-300 transition py-1 border-b-2 ${activePath === href ? 'border-silver-300 text-silver-300' : 'border-transparent'}">${extra}${label}</a>`;

  return `
  <div class="bg-navy-950 text-slate-300 text-xs sm:text-sm py-2 px-4 border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
      <div class="flex items-center gap-4 sm:gap-6">
        <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="hover:text-white transition flex items-center gap-1.5">
          <i class="fa-solid fa-phone text-silver-300"></i><span>${phone}</span>
        </a>
        <a href="tel:${mobile.replace(/[^0-9+]/g, '')}" class="hover:text-white transition flex items-center gap-1.5">
          <i class="fa-solid fa-mobile-screen text-silver-300"></i><span>${mobile}</span>
        </a>
        <span class="hidden md:inline-flex items-center gap-1.5 text-slate-400">
          <i class="fa-solid fa-location-dot text-silver-300"></i><span>${address}</span>
        </span>
      </div>
      <div class="flex items-center gap-3">
        <a href="/admin" class="bg-slate-800/90 hover:bg-slate-700 text-silver-300 hover:text-white px-3 py-1 rounded-md text-xs font-medium border border-slate-700 transition flex items-center gap-1.5">
          <i class="fa-solid fa-user-gear"></i><span>מערכת ניהול</span>
        </a>
      </div>
    </div>
  </div>

  <header class="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 group">
        <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-inner group-hover:border-silver-300 transition duration-300">
          <img src="/assets/logo.png" alt="לוגו ${nameShort}" class="w-full h-full object-contain">
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-xl tracking-tight leading-tight text-white group-hover:text-silver-300 transition">${nameShort}</span>
          <span class="text-xs tracking-widest text-silver-300 font-light uppercase">${tagline}</span>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-8 text-sm font-medium">
        ${navLink('/#about', 'אודות המשרד')}
        ${navLink('/#practices', 'תחומי עיסוק')}
        ${navLink('/blog', 'תבעתי ונושעתי')}
        ${navLink('/#shorts', 'סליחה, יש לך חצי דקה?', '<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block ml-1.5"></span>')}
        ${navLink('/#contact', 'צור קשר')}
      </nav>

      <div class="hidden sm:flex items-center gap-3">
        <a href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition shadow-lg flex items-center justify-center">
          <i class="fa-brands fa-whatsapp text-lg"></i>
        </a>
        <a href="/#contact" class="bg-gradient-to-r from-slate-200 to-slate-300 hover:from-white hover:to-slate-200 text-navy-950 px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition transform active:scale-95 flex items-center gap-2">
          <i class="fa-solid fa-calendar-check text-navy-900"></i><span>תיאום ייעוץ משפטי</span>
        </a>
      </div>

      <button id="mobileMenuBtn" onclick="document.getElementById('mobileMenu').classList.toggle('hidden')" class="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none">
        <i class="fa-solid fa-bars text-2xl"></i>
      </button>
    </div>

    <div id="mobileMenu" class="hidden lg:hidden bg-navy-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
      <a href="/#about" class="block py-2 text-slate-200 hover:text-white font-medium border-b border-slate-800/50">אודות המשרד</a>
      <a href="/#practices" class="block py-2 text-slate-200 hover:text-white font-medium border-b border-slate-800/50">תחומי עיסוק</a>
      <a href="/blog" class="block py-2 text-slate-200 hover:text-white font-medium border-b border-slate-800/50">תבעתי ונושעתי (מאמרים)</a>
      <a href="/#shorts" class="block py-2 text-slate-200 hover:text-white font-medium border-b border-slate-800/50">פינת הוידאו - חצי דקה</a>
      <a href="/#contact" class="block py-2 text-slate-200 hover:text-white font-medium">צור קשר</a>
      <div class="pt-3 flex flex-col gap-2">
        <a href="/#contact" class="w-full text-center bg-silver-300 text-navy-950 py-2.5 rounded-lg font-bold">תיאום ייעוץ משפטי</a>
        <a href="/admin" class="w-full text-center bg-slate-800 text-slate-200 py-2 rounded-lg font-medium border border-slate-700">כניסה למערכת ניהול</a>
      </div>
    </div>
  </header>`;
}

export function renderFooter(c) {
  const year = new Date().getFullYear();
  return `
  <footer class="bg-navy-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1"><img src="/assets/logo.png" alt="לוגו" class="w-full h-full object-contain"></div>
        <div>
          <div class="font-bold text-white text-sm">${escapeHtml(c.site_name_short)} • משרד עורכי דין</div>
          <div>${escapeHtml(c.footer_note)} © ${year} | ${escapeHtml(c.contact_address)}</div>
        </div>
      </div>
      <div class="flex gap-6 text-slate-400">
        <a href="/#about" class="hover:text-white transition">אודות</a>
        <a href="/#practices" class="hover:text-white transition">תחומי עיסוק</a>
        <a href="/blog" class="hover:text-white transition">תבעתי ונושעתי</a>
        <a href="/#contact" class="hover:text-white transition">צור קשר</a>
      </div>
    </div>
    <p class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-slate-500 leading-relaxed">
      האמור באתר זה הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי. אין להסתמך על האמור לצורך קבלת החלטות משפטיות מבלי להיוועץ בעורך דין.
    </p>
  </footer>
  <script>
    document.addEventListener('submit', function (e) {
      if (!e.target.matches('[data-lead-form]')) return;
      e.preventDefault();
      var form = e.target;
      var status = form.querySelector('[data-form-status]');
      var payload = {
        name: form.querySelector('[name=name]').value,
        phone: form.querySelector('[name=phone]').value,
        email: form.querySelector('[name=email]') ? form.querySelector('[name=email]').value : '',
        category: form.querySelector('[name=category]') ? form.querySelector('[name=category]').value : '',
        message: form.querySelector('[name=message]') ? form.querySelector('[name=message]').value : '',
        source: form.dataset.leadForm || 'contact_form'
      };
      if (status) { status.textContent = 'שולח...'; status.className = 'text-xs text-slate-500 mt-2'; }
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('failed');
        return r.json();
      }).then(function () {
        if (status) { status.textContent = 'הפנייה נשלחה בהצלחה. נחזור אליכם בהקדם האפשרי.'; status.className = 'text-xs text-emerald-600 font-bold mt-2'; }
        form.reset();
      }).catch(function () {
        if (status) { status.textContent = 'אירעה שגיאה בשליחה. ניתן ליצור קשר טלפוני ישירות.'; status.className = 'text-xs text-red-600 font-bold mt-2'; }
      });
    });
  </script>`;
}
