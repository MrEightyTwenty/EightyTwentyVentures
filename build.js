#!/usr/bin/env node
/* =============================================================================
   EightyTwentyVentures — Static Build
   -----------------------------------------------------------------------------
   Reads content/briefings/index.json plus one markdown file per entry, and
   generates a complete static site into dist/.

   Generates:
     dist/briefings/{slug}/index.html   server-rendered article, indexable
     dist/index.html                    homepage with pre-rendered cards
     dist/briefing.html                 archive with pre-rendered cards
     dist/sitemap.xml
     dist/rss.xml
     dist/robots.txt

   Validates before writing anything. Any failure exits non-zero, which aborts
   the Netlify deploy. A broken briefing never reaches production.

   Run:  node build.js
============================================================================= */

'use strict';

const fs   = require('fs');
const path = require('path');
const { marked } = require('marked');

/* ── Configuration ────────────────────────────────────────────────────────── */

const SITE = {
  origin:  'https://eightytwentyventures.com',
  name:    'EightyTwentyVentures',
  author:  'Mr. EightyTwenty',
  tagline: 'Market intelligence and ideas from a working trader.',
  logo:    '/assets/logo.png'
};

const SRC  = __dirname;
const DIST = path.join(SRC, 'dist');

/* The single category list. Every label, filter button, and colour is
   generated from this. There is nowhere for a second taxonomy to hide. */
const CATEGORIES = {
  structure:   { label: 'Market Structure',      accent: '#4C8AC9', bg1: '#0A1018', bg2: '#040608' },
  positioning: { label: 'Positioning & Regime',  accent: '#1E8F63', bg1: '#0D2B22', bg2: '#050D09' },
  execution:   { label: 'Execution',             accent: '#F2385A', bg1: '#180808', bg2: '#0A0404' },
  psychology:  { label: 'Psychology & Process',  accent: '#8A8F98', bg1: '#141618', bg2: '#0A0B0C' },
  macro:       { label: 'Macro',                 accent: '#1E8F63', bg1: '#0D2B22', bg2: '#050D09' }
};

const VISIBILITY = ['public', 'members', 'private'];
const WALL       = '<!-- MEMBER WALL -->';

/* Files and directories copied verbatim from repo root into dist/
   NOTE: content/ is deliberately NOT passed through wholesale. The raw
   .md source includes text on the other side of the member wall, and
   nothing client-side reads index.json anymore (cards are baked in at
   build time). Only content/images (inline GIFs referenced in bodies)
   needs to be public. */
const PASSTHROUGH = [
  'assets', 'amt', 'rsp', 'netlify', 'admin',
  'style.css', 'auth.js', 'glossary.js', 'study.js',
  'access.html', 'playbook.html', 'playbook-intraday.html', 'playbook-position.html',
  'about.html', 'faq.html', '404.html', 'privacy.html', 'terms.html',
  'risk-disclosure.html', 'subscription-policy.html',
  'google8553fe7ded56602d.html'
];

const EXTRA_PASSTHROUGH = [
  ['content/images', 'content/images']
];

/* ── Small helpers ────────────────────────────────────────────────────────── */

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const errors = [];
const warns  = [];
const fail   = m => errors.push(m);
const warn   = m => warns.push(m);

function readIfExists (p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; }
}

