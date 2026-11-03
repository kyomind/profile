import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('zh-TW home page renders card content', () => {
  assert.match(html, /<html lang="zh-TW"/);
  for (const s of [
    '<h1>Kyo Huang</h1>',
    '<p class="bio">軟體工程師，相信 AI 與 Infra 是開發者的未來。擅長用文字記錄學習，希望可以寫到 70 歲。</p>',
    'src="https://img.kyomind.tw/1280.jpg"',
  ]) assert.ok(html.includes(s), `missing: ${s}`);
});

test('zh-TW home tagline reads Python × AI × DevOps', () => {
  const tagline = html.match(/<p class="tagline">([\s\S]*?)<\/p>/)?.[1];
  assert.equal(tagline?.replace(/<[^>]+>/g, ''), 'Python × AI × DevOps');
});

const links = (s) => [...s.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, text]) => ({
  href: attrs.match(/href="([^"]*)"/)?.[1], attrs, text: text.trim(),
}));

const pages = { '/': 'index.html', '/projects/': 'projects/index.html', '/about/': 'about/index.html' };
const nav = [['/', '首頁'], ['/projects/', '專案'], ['/about/', '關於']];

for (const [path, file] of Object.entries(pages)) {
  test(`${path} has navigation with current page marked`, () => {
    const page = readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    const navHtml = page.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0];
    assert.ok(navHtml, 'missing <nav>');
    for (const [href, label] of nav) {
      const a = navHtml.match(new RegExp(`<a\\b[^>]*href="${href}"[^>]*>${label}</a>`))?.[0];
      assert.ok(a, `missing nav link ${href} ${label}`);
      assert.equal(a.includes('aria-current="page"'), href === path, `aria-current on ${href}`);
    }
    assert.match(navHtml, new RegExp(`<a\\b[^>]*href="/en${path}"[^>]*>EN</a>`));
    assert.match(navHtml, new RegExp(`<a\\b[^>]*href="${path}"[^>]*>中文</a>`));
  });
}

test('home page lists outputs then accounts after the card, with safe external links', () => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const sections = [...main.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map((m) => m[1]);
  assert.equal(sections.length, 2, 'expected exactly outputs + accounts sections');
  assert.deepEqual(sections.map((s) => s.match(/<h2>([^<]*)<\/h2>/)?.[1]), ['產出', '帳號']);
  const [outputs, accounts] = sections.map(links);
  assert.deepEqual(outputs.map((l) => [l.text, l.href]), [['部落格', 'https://blog.kyomind.tw']]);
  assert.deepEqual(accounts.map((l) => [l.text, l.href]), [
    ['GitHub', 'https://github.com/kyomind'],
    ['LinkedIn', 'https://www.linkedin.com/in/kyo-huang/'],
    ['Threads', 'https://www.threads.com/@kyomind.tw'],
    ['X', 'https://x.com/kyomind'],
  ]);
  for (const l of [...outputs, ...accounts]) {
    assert.match(l.attrs, /target="_blank"/, l.href);
    assert.match(l.attrs, /rel="noopener noreferrer"/, l.href);
    assert.ok(l.text || /aria-label="[^"]+"/.test(l.attrs), `no accessible name: ${l.href}`);
  }
  assert.ok(html.indexOf('<h1') < html.indexOf(outputs[0].href), 'card before outputs');
  assert.ok(html.indexOf(outputs[0].href) < html.indexOf(accounts[0].href), 'outputs before accounts');
  assert.doesNotMatch(main, /facebook|digest|代表作/i);
});

