import { renderDocument, renderHeader, renderFooter } from '../layout.js';
import { renderHead, escapeHtml, textToHtmlParagraphs, articleJsonLd, breadcrumbJsonLd } from '../seo.js';
import { getAllContent, getPublishedArticles, getArticleBySlug } from '../db.js';

function articleCard(a) {
  const date = new Date(a.published_at).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
  return `
  <article class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between p-6">
    <div>
      <div class="flex justify-between items-center text-xs text-slate-500 mb-3">
        <span class="bg-navy-100 text-navy-900 font-bold px-2.5 py-1 rounded-md">${escapeHtml(a.category_label)}</span>
        <span><i class="fa-regular fa-clock ml-1"></i>${escapeHtml(date)}</span>
      </div>
      <h2 class="font-bold text-lg text-slate-900 mb-2 leading-snug">${escapeHtml(a.title)}</h2>
      <p class="text-slate-600 text-sm leading-relaxed mb-4">${escapeHtml(a.excerpt)}</p>
    </div>
    <a href="/blog/${escapeHtml(a.slug)}" class="text-navy-900 hover:text-navy-800 text-xs font-bold flex items-center gap-1 mt-2">
      <span>קריאת המאמר המלא</span><i class="fa-solid fa-arrow-left"></i>
    </a>
  </article>`;
}

export async function renderBlogIndex(env) {
  const [c, articles] = await Promise.all([getAllContent(env), getPublishedArticles(env)]);
  const siteUrl = c.seo_site_url || '';

  const head = renderHead({
    title: `תבעתי ונושעתי - מרכז ידע משפטי | ${c.site_title}`,
    description: c.knowledge_subheading || c.seo_default_description,
    canonical: `${siteUrl}/blog`,
    jsonLd: breadcrumbJsonLd([
      { name: 'דף הבית', url: `${siteUrl}/` },
      { name: 'תבעתי ונושעתי', url: `${siteUrl}/blog` },
    ]),
  });

  const body = `
${renderHeader(c, { activePath: '/blog' })}
<section class="py-16 bg-navy-900 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <span class="text-xs font-bold text-silver-300 uppercase tracking-widest">מרכז ידע</span>
    <h1 class="text-3xl sm:text-4xl font-black mt-2">${escapeHtml(c.knowledge_heading)}</h1>
    <p class="text-slate-300 mt-3 max-w-2xl mx-auto">${escapeHtml(c.knowledge_subheading)}</p>
  </div>
</section>
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-3 gap-8">
      ${articles.map(articleCard).join('') || '<p class="text-slate-500 text-sm col-span-3 text-center">מאמרים יתווספו בקרוב.</p>'}
    </div>
  </div>
</section>
${renderFooter(c)}`;

  return renderDocument({ head, body });
}

export async function renderArticle(env, slug) {
  const [c, article] = await Promise.all([getAllContent(env), getArticleBySlug(env, slug)]);
  if (!article) return null;
  const siteUrl = c.seo_site_url || '';
  const date = new Date(article.published_at).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });

  const head = renderHead({
    title: article.seo_title || `${article.title} | ${c.site_title}`,
    description: article.seo_description || article.excerpt,
    canonical: `${siteUrl}/blog/${article.slug}`,
    jsonLd: [
      articleJsonLd(article, siteUrl, c.site_name_short),
      breadcrumbJsonLd([
        { name: 'דף הבית', url: `${siteUrl}/` },
        { name: 'תבעתי ונושעתי', url: `${siteUrl}/blog` },
        { name: article.title, url: `${siteUrl}/blog/${article.slug}` },
      ]),
    ],
  });

  const body = `
${renderHeader(c, { activePath: '/blog' })}
<article class="py-16 bg-white">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="text-xs text-slate-500 mb-6 flex gap-2">
      <a href="/" class="hover:text-navy-900">דף הבית</a><span>/</span>
      <a href="/blog" class="hover:text-navy-900">תבעתי ונושעתי</a>
    </nav>
    <span class="bg-navy-100 text-navy-900 font-bold px-3 py-1 rounded-md text-xs">${escapeHtml(article.category_label)}</span>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-3 leading-snug">${escapeHtml(article.title)}</h1>
    <p class="text-slate-500 text-sm mb-8"><i class="fa-regular fa-clock ml-1"></i>${escapeHtml(date)} &middot; ${escapeHtml(c.site_name_short)}, עו"ד</p>
    <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4">
      ${textToHtmlParagraphs(article.content)}
    </div>
    <div class="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-slate-700 font-medium">מתמודדים עם מקרה דומה? נשמח לבחון את התיק שלכם ללא התחייבות.</p>
      <a href="/#contact" class="bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap">לפנייה למשרד</a>
    </div>
  </div>
</article>
${renderFooter(c)}`;

  return renderDocument({ head, body });
}
