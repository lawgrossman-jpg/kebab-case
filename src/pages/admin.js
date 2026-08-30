import { renderDocument } from '../layout.js';
import { escapeHtml } from '../seo.js';

export function renderLoginPage({ error } = {}) {
  const head = `<title>כניסת מנהל | מערכת ניהול</title><meta name="robots" content="noindex, nofollow">`;
  const body = `
<div class="min-h-screen bg-mesh flex items-center justify-center p-4">
  <div class="w-full max-w-sm bg-navy-900/90 border border-slate-700 rounded-2xl p-8 shadow-2xl">
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 mx-auto mb-3"><img src="/assets/logo.png" alt="לוגו" class="w-full h-full object-contain"></div>
      <h1 class="text-white font-bold text-lg">מערכת ניהול האתר</h1>
      <p class="text-slate-400 text-xs mt-1">כניסה למנהלים בלבד</p>
    </div>
    <form method="POST" action="/api/login" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">סיסמת ניהול</label>
        <input type="password" name="password" required autofocus class="w-full bg-navy-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-silver-300">
      </div>
      ${error ? `<p class="text-red-400 text-xs font-bold">${escapeHtml(error)}</p>` : ''}
      <button type="submit" class="w-full bg-silver-300 hover:bg-white text-navy-950 font-bold py-3 rounded-lg text-sm transition">כניסה</button>
    </form>
    <a href="/" class="block text-center text-slate-500 hover:text-slate-300 text-xs mt-6">חזרה לאתר</a>
  </div>
</div>`;
  return renderDocument({ head, body });
}

