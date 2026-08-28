export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Content stored in D1 is plain text with real line breaks; render as safe paragraphs.
export function textToHtmlParagraphs(text) {
  return String(text ?? '')
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function renderHead({ title, description, canonical, content, jsonLd }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const jsonLdScripts = (Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n');
  return `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:locale" content="he_IL">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="robots" content="index, follow">
    ${jsonLdScripts}
    ${content || ''}
  `;
}

export function legalServiceJsonLd(c, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: c.site_title,
    image: `${siteUrl}/assets/logo.svg`,
    telephone: c.contact_phone,
    email: c.contact_email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.contact_address,
      addressLocality: 'פתח תקווה',
      addressCountry: 'IL',
    },
    areaServed: 'IL',
    priceRange: '$$',
    url: siteUrl,
  };
}

export function articleJsonLd(article, siteUrl, authorName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seo_description || article.excerpt,
    articleSection: article.category_label,
    datePublished: article.published_at,
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: authorName },
    mainEntityOfPage: `${siteUrl}/blog/${article.slug}`,
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
