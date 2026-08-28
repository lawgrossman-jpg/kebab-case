import { slugify } from './slug.js';

export async function getAllContent(env) {
  const { results } = await env.DB.prepare('SELECT key, value FROM site_content').all();
  const map = {};
  for (const row of results) map[row.key] = row.value;
  return map;
}

export async function setContent(env, entries) {
  const stmt = env.DB.prepare(
    "INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now')) " +
    'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
  );
  const batch = Object.entries(entries).map(([key, value]) => stmt.bind(key, String(value ?? '')));
  if (batch.length) await env.DB.batch(batch);
}

export async function getPracticeAreas(env) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM practice_areas ORDER BY sort_order ASC'
  ).all();
  return results;
}

export async function getPracticeArea(env, slug) {
  return env.DB.prepare('SELECT * FROM practice_areas WHERE slug = ?').bind(slug).first();
}

export async function getPracticeAreaById(env, id) {
  return env.DB.prepare('SELECT * FROM practice_areas WHERE id = ?').bind(id).first();
}

export async function createPracticeArea(env, data) {
  const baseSlug = slugify(data.title, 'practice-area');
  let slug = baseSlug;
  let i = 1;
  while (await env.DB.prepare('SELECT 1 FROM practice_areas WHERE slug = ?').bind(slug).first()) {
    slug = `${baseSlug}-${++i}`;
  }
  const { results } = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), 0) as maxOrder FROM practice_areas').all();
  const nextOrder = (results[0]?.maxOrder || 0) + 1;
  await env.DB.prepare(
    `INSERT INTO practice_areas (slug, title, icon, summary, content, seo_title, seo_description, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      slug,
      data.title,
      data.icon || 'fa-scale-balanced',
      data.summary,
      data.content,
      data.seo_title || data.title,
      data.seo_description || data.summary,
      nextOrder
    )
    .run();
  return slug;
}

export async function updatePracticeArea(env, id, data) {
  await env.DB.prepare(
    `UPDATE practice_areas SET title = ?, icon = ?, summary = ?, content = ?, seo_title = ?, seo_description = ? WHERE id = ?`
  )
    .bind(
      data.title,
      data.icon || 'fa-scale-balanced',
      data.summary,
      data.content,
      data.seo_title || data.title,
      data.seo_description || data.summary,
      id
    )
    .run();
}

export async function deletePracticeArea(env, id) {
  await env.DB.prepare('DELETE FROM practice_areas WHERE id = ?').bind(id).run();
}

export async function getPublishedArticles(env, { limit, category } = {}) {
  let query = 'SELECT * FROM articles WHERE is_published = 1';
  const binds = [];
  if (category) {
    query += ' AND category = ?';
    binds.push(category);
  }
  query += ' ORDER BY published_at DESC';
  if (limit) {
    query += ' LIMIT ?';
    binds.push(limit);
  }
  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return results;
}

export async function getAllArticlesForAdmin(env) {
  const { results } = await env.DB.prepare('SELECT * FROM articles ORDER BY published_at DESC').all();
  return results;
}

export async function getArticleBySlug(env, slug) {
  return env.DB.prepare('SELECT * FROM articles WHERE slug = ? AND is_published = 1').bind(slug).first();
}

export async function getArticleById(env, id) {
  return env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first();
}

export async function createArticle(env, data) {
  const baseSlug = slugify(data.title, 'article');
  let slug = baseSlug;
  let i = 1;
  while (await env.DB.prepare('SELECT 1 FROM articles WHERE slug = ?').bind(slug).first()) {
    slug = `${baseSlug}-${++i}`;
  }
  await env.DB.prepare(
    `INSERT INTO articles (slug, title, category, category_label, excerpt, content, seo_title, seo_description, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      slug,
      data.title,
      data.category,
      data.category_label,
      data.excerpt,
      data.content,
      data.seo_title || data.title,
      data.seo_description || data.excerpt,
      data.is_published ? 1 : 0
    )
    .run();
  return slug;
}

export async function updateArticle(env, id, data) {
  await env.DB.prepare(
    `UPDATE articles SET title = ?, category = ?, category_label = ?, excerpt = ?, content = ?,
     seo_title = ?, seo_description = ?, is_published = ? WHERE id = ?`
  )
    .bind(
      data.title,
      data.category,
      data.category_label,
      data.excerpt,
      data.content,
      data.seo_title || data.title,
      data.seo_description || data.excerpt,
      data.is_published ? 1 : 0,
      id
    )
    .run();
}

export async function deleteArticle(env, id) {
  await env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();
}

export async function getVideos(env) {
  const { results } = await env.DB.prepare('SELECT * FROM videos ORDER BY sort_order ASC').all();
  return results;
}

export async function createVideo(env, data) {
  const { results } = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), 0) as maxOrder FROM videos').all();
  const nextOrder = (results[0]?.maxOrder || 0) + 1;
  await env.DB.prepare(
    'INSERT INTO videos (title, description, embed_url, sort_order) VALUES (?, ?, ?, ?)'
  )
    .bind(data.title, data.description, data.embed_url || null, nextOrder)
    .run();
}

export async function updateVideo(env, id, data) {
  await env.DB.prepare('UPDATE videos SET title = ?, description = ?, embed_url = ? WHERE id = ?')
    .bind(data.title, data.description, data.embed_url || null, id)
    .run();
}

export async function deleteVideo(env, id) {
  await env.DB.prepare('DELETE FROM videos WHERE id = ?').bind(id).run();
}

export async function createLead(env, data) {
  await env.DB.prepare(
    'INSERT INTO leads (name, phone, email, category, message, source) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(data.name, data.phone, data.email || null, data.category || null, data.message || null, data.source || 'contact_form')
    .run();
}

export async function getLeads(env) {
  const { results } = await env.DB.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  return results;
}

export async function markLeadRead(env, id) {
  await env.DB.prepare('UPDATE leads SET is_read = 1 WHERE id = ?').bind(id).run();
}

export async function deleteLead(env, id) {
  await env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id).run();
}