export function renderDashboard() {
  const head = `<title>לוח בקרה | מערכת ניהול</title><meta name="robots" content="noindex, nofollow">`;
  const body = `
<div class="min-h-screen bg-slate-100">
  <header class="bg-navy-900 text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-20">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1"><img src="/assets/logo.png" alt="לוגו" class="w-full h-full object-contain"></div>
      <div>
        <h1 class="font-bold text-sm leading-tight">מערכת ניהול האתר</h1>
        <p class="text-xs text-slate-400">עו"ד ישראל גרוסמן</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <a href="/" target="_blank" class="text-xs text-slate-300 hover:text-white flex items-center gap-1.5"><i class="fa-solid fa-arrow-up-left-from-circle"></i><span>צפייה באתר</span></a>
      <button onclick="logout()" class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"><i class="fa-solid fa-right-from-bracket"></i><span>יציאה</span></button>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <nav class="flex flex-wrap gap-2 mb-8">
      <button data-tab="content" class="admin-tab-btn bg-navy-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition">תוכן האתר</button>
      <button data-tab="practices" class="admin-tab-btn bg-white text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-xs font-bold transition">תחומי עיסוק</button>
      <button data-tab="articles" class="admin-tab-btn bg-white text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-xs font-bold transition">מאמרים</button>
      <button data-tab="videos" class="admin-tab-btn bg-white text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-xs font-bold transition">סרטונים</button>
      <button data-tab="leads" class="admin-tab-btn bg-white text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2">
        <span>פניות נכנסות</span><span id="leadCountBadge" class="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">0</span>
      </button>
    </nav>

    <div id="panel-content" class="admin-panel space-y-6"></div>
    <div id="panel-practices" class="admin-panel space-y-6 hidden"></div>
    <div id="panel-articles" class="admin-panel space-y-6 hidden"></div>
    <div id="panel-videos" class="admin-panel space-y-6 hidden"></div>
    <div id="panel-leads" class="admin-panel space-y-6 hidden"></div>
  </div>
</div>

<script>
const CONTENT_GROUPS = [
  { title: 'פרטי התקשרות', fields: [
    ['contact_phone','טלפון משרד'], ['contact_mobile','נייד'], ['contact_fax','פקס'],
    ['contact_email','דוא"ל'], ['contact_address','כתובת (קצר)'], ['contact_address_full','כתובת מלאה'],
    ['contact_whatsapp','מספר וואטסאפ (בפורמט בינלאומי, לדוגמה 972501234567)']
  ]},
  { title: 'זהות האתר', fields: [
    ['site_title','שם המשרד המלא'], ['site_name_short','שם קצר'], ['site_tagline','תגית תחת השם']
  ]},
  { title: 'אזור עליון (Hero)', fields: [
    ['hero_badge','תגית עליונה'], ['hero_title_line1','כותרת - שורה 1'], ['hero_title_line2','כותרת - שורה 2 (מודגשת)'],
    ['hero_paragraph','פסקת פתיחה', 'textarea'],
    ['hero_pillar1_title','עמוד 1 - כותרת'], ['hero_pillar1_sub','עמוד 1 - תת כותרת'],
    ['hero_pillar2_title','עמוד 2 - כותרת'], ['hero_pillar2_sub','עמוד 2 - תת כותרת'],
    ['hero_pillar3_title','עמוד 3 - כותרת'], ['hero_pillar3_sub','עמוד 3 - תת כותרת']
  ]},
  { title: 'אודות המשרד', fields: [
    ['about_badge','תגית'], ['about_heading','כותרת'],
    ['about_paragraph1','פסקה 1','textarea'], ['about_paragraph2','פסקה 2','textarea'],
    ['about_quote','ציטוט'],
    ['about_credential1','נקודת ניסיון 1'], ['about_credential2','נקודת ניסיון 2'], ['about_credential3','נקודת ניסיון 3']
  ]},
  { title: 'מרכז ידע', fields: [
    ['knowledge_heading','כותרת'], ['knowledge_subheading','תת כותרת','textarea']
  ]},
  { title: 'סליחה יש לך חצי דקה (וידאו)', fields: [
    ['shorts_heading','כותרת'], ['shorts_subheading','תת כותרת','textarea']
  ]},
  { title: 'יצירת קשר', fields: [
    ['contact_heading','כותרת'], ['contact_paragraph','פסקה','textarea']
  ]},
  { title: 'הגדרות SEO', fields: [
    ['seo_default_title','כותרת ברירת מחדל (Title Tag)'],
    ['seo_default_description','תיאור ברירת מחדל (Meta Description)','textarea'],
    ['seo_site_url','כתובת האתר המלאה (https://...)']
  ]},
  { title: 'פוטר', fields: [
    ['footer_note','טקסט זכויות יוצרים']
  ]}
];

async function api(path, options) {
  const res = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options));
  if (res.status === 401) { window.location.href = '/admin'; throw new Error('unauthorized'); }
  if (!res.ok) throw new Error('request failed: ' + res.status);
  return res.json();
}

function logout() {
  fetch('/api/logout', { method: 'POST' }).then(() => { window.location.href = '/admin'; });
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// ---------- Content tab ----------
async function renderContentPanel() {
  const panel = document.getElementById('panel-content');
  const data = await api('/api/admin/content');
  panel.innerHTML = '';
  CONTENT_GROUPS.forEach(function (group) {
    const card = el('<div class="bg-white border border-slate-200 rounded-2xl p-6"><h3 class="font-bold text-slate-900 mb-4">' + group.title + '</h3><div class="grid sm:grid-cols-2 gap-4" data-fields></div><button class="mt-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg" data-save>שמירת שינויים</button><span class="text-xs text-emerald-600 font-bold mr-3 hidden" data-saved>נשמר בהצלחה</span></div>');
    const fieldsWrap = card.querySelector('[data-fields]');
    group.fields.forEach(function (f) {
      const key = f[0], label = f[1], type = f[2] || 'text';
      const value = data[key] || '';
      const wrap = document.createElement('div');
      if (type === 'textarea' ) wrap.className = 'sm:col-span-2';
      wrap.innerHTML = '<label class="block text-xs font-bold text-slate-700 mb-1">' + label + '</label>' +
        (type === 'textarea'
          ? '<textarea rows="3" data-key="' + key + '" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"></textarea>'
          : '<input type="text" data-key="' + key + '" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">');
      fieldsWrap.appendChild(wrap);
      wrap.querySelector('[data-key]').value = value;
    });
    card.querySelector('[data-save]').addEventListener('click', async function () {
      const entries = {};
      fieldsWrap.querySelectorAll('[data-key]').forEach(function (inp) { entries[inp.dataset.key] = inp.value; });
      await api('/api/admin/content', { method: 'PUT', body: JSON.stringify(entries) });
      const badge = card.querySelector('[data-saved]');
      badge.classList.remove('hidden');
      setTimeout(function () { badge.classList.add('hidden'); }, 2000);
    });
    panel.appendChild(card);
  });
}

// ---------- Practice areas tab ----------
async function renderPracticesPanel() {
  const panel = document.getElementById('panel-practices');
  const items = await api('/api/admin/practice-areas');
  panel.innerHTML = '<div class="flex justify-between items-center mb-2"><h3 class="font-bold text-slate-900">תחומי עיסוק</h3><button id="newPracticeBtn" class="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">הוספת תחום</button></div><div id="practiceList" class="space-y-4"></div>';
  const list = document.getElementById('practiceList');
  items.forEach(function (item) { list.appendChild(practiceCard(item)); });
  document.getElementById('newPracticeBtn').addEventListener('click', function () {
    list.prepend(practiceCard({ id: null, title: '', icon: 'fa-scale-balanced', summary: '', content: '', seo_title: '', seo_description: '' }, true));
  });
}

function practiceCard(item, isNew) {
  const card = el('<div class="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"></div>');
  card.innerHTML =
    '<div class="grid sm:grid-cols-2 gap-3">' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">כותרת</label><input type="text" data-f="title" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">אייקון (Font Awesome, לדוגמה fa-scale-balanced)</label><input type="text" data-f="icon" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '</div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תקציר (מוצג בכרטיס בעמוד הבית)</label><textarea rows="2" data-f="summary" class="w-full border rounded-lg px-3 py-2 text-sm"></textarea></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תוכן מלא (בעמוד הייעודי)</label><textarea rows="4" data-f="content" class="w-full border rounded-lg px-3 py-2 text-sm"></textarea></div>' +
    '<div class="grid sm:grid-cols-2 gap-3">' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">כותרת SEO</label><input type="text" data-f="seo_title" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תיאור SEO</label><input type="text" data-f="seo_description" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '</div>' +
    '<div class="flex justify-between items-center pt-2">' +
    '<button data-del class="text-red-600 text-xs font-bold' + (isNew ? ' hidden' : '') + '">מחיקת תחום</button>' +
    '<button data-save class="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">שמירה</button>' +
    '</div>';
  Object.keys(item).forEach(function (k) {
    const inp = card.querySelector('[data-f="' + k + '"]');
    if (inp) inp.value = item[k] || '';
  });
  card.querySelector('[data-save]').addEventListener('click', async function () {
    const payload = {};
    card.querySelectorAll('[data-f]').forEach(function (i) { payload[i.dataset.f] = i.value; });
    if (item.id) await api('/api/admin/practice-areas/' + item.id, { method: 'PUT', body: JSON.stringify(payload) });
    else await api('/api/admin/practice-areas', { method: 'POST', body: JSON.stringify(payload) });
    renderPracticesPanel();
  });
  if (!isNew) card.querySelector('[data-del]').addEventListener('click', async function () {
    if (!confirm('למחוק תחום עיסוק זה?')) return;
    await api('/api/admin/practice-areas/' + item.id, { method: 'DELETE' });
    renderPracticesPanel();
  });
  return card;
}

// ---------- Articles tab ----------
async function renderArticlesPanel() {
  const panel = document.getElementById('panel-articles');
  const items = await api('/api/admin/articles');
  panel.innerHTML = '<div class="flex justify-between items-center mb-2"><h3 class="font-bold text-slate-900">מאמרים - "תבעתי ונושעתי" / "טעם של עו״ד"</h3><button id="newArticleBtn" class="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">הוספת מאמר</button></div><div id="articleList" class="space-y-4"></div>';
  const list = document.getElementById('articleList');
  items.forEach(function (item) { list.appendChild(articleCard(item)); });
  document.getElementById('newArticleBtn').addEventListener('click', function () {
    list.prepend(articleCard({ id: null, title: '', category: 'malpractice', category_label: 'רשלנות רפואית', excerpt: '', content: '', seo_title: '', seo_description: '', is_published: 1 }, true));
  });
}

function articleCard(item, isNew) {
  const card = el('<div class="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"></div>');
  card.innerHTML =
    '<div class="grid sm:grid-cols-2 gap-3">' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">כותרת</label><input type="text" data-f="title" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תגית קטגוריה (מוצג באתר)</label><input type="text" data-f="category_label" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '</div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תקציר</label><textarea rows="2" data-f="excerpt" class="w-full border rounded-lg px-3 py-2 text-sm"></textarea></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תוכן המאמר המלא</label><textarea rows="6" data-f="content" class="w-full border rounded-lg px-3 py-2 text-sm"></textarea></div>' +
    '<div class="grid sm:grid-cols-2 gap-3">' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">כותרת SEO</label><input type="text" data-f="seo_title" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תיאור SEO</label><input type="text" data-f="seo_description" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '</div>' +
    '<label class="flex items-center gap-2 text-xs font-bold text-slate-700"><input type="checkbox" data-f="is_published"> מפורסם באתר</label>' +
    '<div class="flex justify-between items-center pt-2">' +
    '<button data-del class="text-red-600 text-xs font-bold' + (isNew ? ' hidden' : '') + '">מחיקת מאמר</button>' +
    '<button data-save class="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">שמירה</button>' +
    '</div>';
  Object.keys(item).forEach(function (k) {
    const inp = card.querySelector('[data-f="' + k + '"]');
    if (!inp) return;
    if (inp.type === 'checkbox') inp.checked = !!item[k];
    else inp.value = item[k] || '';
  });
  card.querySelector('[data-save]').addEventListener('click', async function () {
    const payload = { category: item.category || 'malpractice' };
    card.querySelectorAll('[data-f]').forEach(function (i) {
      payload[i.dataset.f] = i.type === 'checkbox' ? i.checked : i.value;
    });
    if (item.id) await api('/api/admin/articles/' + item.id, { method: 'PUT', body: JSON.stringify(payload) });
    else await api('/api/admin/articles', { method: 'POST', body: JSON.stringify(payload) });
    renderArticlesPanel();
  });
  if (!isNew) card.querySelector('[data-del]').addEventListener('click', async function () {
    if (!confirm('למחוק מאמר זה?')) return;
    await api('/api/admin/articles/' + item.id, { method: 'DELETE' });
    renderArticlesPanel();
  });
  return card;
}

// ---------- Videos tab ----------
async function renderVideosPanel() {
  const panel = document.getElementById('panel-videos');
  const items = await api('/api/admin/videos');
  panel.innerHTML = '<div class="flex justify-between items-center mb-2"><h3 class="font-bold text-slate-900">סרטוני "סליחה יש לך חצי דקה?"</h3><button id="newVideoBtn" class="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">הוספת סרטון</button></div><div id="videoList" class="space-y-4"></div>';
  const list = document.getElementById('videoList');
  items.forEach(function (item) { list.appendChild(videoCard(item)); });
  document.getElementById('newVideoBtn').addEventListener('click', function () {
    list.prepend(videoCard({ id: null, title: '', description: '', embed_url: '' }, true));
  });
}

function videoCard(item, isNew) {
  const card = el('<div class="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"></div>');
  card.innerHTML =
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">כותרת</label><input type="text" data-f="title" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">תקציר</label><input type="text" data-f="description" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div><label class="block text-xs font-bold text-slate-700 mb-1">קישור להטמעה (YouTube/Vimeo, אופציונלי)</label><input type="text" data-f="embed_url" class="w-full border rounded-lg px-3 py-2 text-sm"></div>' +
    '<div class="flex justify-between items-center pt-2">' +
    '<button data-del class="text-red-600 text-xs font-bold' + (isNew ? ' hidden' : '') + '">מחיקת סרטון</button>' +
    '<button data-save class="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">שמירה</button>' +
    '</div>';
  Object.keys(item).forEach(function (k) {
    const inp = card.querySelector('[data-f="' + k + '"]');
    if (inp) inp.value = item[k] || '';
  });
  card.querySelector('[data-save]').addEventListener('click', async function () {
    const payload = {};
    card.querySelectorAll('[data-f]').forEach(function (i) { payload[i.dataset.f] = i.value; });
    if (item.id) await api('/api/admin/videos/' + item.id, { method: 'PUT', body: JSON.stringify(payload) });
    else await api('/api/admin/videos', { method: 'POST', body: JSON.stringify(payload) });
    renderVideosPanel();
  });
  if (!isNew) card.querySelector('[data-del]').addEventListener('click', async function () {
    if (!confirm('למחוק סרטון זה?')) return;
    await api('/api/admin/videos/' + item.id, { method: 'DELETE' });
    renderVideosPanel();
  });
  return card;
}

// ---------- Leads tab ----------
async function renderLeadsPanel() {
  const panel = document.getElementById('panel-leads');
  const items = await api('/api/admin/leads');
  document.getElementById('leadCountBadge').textContent = items.filter(function (l) { return !l.is_read; }).length;
  panel.innerHTML = '<h3 class="font-bold text-slate-900 mb-2">פניות נכנסות מטופסי האתר</h3><div id="leadsList" class="space-y-3"></div>';
  const list = document.getElementById('leadsList');
  if (!items.length) { list.innerHTML = '<p class="text-sm text-slate-500 italic">אין פניות עדיין.</p>'; return; }
  items.forEach(function (l) {
    const card = el('<div class="bg-white border border-slate-200 rounded-2xl p-4 text-sm"></div>');
    card.innerHTML =
      '<div class="flex justify-between items-start gap-3">' +
      '<div>' +
      '<div class="font-bold text-slate-900">' + escapeAdmin(l.name) + ' &middot; ' + escapeAdmin(l.phone) + '</div>' +
      '<div class="text-xs text-slate-500 mt-0.5">' + escapeAdmin(l.email || '-') + ' &middot; ' + escapeAdmin(l.category || '-') + ' &middot; ' + new Date(l.created_at).toLocaleString('he-IL') + '</div>' +
      (l.message ? '<div class="text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-2 mt-2">' + escapeAdmin(l.message) + '</div>' : '') +
      '</div>' +
      '<button data-del class="text-red-600 text-xs font-bold whitespace-nowrap">מחיקה</button>' +
      '</div>';
    card.querySelector('[data-del]').addEventListener('click', async function () {
      if (!confirm('למחוק פנייה זו?')) return;
      await api('/api/admin/leads/' + l.id, { method: 'DELETE' });
      renderLeadsPanel();
    });
    list.appendChild(card);
  });
}

function escapeAdmin(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

const renderers = { content: renderContentPanel, practices: renderPracticesPanel, articles: renderArticlesPanel, videos: renderVideosPanel, leads: renderLeadsPanel };
const loaded = {};

function showTab(name) {
  document.querySelectorAll('.admin-tab-btn').forEach(function (btn) {
    const active = btn.dataset.tab === name;
    btn.className = 'admin-tab-btn px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ' + (active ? 'bg-navy-900 text-white' : 'bg-white text-slate-700 border border-slate-300');
  });
  document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.add('hidden'); });
  document.getElementById('panel-' + name).classList.remove('hidden');
  if (!loaded[name]) { loaded[name] = true; renderers[name](); }
}

document.querySelectorAll('.admin-tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { showTab(btn.dataset.tab); });
});

renderLeadsPanel();
showTab('content');
</script>`;
  return renderDocument({ head, body });
}
