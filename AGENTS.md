# AGENTS.md

Kyo 的個人入口站（kyomind.tw）。Astro 建置，部署在 Cloudflare Pages。目錄結構與指令見 README.md。

## 規則

- **push 前必須先問 Kyo**；commit 可以。`kyomind.tw` 綁定完成後，push 到 `main` 即部署正式環境（Cloudflare Pages 專案 `profile`）；`redesign` 是預覽站。
- **每次 commit 前 `make ready` 必須通過**。
- **改任何視覺前先讀 `DESIGN.md`**。
- **安全 header（含 CSP）只放在 `public/_headers`**。新增外部資源（script、圖片、analytics、字型）時要更新它，否則會被擋。
- **不要修改或刪除 `CNAME`**，到 #10（切換滿 2 週後關閉舊站）之前都要保留。
- **根目錄的 `index.html` 與 `assets/` 是舊站遺留**，保留到 #10，不要改動。GitHub Pages 目前服務凍結的 `legacy` 分支作為退路。
- **文案需同步**：簡介與標語同時出現在 `description`、`og:*`、`twitter:*` 和頁面內文，中英兩版各自都要同步；文案集中在 `src/content/index.ts`，改一處就要全部一起改。

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`kyomind/profile`), managed via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + `docs/adr/`, created lazily. See `docs/agents/domain.md`.
