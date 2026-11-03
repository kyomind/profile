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
