import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('zh-TW home page renders card content', () => {
  assert.match(html, /<html lang="zh-TW"/);
  for (const s of [
    '<h1>Kyo Huang</h1>',
    '<p>Python × AI × DevOps</p>',
    '<p>軟體工程師，相信 AI 與 Infra 是開發者的未來。擅長用文字記錄學習，希望可以寫到 70 歲。</p>',
    'src="https://img.kyomind.tw/1280.jpg"',
  ]) assert.ok(html.includes(s), `missing: ${s}`);
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
    assert.match(navHtml, /<a\b[^>]*href="\/en\/"[^>]*>EN<\/a>/);
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
