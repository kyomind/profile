// 入口站文案：依語言分開，頁面只負責呈現。
export type Locale = 'zh-TW' | 'en';

export interface Showcase { title: string; summary: string; highlights?: string[]; links: { label: string; href: string }[] }
export type NavKey = 'home' | 'projects' | 'about';
// href 省略 = 目前這頁（本語言）
export interface Nav { label: string; links: { key: NavKey; label: string; href: string }[]; langs: { label: string; locale: Locale }[] }
export interface Link { name: string; href: string }
export interface LinkGroup { heading: string; items: Link[] }

export interface Job { title: string; org?: string; period?: string; summary: string }
export interface About {
  heading: string;
  title: string;
  experience: { heading: string; jobs: Job[] };
  stack: { heading: string; groups: { name: string; items: string[] }[] };
  writing: { heading: string; items: string[] };
  contact: { heading: string; items: Link[] };
  more: { heading: string; text: string; link: Link };
}

export interface Content {
  lang: string;
  ogLocale: string;
  name: string;
  tagline: string;
  bio: string;
  avatar: { src: string; alt: string };
  title: string;
  description: string;
  nav: Nav;
  // showcase 由專案頁（#11）渲染，首頁不放
  projects: { heading: string; title: string };
  showcase: Showcase[];
  outputs: LinkGroup;
  accounts: LinkGroup;
  about: About;
}

