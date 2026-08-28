import { renderHome } from './pages/home.js';
import { renderBlogIndex, renderArticle } from './pages/blog.js';
import { renderPracticeAreaPage } from './pages/practice-area.js';
import { renderLoginPage, renderDashboard } from './pages/admin.js';
import {
  createSessionCookie,
  clearSessionCookie,
  isAuthenticated,
  checkPassword,
  getClientIp,
  isRateLimited,
  recordLoginAttempt,
} from './auth.js';
import {
  getAllContent,
  setContent,
  getPracticeAreas,
  getPracticeAreaById,
  createPracticeArea,
  updatePracticeArea,
  deletePracticeArea,
  getAllArticlesForAdmin,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  createLead,
  getLeads,
  deleteLead,
} from './db.js';

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

function html(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...(init.headers || {}) },
  });
}

async function requireAuth(request, env) {
  if (await isAuthenticated(request, env)) return null;
  return json({ error: 'unauthorized' }, { status: 401 });
}

function sanitizeText(value, maxLen) {
  return String(value ?? '').trim().slice(0, maxLen);
}

async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, { status: 400 });
  }
  const name = sanitizeText(body.name, 120);
  const phone = sanitizeText(body.phone, 30);
  if (!name || !phone || !/^0[0-9\-\s]{8,12}$/.test(phone)) {
    return json({ error: 'validation_failed' }, { status: 400 });
  }
  await createLead(env, {
    name,
    phone,
    email: sanitizeText(body.email, 160),
    category: sanitizeText(body.category, 120),
    message: sanitizeText(body.message, 4000),
    source: sanitizeText(body.source, 60) || 'contact_form',
  });
  return json({ ok: true });
}

async function handleLogin(request, env) {
  const ip = getClientIp(request);
  if (await isRateLimited(env, ip)) {
    return html(renderLoginPage({ error: 'יותר מדי ניסיונות התחברות. נסו שוב בעוד כמה דקות.' }), { status: 429 });
  }
  const form = await request.formData();
  const password = form.get('password') || '';
  const ok = checkPassword(String(password), env.ADMIN_PASSWORD || '');
  await recordLoginAttempt(env, ip, ok);
  if (!ok) {
    return html(renderLoginPage({ error: 'סיסמה שגויה.' }), { status: 401 });
  }
  const cookie = await createSessionCookie(env.SESSION_SECRET);
  return new Response(null, { status: 302, headers: { Location: '/admin', 'Set-Cookie': cookie } });
}