test('projects page shows WeaMind then Chat Freezer with safe links; home has no project detail', () => {
  const page = readFileSync(new URL('../dist/projects/index.html', import.meta.url), 'utf8');
  const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const sections = [...main.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map((m) => m[1]);
  assert.deepEqual(sections.map((s) => s.match(/<h2>([^<]*)<\/h2>/)?.[1]), ['WeaMind', 'Chat Freezer']);
  const [weamind, freezer] = sections.map(links);
  assert.deepEqual(weamind.map((l) => l.href), [
    'https://github.com/kyomind/WeaMind',
    'https://github.com/kyomind/weamind-infra',
    'https://blog.kyomind.tw/weamind-series/',
  ]);
  assert.deepEqual(freezer.map((l) => l.href), [
    'https://chat-freezer.kyomind.tw',
    'https://chromewebstore.google.com/detail/chat-freezer/hgdjifpblaeanangbggpjfhmlcmeodpk',
  ]);
  for (const l of [...weamind, ...freezer]) {
    assert.match(l.attrs, /target="_blank"/, l.href);
    assert.match(l.attrs, /rel="noopener noreferrer"/, l.href);
    assert.ok(l.text, `no link text: ${l.href}`);
  }
  for (const s of ['K3s', 'Hetzner', 'GHCR', 'Prometheus', 'Grafana', '95%', 'FastAPI', 'PostgreSQL', 'Redis']) {
    assert.ok(sections[0].includes(s), `WeaMind missing ${s}`);
  }
  assert.match(sections[1], /Markdown/);
  assert.match(sections[1], /本機/);
  assert.doesNotMatch(sections[1], /github\.com/, 'Chat Freezer has no public repo');
});

test('home page has no project detail', () => {
  const homeMain = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  assert.doesNotMatch(homeMain, /WeaMind|Chat Freezer|K3s/);
});

test('about page has experience, stack, writing, contact with safe links', () => {
  const page = readFileSync(new URL('../dist/about/index.html', import.meta.url), 'utf8');
  const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const sections = [...main.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map((m) => m[1]);
  assert.deepEqual(sections.map((s) => s.match(/<h2>([^<]*)<\/h2>/)?.[1]),
    ['經歷', '技術棧', '寫作成績', 'CV 與聯絡方式', '更多關於我']);
  const [exp, stack, writing, contact, more] = sections;
  for (const s of ['殷富資訊', '森淨科技', '信義房屋', '法律', '公職']) assert.ok(exp.includes(s), `experience missing ${s}`);
  for (const s of ['Infrastructure &amp; DevOps', 'Backend', 'Testing &amp; Quality', 'Kubernetes', 'Django', 'pytest']) {
    assert.ok(stack.includes(s), `stack missing ${s}`);
  }
  for (const s of ['210+', '80 萬', '鐵人賽', '《Django 忍法帖》']) assert.ok(writing.includes(s), `writing missing ${s}`);
  const all = [...links(contact), ...links(more)];
  assert.deepEqual(all.map((l) => l.href), [
    'https://www.cake.me/resumes/kyomind',
    'mailto:odinxp@gmail.com',
    'https://blog.kyomind.tw/about/',
  ]);
  for (const l of all.filter((l) => !l.href.startsWith('mailto:'))) {
    assert.match(l.attrs, /target="_blank"/, l.href);
    assert.match(l.attrs, /rel="noopener noreferrer"/, l.href);
  }
  assert.doesNotMatch(main, /PROFILE|Let.s talk|↗/);
});

// --- 視覺（DESIGN.md）---
const css = [
  ...[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]),
  ...[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => readFileSync(new URL(`../dist${m[1]}`, import.meta.url), 'utf8')),
].join('\n');

test('stylesheet follows DESIGN.md tokens and bans', () => {
  assert.ok(css.length > 500, 'no stylesheet found');
  for (const t of ['#faf9f7', '#e8e6e1', '#2d3748', '#b84c32', '#a8452d', '#f5f4f1', '#ebe9e4', '#4b5563', '#6b7280', '#374151', '#bbb', '#e5e7eb', '#9ca3af', 'color-scheme:light', '-apple-system']) {
    assert.ok(css.toLowerCase().includes(t.toLowerCase()), `missing token ${t}`);
  }
  assert.doesNotMatch(css, /@font-face|@import|gradient|prefers-color-scheme|animation|fonts\.googleapis/i);
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/i);
});

test('only the blog button uses the accent button style; accounts are secondary buttons', () => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const all = links(main);
  const primary = all.filter((l) => /class="[^"]*\bprimary\b/.test(l.attrs));
  assert.deepEqual(primary.map((l) => l.text), ['部落格']);
  assert.ok(all.every((l) => /class="[^"]*\bbtn\b/.test(l.attrs)), 'all home links are buttons');
});

for (const [path, file] of Object.entries(pages)) {
  test(`${path} sits in one card with a footer`, () => {
    const page = readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    assert.equal((page.match(/class="card"/g) ?? []).length, 1);
    assert.match(page, /<footer\b[^>]*>[\s\S]*?©[\s\S]*?<\/footer>/);
  });
}

// --- 英文版與 i18n（票 #5）---
const read = (f) => readFileSync(new URL(`../dist/${f}`, import.meta.url), 'utf8');
const meta = (p, attr, key) => p.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
const enPages = { '/en/': 'en/index.html', '/en/projects/': 'en/projects/index.html', '/en/about/': 'en/about/index.html' };
const pairs = [['/', '/en/'], ['/projects/', '/en/projects/'], ['/about/', '/en/about/']];
const origin = 'https://kyomind.tw';

test('en pages render with lang=en, English nav and a switch to the matching zh page', () => {
  for (const [zh, en] of pairs) {
    const p = read(enPages[en]);
    assert.match(p, /<html lang="en"/, en);
    const navHtml = p.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)[0];
    for (const [href, label] of [['/en/', 'Home'], ['/en/projects/', 'Projects'], ['/en/about/', 'About']]) {
      const a = navHtml.match(new RegExp(`<a\\b[^>]*href="${href}"[^>]*>${label}</a>`))?.[0];
      assert.ok(a, `${en} missing nav ${href}`);
      assert.equal(a.includes('aria-current="page"'), href === en);
    }
    assert.match(navHtml, new RegExp(`<a\\b[^>]*href="${zh}"[^>]*>中文</a>`));
    assert.match(navHtml, new RegExp(`<a\\b[^>]*href="${en}"[^>]*>EN</a>`));
    assert.doesNotMatch(p.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1], /[一-鿿]/, `${en} has CJK in main`);
  }
});

