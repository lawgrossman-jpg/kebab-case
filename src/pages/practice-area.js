import { renderDocument, renderHeader, renderFooter } from '../layout.js';
import { renderHead, escapeHtml, textToHtmlParagraphs, breadcrumbJsonLd } from '../seo.js';
import { getAllContent, getPracticeArea, getPracticeAreas } from '../db.js';

export async function renderPracticeAreaPage(env, slug) {
  const [c, area, allAreas] = await Promise.all([
    getAllContent(env),
    getPracticeArea(env, slug),
    getPracticeAreas(env),
  ]);
  if (!area) return null;
  const siteUrl = c.seo_site_url || '';

  const head = renderHead({
    title: area.seo_title || `${area.title} | ${c.site_title}`,
    description: area.seo_description || area.summary,
    canonical: `${siteUrl}/practice-areas/${area.slug}`,
    jsonLd: breadcrumbJsonLd([
      { name: 'דף הבית', url: `${siteUrl}/` },
      { name: 'תחומי עיסוק', url: `${siteUrl}/#practices` },
      { name: area.title, url: `${siteUrl}/practice-areas/${area.slug}` },
    ]),
  });

  const otherAreas = allAreas.filter((a) => a.slug !== slug);

  const body = `
${renderHeader(c, { activePath: '/#practices' })}
<section class="py-16 bg-navy-900 text-white">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="text-xs text-slate-400 mb-6 flex gap-2">
      <a href="/" class="hover:text-white">דף הבית</a><span>/</span>
      <a href="/#practices" class="hover:text-white">תחומי עיסוק</a>
    </nav>
    <div class="w-16 h-16 rounded-xl bg-navy-800 text-silver-300 flex items-center justify-center text-3xl mb-6">
      <i class="fa-solid ${escapeHtml(area.icon)}"></i>
    </div>
    <h1 class="text-3xl sm:text-4xl font-black">${escapeHtml(area.title)}</h1>
    <p class="text-slate-300 mt-3 max-w-2xl">${escapeHtml(area.summary)}</p>
  </div>
</section>
<section class="py-16 bg-white">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-8 prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4">
      ${textToHtmlParagraphs(area.content)}
      <div class="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 not-prose">
        <p class="text-sm text-slate-700 font-medium">רוצים לבדוק אם המקרה שלכם מתאים? נשמח לשוחח ללא התחייבות.</p>
        <a href="/#contact" class="bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap">לפנייה למשרד</a>
      </div>
    </div>
    <aside class="lg:col-span-4">
      <h2 class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">תחומי עיסוק נוספים</h2>
      <div class="space-y-3">
        ${otherAreas
          .map(
            (a) => `
          <a href="/practice-areas/${escapeHtml(a.slug)}" class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-navy-800 transition">
            <div class="w-10 h-10 rounded-lg bg-navy-900 text-silver-300 flex items-center justify-center flex-shrink-0"><i class="fa-solid ${escapeHtml(a.icon)}"></i></div>
            <span class="text-sm font-bold text-slate-800">${escapeHtml(a.title)}</span>
          </a>`
          )
          .join('')}
      </div>
    </aside>
  </div>
</section>
${renderFooter(c)}`;

  return renderDocument({ head, body });
}