async function handleAdminApi(request, env, pathname) {
  const authError = await requireAuth(request, env);
  if (authError) return authError;

  const method = request.method;
  const parts = pathname.split('/').filter(Boolean); // ['api','admin', resource, id?]
  const resource = parts[2];
  const id = parts[3] ? parseInt(parts[3], 10) : null;

  const parseBody = async () => {
    try {
      return await request.json();
    } catch {
      return null;
    }
  };

  if (resource === 'content') {
    if (method === 'GET') return json(await getAllContent(env));
    if (method === 'PUT') {
      const body = await parseBody();
      if (!body) return json({ error: 'invalid_json' }, { status: 400 });
      await setContent(env, body);
      return json({ ok: true });
    }
  }

  if (resource === 'practice-areas') {
    if (method === 'GET' && !id) return json(await getPracticeAreas(env));
    if (method === 'POST') {
      const body = await parseBody();
      if (!body?.title) return json({ error: 'title_required' }, { status: 400 });
      const slug = await createPracticeArea(env, body);
      return json({ ok: true, slug });
    }
    if (id && method === 'PUT') {
      const body = await parseBody();
      if (!body) return json({ error: 'invalid_json' }, { status: 400 });
      const existing = await getPracticeAreaById(env, id);
      if (!existing) return json({ error: 'not_found' }, { status: 404 });
      await updatePracticeArea(env, id, body);
      return json({ ok: true });
    }
    if (id && method === 'DELETE') {
      await deletePracticeArea(env, id);
      return json({ ok: true });
    }
  }

  if (resource === 'articles') {
    if (method === 'GET' && !id) return json(await getAllArticlesForAdmin(env));
    if (method === 'POST') {
      const body = await parseBody();
      if (!body?.title) return json({ error: 'title_required' }, { status: 400 });
      const slug = await createArticle(env, body);
      return json({ ok: true, slug });
    }
    if (id && method === 'PUT') {
      const body = await parseBody();
      if (!body) return json({ error: 'invalid_json' }, { status: 400 });
      const existing = await getArticleById(env, id);
      if (!existing) return json({ error: 'not_found' }, { status: 404 });
      await updateArticle(env, id, body);
      return json({ ok: true });
    }
    if (id && method === 'DELETE') {
      await deleteArticle(env, id);
      return json({ ok: true });
    }
  }

  if (resource === 'videos') {
    if (method === 'GET' && !id) return json(await getVideos(env));
    if (method === 'POST') {
      const body = await parseBody();
      if (!body?.title) return json({ error: 'title_required' }, { status: 400 });
      await createVideo(env, body);
      return json({ ok: true });
    }
    if (id && method === 'PUT') {
      const body = await parseBody();
      if (!body) return json({ error: 'invalid_json' }, { status: 400 });
      await updateVideo(env, id, body);
      return json({ ok: true });
    }
    if (id && method === 'DELETE') {
      await deleteVideo(env, id);
      return json({ ok: true });
    }
  }

  if (resource === 'leads') {
    if (method === 'GET' && !id) return json(await getLeads(env));
    if (id && method === 'DELETE') {
      await deleteLead(env, id);
      return json({ ok: true });
    }
  }

  return json({ error: 'not_found' }, { status: 404 });
}

async function notFound(env, url) {
  const res = await env.ASSETS.fetch(new Request(`${url.origin}/404.html`));
  return new Response(res.body, { status: 404, headers: res.headers });
}

async function renderSitemap(env, siteUrl) {
  const [areas, articles] = await Promise.all([getPracticeAreas(env), getAllArticlesForAdmin(env)]);
  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/blog`,
    ...areas.map((a) => `${siteUrl}/practice-areas/${a.slug}`),
    ...articles.filter((a) => a.is_published).map((a) => `${siteUrl}/blog/${a.slug}`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === '/api/contact' && request.method === 'POST') {
        return handleContact(request, env);
      }

      if (pathname === '/api/login' && request.method === 'POST') {
        return handleLogin(request, env);
      }

      if (pathname === '/api/logout' && request.method === 'POST') {
        return new Response(null, { status: 204, headers: { 'Set-Cookie': clearSessionCookie() } });
      }

      if (pathname.startsWith('/api/admin/')) {
        return handleAdminApi(request, env, pathname);
      }

      if (pathname === '/admin') {
        const authed = await isAuthenticated(request, env);
        return html(authed ? renderDashboard() : renderLoginPage());
      }

      if (pathname === '/sitemap.xml') {
        const c = await getAllContent(env);
        return renderSitemap(env, c.seo_site_url || `${url.protocol}//${url.host}`);
      }

      if (pathname === '/robots.txt') {
        const siteUrl = `${url.protocol}//${url.host}`;
        return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${siteUrl}/sitemap.xml\n`, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }

      if (pathname === '/') {
        return html(await renderHome(env));
      }

      if (pathname === '/blog' || pathname === '/blog/') {
        return html(await renderBlogIndex(env));
      }

      const articleMatch = pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/);
      if (articleMatch) {
        const page = await renderArticle(env, articleMatch[1]);
        if (!page) return notFound(env, url);
        return html(page);
      }

      const practiceMatch = pathname.match(/^\/practice-areas\/([a-z0-9-]+)\/?$/);
      if (practiceMatch) {
        const page = await renderPracticeAreaPage(env, practiceMatch[1]);
        if (!page) return notFound(env, url);
        return html(page);
      }

      // Static assets (logo, favicon, custom 404) served from /public
      return env.ASSETS.fetch(request);
    } catch (err) {
      console.error(err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