test('en pages mirror the zh sections and links', () => {
  const sec = (p) => [...p.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1].matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map((m) => links(m[1]).map((l) => l.href));
  for (const [zh, en] of pairs) assert.deepEqual(sec(read(enPages[en])), sec(read(pages[zh])), en);
});

test('every page has hreflang alternates, canonical, and per-locale meta/OG/Twitter', () => {
  for (const [zh, en] of pairs) {
    for (const [path, file, locale, ogLocale] of [[zh, pages[zh], 'zh-TW', 'zh_TW'], [en, enPages[en], 'en', 'en_US']]) {
      const p = read(file);
      const alt = (l) => p.match(new RegExp(`<link rel="alternate" hreflang="${l}" href="([^"]*)"`))?.[1];
      assert.equal(alt('zh-TW'), origin + zh, `${path} zh-TW`);
      assert.equal(alt('en'), origin + en, `${path} en`);
      assert.equal(alt('x-default'), origin + zh, `${path} x-default`);
      assert.ok(p.includes(`<link rel="canonical" href="${origin + path}"`), `${path} canonical`);
      const title = p.match(/<title>([^<]*)<\/title>/)[1];
      const desc = meta(p, 'name', 'description');
      assert.ok(title && desc);
      assert.equal(meta(p, 'property', 'og:title'), title);
      assert.equal(meta(p, 'property', 'og:description'), desc);
      assert.equal(meta(p, 'property', 'og:locale'), ogLocale);
      assert.equal(meta(p, 'property', 'og:url'), origin + path);
      assert.equal(meta(p, 'property', 'og:image'), 'https://img.kyomind.tw/1280.jpg');
      assert.equal(meta(p, 'name', 'twitter:card'), 'summary');
      assert.equal(meta(p, 'name', 'twitter:title'), title);
      assert.equal(meta(p, 'name', 'twitter:description'), desc);
      assert.equal(meta(p, 'name', 'twitter:image'), 'https://img.kyomind.tw/1280.jpg');
      if (locale === 'en') assert.doesNotMatch(title + desc, /[一-鿿]/);
    }
  }
});

// --- 安全 header 與統計（票 #7）---
const allPages = [...Object.values(pages), ...Object.values(enPages)];

test('_headers sends CSP, nosniff and referrer policy for all paths', () => {
  const h = read('_headers');
  assert.match(h, /^\/\*$/m, 'rule for all paths');
  const csp = h.match(/^\s+Content-Security-Policy: (.+)$/m)?.[1];
  assert.ok(csp, 'missing CSP');
  assert.match(h, /^\s+X-Content-Type-Options: nosniff$/m);
  assert.match(h, /^\s+Referrer-Policy: strict-origin-when-cross-origin$/m);
  assert.match(csp, /script-src 'self' https:\/\/umami\.kyomind\.tw(;|$)/);
  assert.match(csp, /connect-src 'self' https:\/\/umami\.kyomind\.tw(;|$)/);
  assert.match(csp, /img-src 'self' https:\/\/img\.kyomind\.tw(;|$)/);
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval|google|cloudflareinsights/);
});

test('pages have no meta CSP, no GA4, no inline script or handler; Umami is async and scoped to kyomind.tw', () => {
  for (const f of allPages) {
    const p = read(f);
    assert.doesNotMatch(p, /Content-Security-Policy/i, `${f} meta CSP`);
    assert.doesNotMatch(p, /googletagmanager|google-analytics|gtag|G-[A-Z0-9]{8,}/, `${f} GA4`);
    assert.doesNotMatch(p, /<style\b|\sstyle="|\son[a-z]+=/i, `${f} inline style/handler`);
    const scripts = [...p.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1, `${f} expected only Umami script`);
    const [, attrs, body] = scripts[0];
    assert.equal(body, '', `${f} inline script`);
    assert.match(attrs, /\bsrc="https:\/\/umami\.kyomind\.tw\/script\.js"/);
    assert.match(attrs, /\basync\b/);
    assert.match(attrs, /data-website-id="79cdd0f1-75b2-4ef7-b03f-dd14cc688099"/);
    assert.match(attrs, /data-domains="kyomind\.tw"/);
  }
});

test('favicons are linked from every page and served from dist root', () => {
  for (const f of allPages) {
    const p = read(f);
    for (const re of [
      /<link rel="icon" href="\/favicon\.ico"/,
      /<link rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32x32\.png"/,
      /<link rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16x16\.png"/,
      /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png"/,
      /<link rel="manifest" href="\/site\.webmanifest"/,
    ]) assert.match(p, re, `${f} ${re}`);
  }
  for (const f of ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png'])
    assert.ok(existsSync(new URL(`../dist/${f}`, import.meta.url)), `dist/${f}`);
  const m = JSON.parse(read('site.webmanifest'));
  assert.equal(m.theme_color, '#b84c32');
  for (const i of m.icons) assert.ok(existsSync(new URL(`../dist${i.src}`, import.meta.url)), i.src);
});