export const content: Record<Locale, Content> = {
  'zh-TW': {
    lang: 'zh-TW',
    ogLocale: 'zh_TW',
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
      langs: [{ label: '中文', locale: 'zh-TW' }, { label: 'EN', locale: 'en' }],
    },
    projects: { heading: '專案', title: '專案 | Kyo Huang' },
    showcase: [
      {
        title: 'WeaMind',
        summary: '運行在自建 K3s 叢集上的智慧天氣 LINE Bot。從應用開發、CI/CD、基礎設施到可觀測性，全程獨立完成，是我把應用層與基礎設施當作一個完整案例的代表作。',
        highlights: [
          '應用層：LINE Bot，使用 FastAPI、PostgreSQL、Redis，測試覆蓋率 95%',
          '基礎設施：Hetzner Cloud 上的 K3s 三節點叢集',
          '交付：GitHub Actions 加 GHCR 自動化交付',
          '可觀測性：Prometheus 加 Grafana',
        ],
        links: [
          { label: '應用程式碼（WeaMind）', href: 'https://github.com/kyomind/WeaMind' },
          { label: '基礎設施（weamind-infra）', href: 'https://github.com/kyomind/weamind-infra' },
          { label: '開發與維運系列文章', href: 'https://blog.kyomind.tw/weamind-series/' },
        ],
      },
      {
        title: 'Chat Freezer',
        summary: '把 AI 對話一鍵匯出成 Markdown 的 Chrome 擴充功能，所有處理都只在本機完成。',
        links: [
          { label: '官方網站', href: 'https://chat-freezer.kyomind.tw' },
          { label: 'Chrome 線上應用程式商店', href: 'https://chromewebstore.google.com/detail/chat-freezer/hgdjifpblaeanangbggpjfhmlcmeodpk' },
        ],
      },
    ],
    outputs: { heading: '產出', items: [{ name: '部落格', href: 'https://blog.kyomind.tw' }] },
    accounts: { heading: '帳號', items: [
      { name: 'GitHub', href: 'https://github.com/kyomind' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kyo-huang/' },
      { name: 'Threads', href: 'https://www.threads.com/@kyomind.tw' },
      { name: 'X', href: 'https://x.com/kyomind' },
    ] },
    about: {
      heading: '關於',
      title: '關於 | Kyo Huang',
      experience: {
        heading: '經歷',
        jobs: [
          {
            title: 'Senior Software Engineer', org: '殷富資訊', period: '2025.03 — 2026.03',
            summary: '打造金融 AI 對話服務與知識庫系統，涵蓋 RAG、Agent Flow、多 LLM 整合，以及 PII 遮蔽與 Guardrails。',
          },
          {
            title: 'Python 後端工程師', org: '森淨科技', period: '2021.07 — 2024.08',
            summary: '開發 IoT 裝置管理平台，以 Redis 將查詢效能提升 3 倍。主導流程自動化與品質控管，Code Review 退回減少 30%，測試時間縮短 50%。',
          },
          {
            title: '數據工程師', org: '信義房屋', period: '2019.06 — 2021.04',
            summary: '建構每日數百萬筆用戶行為資料的清洗、聚合與儲存流程，並以 Django 開發內部資料查詢服務。',
          },
          {
            title: '法律系畢業，任公職 5 年多',
            summary: '離開公職後轉職成為軟體工程師，從資料工程起步。',
          },
        ],
      },
      stack: {
        heading: '技術棧',
        groups: [
          { name: 'Infrastructure & DevOps', items: ['AWS', 'Kubernetes / K3s', 'Terraform', 'Prometheus / Grafana', 'Jenkins / GitHub Actions'] },
          { name: 'Backend', items: ['Python', 'Django / FastAPI', 'PostgreSQL', 'Redis', 'MongoDB'] },
          { name: 'Testing & Quality', items: ['pytest', 'Ruff / Pyright', 'SonarQube', 'CodeQL / Bandit'] },
        ],
      },
      writing: {
        heading: '寫作成績',
        items: [
          '210+ 篇技術與思考文章',
          '部落格累積瀏覽 80 萬以上',
          '2024 iThome 鐵人賽 Python 組優選，系列為《Django 忍法帖》',
        ],
      },
      contact: {
        heading: 'CV 與聯絡方式',
        items: [
          { name: 'CV（CakeResume）', href: 'https://www.cake.me/resumes/kyomind' },
          { name: 'odinxp@gmail.com', href: 'mailto:odinxp@gmail.com' },
        ],
      },
      more: {
        heading: '更多關於我',
        text: '完整的故事寫在部落格的 About 頁。',
        link: { name: '部落格的 About 頁', href: 'https://blog.kyomind.tw/about/' },
      },
    },
  },
  en: {
    lang: 'en',
    ogLocale: 'en_US',
    name: 'Kyo Huang',
    tagline: 'Python × AI × DevOps',
    bio: 'Software engineer who believes AI and infrastructure are where developers are headed. I learn by writing things down, and I hope to keep doing it until I\u2019m 70.',
    avatar: { src: 'https://img.kyomind.tw/1280.jpg', alt: 'Portrait of Kyo Huang' },
    title: 'Kyo Huang | Python × AI × DevOps',
    description: 'Software engineer who believes AI and infrastructure are where developers are headed. I learn by writing things down, and I hope to keep doing it until I\u2019m 70.',
    nav: {
      label: 'Main navigation',
      links: [
        { key: 'home', label: 'Home', href: '/en/' },
        { key: 'projects', label: 'Projects', href: '/en/projects/' },
        { key: 'about', label: 'About', href: '/en/about/' },
      ],
      langs: [{ label: '中文', locale: 'zh-TW' }, { label: 'EN', locale: 'en' }],
    },
    projects: { heading: 'Projects', title: 'Projects | Kyo Huang' },
    showcase: [
      {
        title: 'WeaMind',
        summary: 'A smart weather LINE bot running on a self-hosted K3s cluster. I built it end to end alone, from the application and CI/CD to the infrastructure and observability, as one complete case covering both the app layer and the infrastructure underneath it.',
        highlights: [
          'Application: a LINE bot built with FastAPI, PostgreSQL and Redis, at 95% test coverage',
          'Infrastructure: a three-node K3s cluster on Hetzner Cloud',
          'Delivery: automated with GitHub Actions and GHCR',
          'Observability: Prometheus and Grafana',
        ],
        links: [
          { label: 'Application code (WeaMind)', href: 'https://github.com/kyomind/WeaMind' },
          { label: 'Infrastructure (weamind-infra)', href: 'https://github.com/kyomind/weamind-infra' },
          { label: 'Development and operations series (in Chinese)', href: 'https://blog.kyomind.tw/weamind-series/' },
        ],
      },
      {
        title: 'Chat Freezer',
        summary: 'A Chrome extension that exports AI conversations to Markdown in one click. Everything is processed locally on your machine.',
        links: [
          { label: 'Official website', href: 'https://chat-freezer.kyomind.tw' },
          { label: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/chat-freezer/hgdjifpblaeanangbggpjfhmlcmeodpk' },
        ],
      },
    ],
    outputs: { heading: 'Writing', items: [{ name: 'Blog', href: 'https://blog.kyomind.tw' }] },
    accounts: { heading: 'Accounts', items: [
      { name: 'GitHub', href: 'https://github.com/kyomind' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kyo-huang/' },
      { name: 'Threads', href: 'https://www.threads.com/@kyomind.tw' },
      { name: 'X', href: 'https://x.com/kyomind' },
    ] },
    about: {
      heading: 'About',
      title: 'About | Kyo Huang',
      experience: {
        heading: 'Experience',
        jobs: [
          {
            title: 'Senior Software Engineer', org: 'INFOTECH', period: '2025.03 — 2026.03',
            summary: 'Built conversational AI services and knowledge-base systems for finance: RAG, agent flows, multi-LLM integration, PII masking and guardrails.',
          },
          {
            title: 'Python Backend Engineer', org: 'AMASTek', period: '2021.07 — 2024.08',
            summary: 'Developed an IoT device management platform and tripled query performance with Redis. Led workflow automation and quality control, cutting code-review rejections by 30% and test time by 50%.',
          },
          {
            title: 'Data Engineer', org: 'Sinyi Realty', period: '2019.06 — 2021.04',
            summary: 'Built pipelines to clean, aggregate and store millions of daily user-behavior records, and developed an internal data query service with Django.',
          },
          {
            title: 'Law graduate, 5+ years in the civil service',
            summary: 'Left the civil service to become a software engineer, starting in data engineering.',
          },
        ],
      },
      stack: {
        heading: 'Tech stack',
        groups: [
          { name: 'Infrastructure & DevOps', items: ['AWS', 'Kubernetes / K3s', 'Terraform', 'Prometheus / Grafana', 'Jenkins / GitHub Actions'] },
          { name: 'Backend', items: ['Python', 'Django / FastAPI', 'PostgreSQL', 'Redis', 'MongoDB'] },
          { name: 'Testing & Quality', items: ['pytest', 'Ruff / Pyright', 'SonarQube', 'CodeQL / Bandit'] },
        ],
      },
      writing: {
        heading: 'Writing',
        items: [
          '210+ posts on technology and thinking',
          '800,000+ total blog views',
          'Excellence Award, Python category, 2024 iThome Ironman Contest, for the series \u201CDjango Ninja Scrolls\u201D (in Chinese)',
        ],
      },
      contact: {
        heading: 'CV and contact',
        items: [
          { name: 'CV (CakeResume)', href: 'https://www.cake.me/resumes/kyomind' },
          { name: 'odinxp@gmail.com', href: 'mailto:odinxp@gmail.com' },
        ],
      },
      more: {
        heading: 'More about me',
        text: 'The full story is on the About page of my blog (in Chinese).',
        link: { name: 'About page on the blog', href: 'https://blog.kyomind.tw/about/' },
      },
    },
  },
};
