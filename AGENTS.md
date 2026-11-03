# AGENTS.md

Kyo 的個人形象首頁（kyomind.tw）。純靜態單頁，沒有建置步驟。

## 規則

- **push 到 `main` 即上線**（GitHub Pages）。commit 可以，push 前必須先問。
- **改過 `assets/css/style.css` 後執行 `make update`**，更新 cache-busting 版本號。
- **CSP 只有 `index.html` 的 meta 這一份**（Cloudflare 只管 DNS、沒開 proxy，GitHub Pages 也不送 CSP header）。新增任何外部資源（script、圖片、analytics、字型）時都要更新它，否則會被擋。
- **不要修改或刪除 `CNAME`**，它綁定自訂網域。
- **文案需同步**：簡介與標語同時出現在 `description`、`og:*`、`twitter:*` 和頁面內文，改一處就要全部一起改。
