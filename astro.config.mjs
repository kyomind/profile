import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kyomind.tw',
  output: 'static',
  build: { inlineStylesheets: 'never' }, // CSP style-src 'self' 不允許內嵌 <style>
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
    routing: { prefixDefaultLocale: false },
  },
});
