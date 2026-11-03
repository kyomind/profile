// 入口站文案：依語言分開，頁面只負責呈現。
export type Locale = 'zh-TW' | 'en';

export interface Showcase { title: string; summary: string; links: { label: string; href: string }[] }
export type NavKey = 'home' | 'projects' | 'about';
// href 省略 = 目前這頁（本語言）
export interface Nav { label: string; links: { key: NavKey; label: string; href: string }[]; langs: { label: string; href?: string }[] }
export interface Link { name: string; href: string }
export interface LinkGroup { heading: string; items: Link[] }

export interface Content {
  lang: string;
  name: string;
  tagline: string;
  bio: string;
  avatar: { src: string; alt: string };
  title: string;
  description: string;
  nav: Nav;
  // showcase 由專案頁（#11）渲染，首頁不放
  showcase: Showcase[];
  outputs: LinkGroup;
  accounts: LinkGroup;
}

export const content: Partial<Record<Locale, Content>> = {
  'zh-TW': {
    lang: 'zh-TW',
    name: 'Kyo Huang',
    tagline: 'Python × AI × DevOps',
    bio: '軟體工程師，相信 AI 與 Infra 是開發者的未來。擅長用文字記錄學習，希望可以寫到 70 歲。',
    avatar: { src: 'https://img.kyomind.tw/1280.jpg', alt: 'Kyo Huang 的大頭照' },
    title: 'Kyo Huang | Python × AI × DevOps',
    description: '軟體工程師，相信 AI 與 Infra 是開發者的未來。擅長用文字記錄學習，希望可以寫到 70 歲。',
    nav: {
      label: '主導覽',
      links: [
        { key: 'home', label: '首頁', href: '/' },
        { key: 'projects', label: '專案', href: '/projects/' },
        { key: 'about', label: '關於', href: '/about/' },
      ],
      // 英文版（票 #5）完成前，EN 先指向 /en/
      langs: [{ label: '中文' }, { label: 'EN', href: '/en/' }],
    },
    showcase: [],
    outputs: { heading: '產出', items: [{ name: '部落格', href: 'https://blog.kyomind.tw' }] },
    accounts: { heading: '帳號', items: [
      { name: 'GitHub', href: 'https://github.com/kyomind' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kyo-huang/' },
      { name: 'Threads', href: 'https://www.threads.com/@kyomind.tw' },
      { name: 'X', href: 'https://x.com/kyomind' },
    ] },
  },
  // en：票 #5 才加入
};
