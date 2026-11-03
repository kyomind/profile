# 一頁的入口站改用 Astro，並部署到 Cloudflare Pages

入口站只有一頁，原本是手寫 HTML、部署在 GitHub Pages，沒有建置步驟。2026-11 大改版時決定改用 Astro，並搬到 Cloudflare Pages，因為：新站要做中英雙語，Astro 內建 i18n 路由，根目錄放中文、`/en/` 放英文，兩份文案可以共用同一套版面；Cloudflare Pages 能用 `_headers` 送真正的 CSP 等 HTTP header，取代 HTML 裡的 meta 備援；而且技術和部署方式都跟 neo-blog（`blog.kyomind.tw`）一致。

## Considered Options

- **維持純靜態，留在 GitHub Pages**：最簡單，不用建置步驟。被放棄，因為雙語會讓兩份 HTML 的版面各自分歧，而 GitHub Pages 無法送自訂 header。
- **Astro 搭配 GitHub Pages Actions**：不用改 DNS。被放棄，因為還是不能送自訂 header，部署方式也會跟 neo-blog 不一樣。

## Consequences

- 切換時要改 `kyomind.tw` 的 DNS；切換後舊站保留 2 週當作退路。
- `make update` 和 `update-version.sh` 會失效，因為 Astro 建置時會自動在檔名加上 hash，不再需要手動更新版本號。切換後要更新 AGENTS.md 裡相關的規則。
