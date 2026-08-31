import { renderDocument, renderHeader, renderFooter } from '../layout.js';
import { renderHead, escapeHtml, legalServiceJsonLd } from '../seo.js';
import { getAllContent, getPracticeAreas, getPublishedArticles, getVideos } from '../db.js';

function practiceCard(p) {
  return `
  <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:border-navy-800">
    <div>
      <div class="w-14 h-14 rounded-xl bg-navy-900 text-silver-300 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
        <i class="fa-solid ${escapeHtml(p.icon)}"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900 mb-3">${escapeHtml(p.title)}</h3>
      <p class="text-slate-600 text-sm leading-relaxed mb-4">${escapeHtml(p.summary)}</p>
    </div>
    <a href="/practice-areas/${escapeHtml(p.slug)}" class="text-navy-900 hover:text-navy-800 text-xs font-bold flex items-center gap-1 mt-2 border-t border-slate-200 pt-4">
      <span>לפרטים נוספים</span><i class="fa-solid fa-arrow-left"></i>
    </a>
  </div>`;
}

function articleCard(a) {
  const date = new Date(a.published_at).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
  return `
  <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between p-6">
    <div>
      <div class="flex justify-between items-center text-xs text-slate-500 mb-3">
        <span class="bg-navy-100 text-navy-900 font-bold px-2.5 py-1 rounded-md">${escapeHtml(a.category_label)}</span>
        <span><i class="fa-regular fa-clock ml-1"></i>${escapeHtml(date)}</span>
      </div>
      <h3 class="font-bold text-lg text-slate-900 mb-2 leading-snug">${escapeHtml(a.title)}</h3>
      <p class="text-slate-600 text-sm leading-relaxed mb-4">${escapeHtml(a.excerpt)}</p>
    </div>
    <a href="/blog/${escapeHtml(a.slug)}" class="text-navy-900 hover:text-navy-800 text-xs font-bold flex items-center gap-1 mt-2">
      <span>קריאת המאמר המלא</span><i class="fa-solid fa-arrow-left"></i>
    </a>
  </div>`;
}

function videoCard(v) {
  return `
  <div class="bg-navy-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-silver-300 transition group relative overflow-hidden">
    <div class="aspect-[9/16] bg-slate-950 rounded-xl mb-4 relative flex items-center justify-center border border-slate-800 group-hover:border-slate-700">
      <div class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition">
        <i class="fa-solid fa-play mr-0.5"></i>
      </div>
      <span class="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">0:30</span>
      <span class="absolute bottom-3 right-3 bg-navy-900/90 text-silver-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">סליחה יש לך חצי דקה?</span>
    </div>
    <div>
      <h4 class="font-bold text-white text-sm mb-1 line-clamp-1">${escapeHtml(v.title)}</h4>
      <p class="text-xs text-slate-400 line-clamp-2">${escapeHtml(v.description)}</p>
    </div>
  </div>`;
}