function formatDate (str) {
  const d = new Date(String(str).includes('T') ? str : str + 'T00:00:00');
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort (str) {
  const d = new Date(String(str).includes('T') ? str : str + 'T00:00:00');
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* Root-relative asset paths. Articles live at /briefings/{slug}/, so any
   plain relative path (assets/chart.png, content/images/foo.gif) would
   resolve against that subdirectory instead of the site root. Catches
   any relative src/href, leaves absolute URLs, anchors, mailto, and
   data URIs untouched.

   The path pattern matches anything up to the *matching* closing quote
   rather than excluding both quote characters, so filenames containing
   an apostrophe (we-don't-care.gif) are handled correctly. */
function absolutiseAssets (html) {
  return html.replace(
    /(src|href)=(["'])(?!https?:\/\/|\/\/|\/|#|mailto:|data:)((?:(?!\2)[^>])+?)\2/g,
    (m, attr, q, p) => `${attr}=${q}/${p}${q}`
  );
}

/* For RSS/email specifically: root-relative paths (the output of the
   function above) don't resolve inside an email client, there's no page
   for "/" to be relative to. Every image needs the full origin. */
function absolutiseForEmail (html) {
  return html.replace(
    /(src|href)=(["'])\/(?!\/)((?:(?!\2)[^>])*?)\2/g,
    (m, attr, q, p) => `${attr}=${q}${SITE.origin}/${p}${q}`
  );
}

/* First ~30 words of the body, for meta description fallback */
function plainSnippet (html, words = 32) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const parts = text.split(' ').slice(0, words);
  return parts.join(' ') + (text.split(' ').length > words ? '...' : '');
}

/* ── Frontmatter parser ───────────────────────────────────────────────────── */
/* Deliberately matches the old client-side parser's behaviour: one key per
   line, split on first colon, one leading/trailing quote stripped. */

function parseFrontmatter (raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw, hadFrontmatter: false };

  const data = {};
  m[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    data[key] = val;
  });

  return { data, body: m[2].trim(), hadFrontmatter: true };
}

/* ── Load and validate ────────────────────────────────────────────────────── */

function loadArticles () {
  const manifestPath = path.join(SRC, 'content', 'briefings', 'index.json');
  const rawManifest  = readIfExists(manifestPath);

  if (!rawManifest) {
    fail('content/briefings/index.json is missing.');
    return [];
  }

  let manifest;
  try {
    manifest = JSON.parse(rawManifest);
  } catch (e) {
    fail('content/briefings/index.json is not valid JSON: ' + e.message);
    return [];
  }

  if (!Array.isArray(manifest)) {
    fail('content/briefings/index.json must be a JSON array.');
    return [];
  }

  const seen = new Set();
  const out  = [];

  manifest.forEach((entry, i) => {
    const where = `index.json[${i}]`;
    const slug  = (entry.slug || '').trim();

    if (!slug) { fail(`${where}: missing "slug".`); return; }
    if (seen.has(slug)) { fail(`${where}: duplicate slug "${slug}".`); return; }
    seen.add(slug);

    /* Markdown file must exist and be named exactly {slug}.md */
    const mdPath = path.join(SRC, 'content', 'briefings', slug + '.md');
    const raw    = readIfExists(mdPath);
    if (raw === null) {
      fail(`${slug}: no markdown at content/briefings/${slug}.md (filename must equal slug).`);
      return;
    }

    const { data: fm, body, hadFrontmatter } = parseFrontmatter(raw);
    if (!hadFrontmatter) fail(`${slug}: markdown has no frontmatter block.`);

    /* Visibility */
    const visibility = (entry.visibility || 'public').trim();
    if (!VISIBILITY.includes(visibility)) {
      fail(`${slug}: visibility "${visibility}" is invalid. Use ${VISIBILITY.join(', ')}.`);
    }

    /* Category */
    const cat = (entry.cat || '').trim();
    if (!CATEGORIES[cat]) {
      fail(`${slug}: cat "${cat}" is not a known category. Use ${Object.keys(CATEGORIES).join(', ')}.`);
    }

    /* Excerpt */
    if (!entry.excerpt) fail(`${slug}: index.json is missing "excerpt".`);
    else if (/[\r\n]/.test(entry.excerpt)) fail(`${slug}: "excerpt" must be a single line.`);

    /* Date */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '')) {
      fail(`${slug}: date "${entry.date}" must be YYYY-MM-DD.`);
    }

    /* Image: must exist, be non-empty, and agree between manifest and frontmatter */
    const img = (entry.image || '').replace(/^\//, '');
    if (!img) {
      fail(`${slug}: index.json is missing "image".`);
    } else {
      const imgPath = path.join(SRC, img);
      if (!fs.existsSync(imgPath)) {
        fail(`${slug}: image not found -> ${img}`);
      } else if (fs.statSync(imgPath).size === 0) {
        fail(`${slug}: image is 0 bytes -> ${img} (likely a OneDrive placeholder, not a real file).`);
      }
    }

    const fmImg = (fm.image || '').replace(/^\//, '');
    if (fmImg && img && fmImg !== img) {
      fail(`${slug}: image mismatch. index.json="${img}" frontmatter="${fmImg}".`);
    }

    if (fm.date && fm.date !== entry.date) {
      fail(`${slug}: date mismatch. index.json="${entry.date}" frontmatter="${fm.date}".`);
    }

    /* Editorial hard rules */
    if (body.includes('\u2014')) {
      fail(`${slug}: contains an em dash. House rule: none, anywhere.`);
    }

    /* Inline hero duplication */
    if (img && body.includes(img)) {
      fail(`${slug}: the hero image is also embedded inline in the body. Remove the inline copy.`);
    }

    /* Every image referenced in the body must exist */
    const bodyImgs = [...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1]);
    bodyImgs.forEach(ref => {
      if (/^https?:/i.test(ref)) return;
      const p = path.join(SRC, ref.replace(/^\//, ''));
      if (!fs.existsSync(p)) fail(`${slug}: body references a missing image -> ${ref}`);
      else if (fs.statSync(p).size === 0) fail(`${slug}: body image is 0 bytes -> ${ref}`);
    });

    /* Member wall */
    const hasWall = body.includes(WALL);
    if (visibility === 'members' && !hasWall) {
      warn(`${slug}: visibility is "members" with no ${WALL} marker. The ENTIRE piece is gated, readers see only the signup wall. Add a marker to give them a free lead-in.`);
    }
    if (visibility === 'public' && hasWall) {
      warn(`${slug}: has a ${WALL} marker but visibility is "public". The marker will be ignored.`);
    }

    out.push({
      slug,
      visibility,
      cat,
      title:     entry.title    || fm.title    || 'Untitled',
      subtitle:  entry.subtitle || fm.subtitle || '',
      category:  entry.category || fm.category || (CATEGORIES[cat] ? CATEGORIES[cat].label : ''),
      excerpt:   entry.excerpt  || '',
      date:      entry.date     || '',
      image:     img,
      body
    });
  });

  return out;
}

/* ── Markdown rendering, split at the member wall ─────────────────────────── */

marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });

function renderBody (article) {
  const parts = article.body.split(WALL);
  const lead  = parts[0];
  const rest  = parts.slice(1).join(WALL);

  const gated = article.visibility === 'members' || article.visibility === 'private';

  /* Not gated: everything is free. */
  if (!gated) {
    return { free: absolutiseAssets(marked.parse(article.body.replace(WALL, ''))), locked: '' };
  }

  /* Gated, but no wall marker present. FAIL CLOSED: gate the entire body
     rather than releasing it. An earlier version of this function returned
     the full body as free content here, which silently published gated
     articles in full. Never reintroduce that branch. */
  if (!rest.trim()) {
    return { free: '', locked: absolutiseAssets(marked.parse(article.body)) };
  }

  /* Gated with a marker: split at the wall. */
  return {
    free:   absolutiseAssets(marked.parse(lead)),
    locked: absolutiseAssets(marked.parse(rest))
  };
}

/* ── The member wall block ────────────────────────────────────────────────── */

function wallHtml () {
  return `
        <div class="etv-wall" id="etv-wall">
          <div class="etv-wall-fade"></div>
          <div class="etv-wall-panel">
            <div class="etv-wall-eyebrow">Continue reading</div>
            <h2 class="etv-wall-title">The rest of this briefing is for readers on the list.</h2>
            <p class="etv-wall-body">Free, permanently. Enter your email and a link comes back that unlocks every piece on the site, current and future.</p>
            <form class="etv-wall-form signup-form" name="etv-access" method="POST" data-netlify="true" netlify-honeypot="bot-field">
              <input type="hidden" name="form-name" value="etv-access">
              <p style="display:none;"><label>Leave blank: <input name="bot-field"></label></p>
              <input type="email" name="email" placeholder="your@email.com" required autocomplete="email" aria-label="Email address">
              <button type="submit">Read along</button>
            </form>
            <p class="etv-wall-meta">No credit card. No paid tier. New briefings arrive in full on the day they publish.</p>
          </div>
        </div>`;
}

/* ── JSON-LD ──────────────────────────────────────────────────────────────── */
/* Declares the gate to Google so a registration wall is not read as cloaking.
   Full text ships in the HTML for every requester; CSS hides the locked half
   from readers without access. That is Google's flexible sampling model. */

function jsonLd (a) {
  const url = `${SITE.origin}/briefings/${a.slug}/`;
  const gated = a.visibility === 'members';

  const doc = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    image: [SITE.origin + '/' + a.image],
    datePublished: a.date,
    dateModified: a.date,
    author: { '@type': 'Person', name: SITE.author, url: SITE.origin + '/about.html' },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: SITE.origin + SITE.logo }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: CATEGORIES[a.cat] ? CATEGORIES[a.cat].label : a.category,
    isAccessibleForFree: gated ? false : true
  };

  if (gated) {
    doc.hasPart = {
      '@type': 'WebPageElement',
      isAccessibleForFree: false,
      cssSelector: '.etv-locked'
    };
  }

  return JSON.stringify(doc, null, 2);
}

/* ── Article page ─────────────────────────────────────────────────────────── */

function renderArticlePage (a, template, prev, next) {
  const { free, locked } = renderBody(a);
  const url  = `${SITE.origin}/briefings/${a.slug}/`;
  const catLabel = CATEGORIES[a.cat] ? CATEGORIES[a.cat].label : a.category;
  const desc = a.excerpt || plainSnippet(free);

  const lockedBlock = locked
    ? wallHtml() + `\n        <div class="etv-locked" id="etv-locked">${locked}</div>`
    : '';

  const nav = [];
  if (prev) nav.push(`<a class="article-nav-link prev" href="/briefings/${prev.slug}/"><span>Previous</span>${esc(prev.title)}</a>`);
  if (next) nav.push(`<a class="article-nav-link next" href="/briefings/${next.slug}/"><span>Next</span>${esc(next.title)}</a>`);

  return template
    .replace(/\{\{TITLE\}\}/g,       esc(a.title))
    .replace(/\{\{SUBTITLE\}\}/g,    esc(a.subtitle))
    .replace(/\{\{DESCRIPTION\}\}/g, esc(desc))
    .replace(/\{\{CANONICAL\}\}/g,   url)
    .replace(/\{\{OG_IMAGE\}\}/g,    SITE.origin + '/' + a.image)
    .replace(/\{\{ROBOTS\}\}/g,      a.visibility === 'private' ? 'noindex, nofollow' : 'index, follow')
    .replace(/\{\{JSONLD\}\}/g,      jsonLd(a))
    .replace(/\{\{CATEGORY\}\}/g,    esc(catLabel))
    .replace(/\{\{CAT_SLUG\}\}/g,    esc(a.cat))
    .replace(/\{\{DATE_ISO\}\}/g,    esc(a.date))
    .replace(/\{\{DATE\}\}/g,        esc(formatDate(a.date)))
    .replace(/\{\{HERO\}\}/g,        a.image ? `<div class="article-hero"><img src="/${esc(a.image)}" alt="${esc(a.title)}"></div>` : '')
    .replace(/\{\{BODY_FREE\}\}/g,   free)
    .replace(/\{\{BODY_LOCKED\}\}/g, lockedBlock)
    .replace(/\{\{ARTICLE_NAV\}\}/g, nav.length ? `<nav class="article-nav">${nav.join('')}</nav>` : '');
}

/* ── Cards ────────────────────────────────────────────────────────────────── */

function homeCard (a, idx) {
  const c = CATEGORIES[a.cat] || CATEGORIES.psychology;
  return `
        <a href="/briefings/${esc(a.slug)}/" class="post-card stagger-child visible${idx === 0 ? ' post-card-featured' : ''}">
          <div class="post-card-img"><img src="/${esc(a.image)}" alt="${esc(a.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"></div>
          <div class="post-card-body">
            <div class="post-card-meta">
              <span class="writing-tag ${esc(a.cat)}" style="color:${c.accent};">${esc(c.label)}</span>
              <span class="post-card-date">${esc(formatDateShort(a.date))}</span>
            </div>
            <div class="post-card-title">${esc(a.title)}</div>
            <p class="post-card-dek">${esc(a.excerpt)}</p>
            <div class="post-card-lock" style="margin-top:12px;font-size:13px;color:#1E8F63;letter-spacing:0.04em;">Read &rarr;</div>
          </div>
        </a>`;
}

function archiveCard (a) {
  const c = CATEGORIES[a.cat] || CATEGORIES.psychology;
  return `
        <a href="/briefings/${esc(a.slug)}/" class="briefing-card" data-cat="${esc(a.cat)}">
          <div class="card-cover"><img src="/${esc(a.image)}" alt="${esc(a.title)}" loading="lazy"></div>
          <div class="meta">
            <span class="category" style="color:${c.accent};">${esc(c.label)}</span>
            <span class="dot"></span>
            <span class="date">${esc(formatDate(a.date))}</span>
          </div>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.excerpt)}</p>
          <div class="card-arrow" style="margin-top:12px;font-size:13px;color:#1E8F63;letter-spacing:0.04em;">Read &rarr;</div>
        </a>`;
}

function filterButtons (articles) {
  const used = [...new Set(articles.map(a => a.cat))];
  const btns = ['<button class="briefing-filter active" data-cat="all">All</button>'];
  Object.keys(CATEGORIES).forEach(k => {
    if (!used.includes(k)) return;
    btns.push(`<button class="briefing-filter" data-cat="${k}">${esc(CATEGORIES[k].label)}</button>`);
  });
  return btns.join('\n        ');
}

/* ── Feeds ────────────────────────────────────────────────────────────────── */

function buildSitemap (articles) {
  const statics = ['/', '/briefing.html', '/about.html', '/faq.html', '/playbook.html'];
  const urls = statics.map(u =>
    `  <url><loc>${SITE.origin}${u}</loc><changefreq>weekly</changefreq></url>`);

  articles.filter(a => a.visibility !== 'private').forEach(a => {
    urls.push(
      `  <url>\n    <loc>${SITE.origin}/briefings/${a.slug}/</loc>\n` +
      `    <lastmod>${a.date}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/* RSS carries the full piece for public articles and the lead-in for gated
   ones. Buttondown reads this feed and drafts the email. */
function buildRss (articles) {
  /* articles arrives already newest-first (the "ordered" array from main()).
     Feed convention is newest-first too, so no further reversal here. */
  const live = articles.filter(a => a.visibility !== 'private');

  const items = live.map(a => {
    const { free, locked } = renderBody(a);
    const url  = `${SITE.origin}/briefings/${a.slug}/`;
    let content = `<p><img src="${SITE.origin}/${a.image}" alt="${esc(a.title)}" style="max-width:100%;"></p>` + absolutiseForEmail(free);

    if (locked) {
      content += `<hr><p><strong>The rest of this briefing continues on the site.</strong> ` +
                 `<a href="${url}">Read the full piece</a>.</p>`;
    }

    return `  <item>
    <title>${esc(a.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(a.date + 'T09:00:00Z').toUTCString()}</pubDate>
    <category>${esc(CATEGORIES[a.cat] ? CATEGORIES[a.cat].label : a.cat)}</category>
    <description>${esc(a.excerpt)}</description>
    <content:encoded><![CDATA[${content}]]></content:encoded>
  </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE.name}</title>
  <link>${SITE.origin}/</link>
  <atom:link href="${SITE.origin}/rss.xml" rel="self" type="application/rss+xml"/>
  <description>${SITE.tagline}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>
`;
}

function buildRobots () {
  return `User-agent: *
Allow: /
Disallow: /amt/
Disallow: /rsp/
Disallow: /admin/
Disallow: /access.html

Sitemap: ${SITE.origin}/sitemap.xml
`;
}

/* ── Marker injection ─────────────────────────────────────────────────────── */

function inject (html, marker, content, label) {
  const open  = `<!-- BUILD:${marker} -->`;
  const close = `<!-- /BUILD:${marker} -->`;
  const i = html.indexOf(open);
  const j = html.indexOf(close);
  if (i === -1 || j === -1) {
    fail(`${label}: missing ${open} ... ${close} markers.`);
    return html;
  }
  return html.slice(0, i + open.length) + '\n' + content + '\n      ' + html.slice(j);
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

function main () {
  console.log('\n  EightyTwentyVentures build\n  ' + '-'.repeat(58));

  const articles = loadArticles();

  if (errors.length) {
    console.error('\n  BUILD FAILED\n');
    errors.forEach(e => console.error('    x  ' + e));
    console.error('');
    process.exit(1);
  }

  /* Newest first, matching the existing array-order convention:
     the last entry in index.json displays first. */
  const ordered = articles.slice().reverse();
  const live    = ordered.filter(a => a.visibility !== 'private');

  /* Fresh output directory */
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  PASSTHROUGH.forEach(item => {
    const from = path.join(SRC, item);
    if (!fs.existsSync(from)) return;
    fs.cpSync(from, path.join(DIST, item), { recursive: true });
  });

  EXTRA_PASSTHROUGH.forEach(([from, to]) => {
    const src = path.join(SRC, from);
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(path.join(DIST, to), { recursive: true });
    fs.cpSync(src, path.join(DIST, to), { recursive: true });
  });

  /* Article pages */
  const template = readIfExists(path.join(SRC, 'templates', 'article.html'));
  if (!template) {
    console.error('\n  BUILD FAILED\n\n    x  templates/article.html is missing.\n');
    process.exit(1);
  }

  ordered.forEach((a, i) => {
    const dir = path.join(DIST, 'briefings', a.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      renderArticlePage(a, template, ordered[i + 1], ordered[i - 1]),
      'utf8'
    );
  });

  /* Homepage */
  let home = readIfExists(path.join(SRC, 'index.html'));
  if (home) {
    home = inject(home, 'HOME_CARDS', live.slice(0, 3).map(homeCard).join('\n'), 'index.html');
    fs.writeFileSync(path.join(DIST, 'index.html'), home, 'utf8');
  } else {
    fail('index.html is missing.');
  }

  /* Archive */
  let archive = readIfExists(path.join(SRC, 'briefing.html'));
  if (archive) {
    archive = inject(archive, 'ARCHIVE_FILTERS', filterButtons(live), 'briefing.html');
    archive = inject(archive, 'ARCHIVE_CARDS', live.map(archiveCard).join('\n'), 'briefing.html');
    fs.writeFileSync(path.join(DIST, 'briefing.html'), archive, 'utf8');
  } else {
    fail('briefing.html is missing.');
  }

  /* Feeds */
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(ordered), 'utf8');
  fs.writeFileSync(path.join(DIST, 'rss.xml'),     buildRss(ordered),     'utf8');
  fs.writeFileSync(path.join(DIST, 'robots.txt'),  buildRobots(),         'utf8');

  if (errors.length) {
    console.error('\n  BUILD FAILED\n');
    errors.forEach(e => console.error('    x  ' + e));
    console.error('');
    process.exit(1);
  }

  /* Status table: this is the dashboard. It prints on every deploy. */
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  console.log('');
  console.log('  ' + pad('ARTICLE', 34) + pad('VISIBILITY', 12) + pad('CATEGORY', 22) + 'DATE');
  console.log('  ' + '-'.repeat(58));
  ordered.forEach(a => {
    console.log('  ' + pad(a.title, 34) + pad(a.visibility, 12) +
                pad(CATEGORIES[a.cat] ? CATEGORIES[a.cat].label : a.cat, 22) + a.date);
  });

  if (warns.length) {
    console.log('\n  Warnings:');
    warns.forEach(w => console.log('    !  ' + w));
  }

  console.log(`\n  Built ${ordered.length} articles. ` +
              `${live.filter(a => a.visibility === 'public').length} public, ` +
              `${live.filter(a => a.visibility === 'members').length} members, ` +
              `${ordered.length - live.length} private.`);
  console.log('  Output: dist/\n');
}

main();
