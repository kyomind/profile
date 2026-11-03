import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kyomind.tw',
  output: 'static',
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
    routing: { prefixDefaultLocale: false },
  },
});