export async function renderHome(env) {
  const [c, practiceAreas, articles, videos] = await Promise.all([
    getAllContent(env),
    getPracticeAreas(env),
    getPublishedArticles(env, { limit: 3 }),
    getVideos(env),
  ]);
  const siteUrl = c.seo_site_url || '';

  const head = renderHead({
    title: c.seo_default_title,
    description: c.seo_default_description,
    canonical: `${siteUrl}/`,
    jsonLd: legalServiceJsonLd(c, siteUrl),
  });

  const body = `
${renderHeader(c, { activePath: '/' })}

<section class="relative bg-mesh text-white py-20 lg:py-28 overflow-hidden border-b border-slate-800">
  <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#C0C0C0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6 text-center lg:text-right">
        <div class="inline-flex items-center gap-2 bg-navy-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs sm:text-sm text-silver-300 shadow-inner">
          <i class="fa-solid fa-shield-halved text-emerald-400"></i>
          <span class="font-medium">${escapeHtml(c.hero_badge)}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
          ${escapeHtml(c.hero_title_line1)}<br>
          <span class="silver-gradient-text">${escapeHtml(c.hero_title_line2)}</span>
        </h1>
        <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
          ${escapeHtml(c.hero_paragraph)}
        </p>
        <div class="grid grid-cols-3 gap-3 sm:gap-4 pt-2 max-w-xl mx-auto lg:mx-0">
          <div class="bg-navy-800/50 border border-slate-800 rounded-xl p-3 text-center">
            <i class="fa-solid fa-graduation-cap text-silver-300 text-xl mb-1.5"></i>
            <div class="text-xs sm:text-sm font-bold text-white">${escapeHtml(c.hero_pillar1_title)}</div>
            <div class="text-[11px] text-slate-400 hidden sm:block">${escapeHtml(c.hero_pillar1_sub)}</div>
          </div>
          <div class="bg-navy-800/50 border border-slate-800 rounded-xl p-3 text-center">
            <i class="fa-solid fa-user-doctor text-silver-300 text-xl mb-1.5"></i>
            <div class="text-xs sm:text-sm font-bold text-white">${escapeHtml(c.hero_pillar2_title)}</div>
            <div class="text-[11px] text-slate-400 hidden sm:block">${escapeHtml(c.hero_pillar2_sub)}</div>
          </div>
          <div class="bg-navy-800/50 border border-slate-800 rounded-xl p-3 text-center">
            <i class="fa-solid fa-lightbulb text-silver-300 text-xl mb-1.5"></i>
            <div class="text-xs sm:text-sm font-bold text-white">${escapeHtml(c.hero_pillar3_title)}</div>
            <div class="text-[11px] text-slate-400 hidden sm:block">${escapeHtml(c.hero_pillar3_sub)}</div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
          <a href="#contact" class="bg-gradient-to-r from-slate-100 to-slate-300 hover:from-white hover:to-slate-200 text-navy-950 font-bold px-8 py-4 rounded-xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3">
            <i class="fa-solid fa-paper-plane text-navy-900"></i><span>לפנייה וייעוץ אישי חסוי</span>
          </a>
          <a href="/blog" class="bg-navy-800/90 hover:bg-navy-800 text-slate-200 hover:text-white border border-slate-700 px-6 py-4 rounded-xl font-medium transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-book-open text-silver-300"></i><span>"תבעתי ונושעתי" - מאמרים ומקרים</span>
          </a>
        </div>
      </div>

      <div class="lg:col-span-5 flex justify-center">
        <div class="relative w-full max-w-md bg-gradient-to-b from-navy-800/90 to-navy-950/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div class="absolute -top-3 right-6 bg-silver-300 text-navy-950 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">משרד עורכי דין</div>
          <div class="flex items-center gap-4 mb-6 pt-2">
            <div class="w-16 h-16 rounded-full bg-white border-2 border-silver-300/50 flex items-center justify-center p-2 shadow"><img src="/assets/logo.png" alt="לוגו" class="w-full h-full object-contain"></div>
            <div>
              <h3 class="text-xl font-bold text-white">${escapeHtml(c.site_name_short)}, עו"ד</h3>
              <p class="text-xs text-silver-300">נזיקין • רשלנות רפואית • ביטוח • אזרחי</p>
            </div>
          </div>
          <div class="space-y-3 border-t border-b border-slate-800 py-4 mb-6 text-sm">
            <div class="flex items-start gap-3 text-slate-300"><i class="fa-solid fa-check-circle text-emerald-400 mt-1"></i><span>ניסיון עשיר בייצוג בבתי משפט ובניהול תיקים סבוכים</span></div>
            <div class="flex items-start gap-3 text-slate-300"><i class="fa-solid fa-check-circle text-emerald-400 mt-1"></i><span>היכרות מעמיקה של מערכת הבריאות וחברות הביטוח</span></div>
            <div class="flex items-start gap-3 text-slate-300"><i class="fa-solid fa-check-circle text-emerald-400 mt-1"></i><span>ליווי אישי בגובה העיניים, בשקילות ובדיסקרטיות מלאה</span></div>
          </div>
          <div class="space-y-3">
            <p class="text-xs text-slate-400 font-medium">השאירו פרטים ונחזור אליכם בהקדם:</p>
            <form data-lead-form="hero_quick_form" class="space-y-2">
              <input type="text" name="name" placeholder="שם מלא" required class="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-silver-300">
              <input type="tel" name="phone" placeholder="מספר טלפון" required pattern="0[0-9\\-\\s]{8,12}" class="w-full bg-navy-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-silver-300">
              <button type="submit" class="w-full bg-slate-200 hover:bg-white text-navy-950 font-bold py-2.5 rounded-lg text-sm transition">שליחת פנייה מהירה</button>
              <p data-form-status class="text-xs text-slate-500"></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="practices" class="py-20 bg-white scroll-mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-xs font-bold text-navy-900 uppercase tracking-widest mb-2">תחומי הליבה והתמחות המשרד</h2>
      <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">מעטפת משפטית מקצועית ויצירתית</p>
      <div class="w-16 h-1 bg-navy-900 mx-auto mt-4 rounded-full"></div>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      ${practiceAreas.map(practiceCard).join('')}
    </div>
  </div>
</section>

<section id="about" class="py-20 bg-slate-100 border-t border-b border-slate-200 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 relative">
        <div class="relative z-10 bg-navy-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div class="text-center pb-6 border-b border-slate-800">
            <div class="w-24 h-24 rounded-full bg-white border-4 border-silver-300 mx-auto mb-4 flex items-center justify-center p-3 shadow"><img src="/assets/logo.png" alt="לוגו" class="w-full h-full object-contain"></div>
            <h3 class="text-2xl font-bold">${escapeHtml(c.site_title)}</h3>
            <p class="text-silver-300 text-sm font-medium">מייסד ובעל המשרד</p>
          </div>
          <div class="pt-6 space-y-4 text-sm text-slate-300">
            <div class="flex items-start gap-3"><i class="fa-solid fa-award text-yellow-500 text-lg mt-0.5"></i><span>${escapeHtml(c.about_credential1)}</span></div>
            <div class="flex items-start gap-3"><i class="fa-solid fa-briefcase text-silver-300 text-lg mt-0.5"></i><span>${escapeHtml(c.about_credential2)}</span></div>
            <div class="flex items-start gap-3"><i class="fa-solid fa-stethoscope text-emerald-400 text-lg mt-0.5"></i><span>${escapeHtml(c.about_credential3)}</span></div>
          </div>
        </div>
        <div class="absolute -bottom-4 -left-4 w-full h-full bg-slate-300 rounded-3xl -z-0 hidden sm:block"></div>
      </div>
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-block bg-navy-100 text-navy-900 font-bold text-xs uppercase px-3 py-1 rounded-full">${escapeHtml(c.about_badge)}</div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug">${escapeHtml(c.about_heading)}</h2>
        <p class="text-slate-700 leading-relaxed text-base">${escapeHtml(c.about_paragraph1)}</p>
        <p class="text-slate-700 leading-relaxed text-base">${escapeHtml(c.about_paragraph2)}</p>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl flex-shrink-0"><i class="fa-solid fa-quote-right"></i></div>
          <p class="text-sm font-medium text-slate-800 italic">"${escapeHtml(c.about_quote)}"</p>
        </div>
        ${c.team_member2_name ? `
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center text-lg flex-shrink-0"><i class="fa-solid fa-user-tie"></i></div>
          <div>
            <p class="text-sm font-bold text-slate-900">${escapeHtml(c.team_member2_name)}</p>
            <p class="text-xs text-slate-500">${escapeHtml(c.team_member2_title)}</p>
          </div>
        </div>` : ''}
      </div>
    </div>
  </div>
</section>

<section id="knowledge" class="py-20 bg-white scroll-mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <span class="text-xs font-bold text-navy-900 uppercase tracking-widest block mb-1">מרכז ידע וסיפורי הצלחה</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900">${escapeHtml(c.knowledge_heading)}</h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base max-w-xl">${escapeHtml(c.knowledge_subheading)}</p>
      </div>
      <a href="/blog" class="bg-navy-900 hover:bg-navy-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap">כל המאמרים</a>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      ${articles.map(articleCard).join('') || '<p class="text-slate-500 text-sm col-span-3 text-center">מאמרים יתווספו בקרוב.</p>'}
    </div>
  </div>
</section>

<section id="shorts" class="py-20 bg-navy-950 text-white border-t border-b border-slate-800 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-red-500/30">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span><span>סדרת סרטוני טיפים משפטיים</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-black">${escapeHtml(c.shorts_heading)}</h2>
      <p class="text-slate-400 mt-3 text-sm sm:text-base">${escapeHtml(c.shorts_subheading)}</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${videos.map(videoCard).join('') || '<p class="text-slate-400 text-sm col-span-4 text-center">סרטונים יתווספו בקרוב.</p>'}
    </div>
  </div>
</section>

<section id="contact" class="py-20 bg-slate-50 scroll-mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div class="grid lg:grid-cols-12">
        <div class="lg:col-span-5 bg-navy-900 text-white p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 mb-6"><img src="/assets/logo.png" alt="לוגו" class="w-full h-full object-contain"></div>
            <h3 class="text-2xl font-bold mb-3">${escapeHtml(c.contact_heading)}</h3>
            <p class="text-slate-300 text-sm mb-8 leading-relaxed">${escapeHtml(c.contact_paragraph)}</p>
            <div class="space-y-6 text-sm">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-silver-300 flex-shrink-0"><i class="fa-solid fa-location-dot"></i></div>
                <div><div class="font-bold text-white">כתובת המשרד</div><div class="text-slate-300 text-xs">${escapeHtml(c.contact_address_full)}</div></div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-silver-300 flex-shrink-0"><i class="fa-solid fa-phone"></i></div>
                <div><div class="font-bold text-white">טלפון ופקס</div><div class="text-slate-300 text-xs">טלפון: ${escapeHtml(c.contact_phone)} | פקס: ${escapeHtml(c.contact_fax)}</div></div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-silver-300 flex-shrink-0"><i class="fa-solid fa-mobile-screen"></i></div>
                <div><div class="font-bold text-white">נייד ואישי</div><div class="text-slate-300 text-xs">${escapeHtml(c.contact_mobile)}</div></div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-silver-300 flex-shrink-0"><i class="fa-solid fa-envelope"></i></div>
                <div><div class="font-bold text-white">דוא"ל</div><div class="text-slate-300 text-xs">${escapeHtml(c.contact_email)}</div></div>
              </div>
            </div>
          </div>
          <div class="pt-8 border-t border-slate-800 mt-8 flex gap-3">
            <a href="https://wa.me/${escapeHtml(c.contact_whatsapp)}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs text-center transition flex items-center justify-center gap-2"><i class="fa-brands fa-whatsapp text-lg"></i><span>וואטסאפ משרדי</span></a>
            <a href="tel:${escapeHtml(c.contact_mobile).replace(/[^0-9+]/g, '')}" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-xs text-center transition flex items-center justify-center gap-2 border border-slate-700"><i class="fa-solid fa-phone"></i><span>חיוג מהיר</span></a>
          </div>
        </div>

        <div class="lg:col-span-7 p-8 sm:p-12">
          <h4 class="text-2xl font-bold text-slate-900 mb-2">טופס השארת פרטים</h4>
          <p class="text-slate-500 text-sm mb-6">מלאו את הפרטים ונחזור אליכם בהקדם האפשרי. הפנייה חסויה ודיסקרטית.</p>
          <form data-lead-form="contact_form" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div><label class="block text-xs font-bold text-slate-700 mb-1">שם מלא *</label><input type="text" name="name" required class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"></div>
              <div><label class="block text-xs font-bold text-slate-700 mb-1">מספר טלפון *</label><input type="tel" name="phone" required pattern="0[0-9\\-\\s]{8,12}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"></div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div><label class="block text-xs font-bold text-slate-700 mb-1">דוא"ל</label><input type="email" name="email" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"></div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">תחום הפנייה</label>
                <select name="category" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900">
                  <option value="רשלנות רפואית">רשלנות רפואית</option>
                  <option value="תאונות דרכים / נזיקין">תאונות דרכים / נזיקין</option>
                  <option value="תביעת ביטוח / אובדן כושר">תביעת ביטוח / אובדן כושר</option>
                  <option value="ייצוג אזרחי-מסחרי">ייצוג אזרחי-מסחרי</option>
                  <option value="אחר">נושא אחר</option>
                </select>
              </div>
            </div>
            <div><label class="block text-xs font-bold text-slate-700 mb-1">תיאור תמציתי של המקרה</label><textarea name="message" rows="4" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900" placeholder="אנא פרטו בקצרה במה מדובר..."></textarea></div>
            <button type="submit" class="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"><i class="fa-solid fa-paper-plane"></i><span>שליחת פנייה לצוות המשרד</span></button>
            <p data-form-status class="text-xs text-slate-500"></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

${renderFooter(c)}`;

  return renderDocument({ head, body });
}
