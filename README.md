# profile

[kyomind.tw](https://kyomind.tw) 的原始碼：Kyo 的個人入口站（首頁、專案頁、關於頁，中英雙語）。用 Astro 建置，部署在 Cloudflare Pages。

## 結構

- `src/pages/`：路由。中文在根目錄，英文在 `en/`
- `src/content/index.ts`：中英文案
- `src/components/`、`src/layouts/`、`src/styles/`：版面與樣式
- `public/`：原樣複製到 `dist/` 的檔案，包含 favicon 與 `_headers`（安全 header）
- `scripts/check-dist.test.mjs`：檢查建置出的 `dist/`
- `DESIGN.md`：視覺規範；`GLOSSARY.md`：用語；`docs/adr/`：設計決策

## 指令

```sh
npm install
make dev     # 本機預覽 http://localhost:4321
make build   # 建置到 dist/
make ready   # build + 檢查 dist/，commit 前必須通過
```

## 部署

Cloudflare Pages 專案 `profile` 以 `main` 為正式環境，`redesign` 為預覽站（https://redesign.profile-9vb.pages.dev）。

GitHub Pages 目前提供凍結的 `legacy` 分支，作為退路，直到 #10 為止。根目錄的 `index.html`、`assets/` 與 `CNAME` 是舊站遺留，也保留到 #10。
