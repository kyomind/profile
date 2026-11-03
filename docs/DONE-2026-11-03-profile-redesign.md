# kyomind.tw 入口站大改版：從手寫單頁到 Astro + Cloudflare Pages

整理日期：2026-11-03

## MEMOS

給下一個沒有上下文的 session。先讀這段就好，細節在後面。

- **現況**：2026-11-03 08:59 UTC 已經切換。`kyomind.tw` 和 `www.kyomind.tw` 現在由 Cloudflare Pages 專案 `profile` 提供，內容是 `main` 分支的 Astro 站：首頁、專案頁、關於頁三頁，中文在根目錄、英文在 `/en/`，另有 404 頁。
- **唯一還沒做的 ticket 是 #10**：關閉舊站，**2026-11-17 之後才能做**。做完 #10，就能關閉總 spec #1。
- **退路還在**：GitHub Pages 目前從凍結的 `legacy` 分支提供舊站。如果要回退，見下方「退路」一節。#10 之前不要刪 `legacy`、`CNAME`，也不要刪根目錄的 `index.html` 和 `assets/`。
- **規則以 `AGENTS.md` 為準**。最常被忘記的三條：push 前一定要問 Kyo（push 到 `main` 就會直接部署正式站）；commit 前 `make ready` 必須通過；改視覺前先讀 `DESIGN.md`。
- **詞彙以 `GLOSSARY.md` 為準**：入口站、首頁、專案頁、關於頁、代表作、產出、帳號、導覽、舊站、新站、預覽站、切換。
- **Kyo 的核心原則**：UX 比 UI 重要，資訊好不好找比好不好看重要。視覺沿用舊站，不追求獨特。
- **派工方式**：主代理不寫程式，每張 ticket 都在 Herdr 開新分頁，交給 Claude Code Sonnet 執行 `/implement`。容易踩雷的地方見「工作流程」一節，**一定要讀**。

## 背景與目標

舊站是 2025 年手寫的單頁 HTML，放在 GitHub Pages。它的問題是：沒有任何能證明能力的內容、帳號清單過時（還有 Facebook，卻沒有 Threads 和 X）、只有中文、CSP 只能用 meta 備援，而且同時跑 GA4 和 Umami 兩套統計。

這次改版的總 spec 是 issue #1，拆成 #2–#14 共 13 張 ticket。#1 的內文還留著早期的方向（深色、全新設計），**實際定案以 #1 的留言為準**。

## 決策紀錄（依時間順序）

| 決策 | 結論 | 理由與來源 |
|---|---|---|
| 入口站的定位 | 個人入口，加上代表作作為能力證據；不做成履歷頁 | Kyo 剛拿到 offer，主要訪客是讀者，不是招募者 |
| 和部落格的關係 | kyomind.tw 獨立存在；部落格的 `/about` 不動 | 兩者分工不同，見下方「關於頁」那一列 |
| 技術與部署 | Astro，部署在 Cloudflare Pages | 雙語路由、`_headers` 可以送真正的 header、和 neo-blog 一致（ADR-0001） |
| 語言 | 中文在根目錄、英文在 `/en/`，不依瀏覽器語言自動導向 | 英文文案由 agent 起草、Kyo 定稿 |
| 視覺 | **放棄全新設計，沿用舊站**：淺色、白卡片、250px 頭像 | 做了 15 個稿（3 個 + 12 個），Kyo 都不滿意；結論是 UX 比 UI 重要 |
| 資訊架構 | 三頁：首頁（名片、產出、帳號）、專案頁、關於頁；每頁上方有明顯的導覽 | 訪客最常做三件事：知道 Kyo 是誰、找到寫作和帳號、評估能力 |
| 專案頁 | WeaMind（代表作，寫得最詳細）＋ Chat Freezer | Chat Freezer 不開源，所以連到它的網站和 Chrome 商店，不連 repo |
| 關於頁 | 經歷、技術棧、寫作成績、CV、Email；完整故事連到部落格的 About 頁 | 內容從已經失效的舊 portfolio 站（`~/Code/portfolio`）搬過來；那個 repo 會在 #10 封存 |
| AI 味處理 | 拿掉 emoji 圖示、漸層文字 | 參考 `~/Code/DOCS/goals/2026-11-03-vibe-coding-aesthetics-glm-5-3.md` |
| 點綴色 | `#d2593c` 改成 `#b84c32` | 原色配白底對比只有 4.01，沒達到 AA；新色是 5.10 |
| 統計 | 只留 Umami，加上 `data-domains="kyomind.tw"` | GA4 拿掉；預覽站不計入流量 |
| CSP | 只放在 `public/_headers`，不使用 `unsafe-inline` | 改用外部 CSS 檔（`inlineStylesheets: 'never'`），並移除頭像的 inline `onerror` |
| 英文公司名稱 | 殷富資訊寫成 INFOTECH，森淨科技寫成 AMASTek，信義房屋寫成 Sinyi Realty | 依 Yourator 公司頁查證；agent 原本自己擬的名稱是錯的 |

## 現在的架構

- `src/content/index.ts`：中英兩種語言的**所有文案和連結**，頁面只負責呈現
- `src/layouts/Card.astro`：共用版型，包含導覽、語言切換、meta、hreflang、canonical、OG、Umami、favicon
- `src/components/{Home,Projects,About}.astro` 加上 `src/pages/` 與 `src/pages/en/` 下的薄包裝檔
- `src/pages/404.astro`：中英雙語的 404 頁，有 noindex
- `src/styles/site.css`：照 `DESIGN.md` 寫的樣式
- `public/_headers`：CSP、nosniff、Referrer-Policy；`public/` 也放 favicon 和 `site.webmanifest`
- `scripts/check-dist.test.mjs`：**唯一的測試檢查點**，用 `node:test` 檢查建置後的 `dist/`，目前 21 項
- `make dev`（port 4321）、`make build`、`make check`、`make ready`（先 build 再 check）
- 文件：`AGENTS.md`、`README.md`、`DESIGN.md`、`GLOSSARY.md`、`docs/adr/0001-*`、`docs/agents/*`（mattpocock skills 的設定）

## 線上設定

| 項目 | 值 |
|---|---|
| Cloudflare Pages 專案 | `profile`，串接 GitHub；production branch 是 `main`；只有 `redesign` 會產生預覽部署；`NODE_VERSION=22` |
| 網址 | 正式 https://kyomind.tw（以及 www）；pages.dev 是 `profile-9vb.pages.dev`；預覽 `redesign.profile-9vb.pages.dev` |
| DNS | `kyomind.tw` 和 `www` 都是 CNAME 指向 `profile-9vb.pages.dev`，開 proxy；apex 那筆的 record id 是 `8498d7b0a21a5ee4af89c5b4caeb71fc` |
| GitHub App | Kyo 已經授權 Cloudflare Workers and Pages 存取 `kyomind/profile`。**少了這個授權，push 不會自動部署** |
| GitHub Pages | 來源是 `legacy` 分支的根目錄（舊站 807b000）；憑證到 2027-01-29 |
| Umami | website id `79cdd0f1-75b2-4ef7-b03f-dd14cc688099`（沿用舊站），2026-11-03 確認有正常計數 |
| GitHub labels | `needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix` |

### 退路（#10 之前有效）

1. 刪掉 `kyomind.tw` 的 CNAME（record `8498d7b0a21a5ee4af89c5b4caeb71fc`）
2. 加回 4 筆 A 記錄，都是 DNS only：`185.199.108.153`、`.109`、`.110`、`.111`
3. GitHub Pages 會從 `legacy` 提供舊站。`www` 切換前就已經回 526，不用還原

## 工作流程（如何如法炮製）

1. **規劃**：`/grill-with-docs`（用 AskUserQuestion 一輪一輪問）→ `/to-spec` 發成 issue → `/to-tickets` 拆成垂直切片的 ticket，用 GitHub 原生的 blocked-by 標出依賴，並設成 sub-issue。
2. **實作**：主代理只負責協調和驗證。每張 ticket 都：
   - `herdr tab create --label implNN-claude --no-focus`
   - `herdr agent start ... --kind claude -- --model sonnet --effort medium`
   - 送出 `/implement ticket NN. Read and follow <brief 檔路徑>`
   - agent 完成後，主代理自己重跑 `make ready`、檢查 dist 和截圖，在 issue 留言後關閉，再關掉分頁
3. **⚠️ slash 指令的雷**：
   - `herdr agent prompt` 是用「貼上」的方式送出，Claude Code 不會把 `/implement` 當成指令執行。**要用 `herdr pane send-text` 打字輸入，再 `send-keys enter`。**
   - 文字太長，就算用 send-text，也會被當成貼上。**所以指令要短**，詳細說明放進 brief 檔（例如 `/tmp/profile-spec/impl-brief.md`、`t09.md`）。
   - 要驗證有沒有正式載入：去 `~/.claude/projects/-Users-kyo-Code-profile/<session>.jsonl` 找 `<command-name>/implement</command-name>`。
   - `implement` skill 設了 `disable-model-invocation: true`，用內建 subagent 的 Skill 工具叫不動，**只能透過 Herdr 分頁打字執行**。
4. **其他雷**：
   - agent 輸入框會出現 Claude Code 自動產生的建議文字，例如「push 到 main 上線」。那不是 Kyo 輸入的，不要照做。
   - agent 常常沒有正式呼叫 tdd skill（#4、#6、#7、#14 都是），但做法上有先寫失敗的測試。要嚴格遵守的話，可以在 brief 裡強調。
   - heredoc 寫檔時，常被安全檢查擋下來等確認，用 `herdr agent read` 看清楚內容後，再 `send-keys enter` 核准。
   - agent 有時會留下 `astro preview` 沒關（port 4399），結束後檢查一下。
   - `cf pages deployments get` 要加 `--project-name profile`。
   - Cloudflare Pages 在沒有 404 頁時，會把不存在的網址導回首頁並回 200，形成 soft 404。
5. **線上變更**：都由主代理用 `cf` 和 `gh` 執行，**每一步都先取得 Kyo 當次的授權**，並且先 dry-run、先保存原本的值。
6. **Umami 驗證**：無頭瀏覽器會被判定成機器人，回 `{"beep":"boop"}`。要用一般 Chrome 的 User-Agent，回應裡有帶 `websiteId` 的 session token 才算成功。Codex 工作帳號的用量用完時，改用 Claude Code 搭配 Claude in Chrome。

## Commit 一覽（`807b000` 之後，全部都在 `main` 上）

- 前置作業：`b22e9da`、`5afdd55`（AGENTS.md）、`3d46041`（README）、`86d2c29`（skills）、`591aa14`（docs/agents）、`a652cab`（glossary、ADR）、`9cfa5df`
- 實作：`5e55a41`（#3 骨架）、`f391362`（#13 導覽）、`669800d`（#4）、`4def0eb`（#11）、`6374739`（#14）、`d4dd26a`、`559b609`、`3f436cb`（#6 視覺）、`d5e0feb`、`e70bb2d`（#5 英文版）、`8feade4`（#7 header）、`5cc8dbd`、`a53ff13`（#8 favicon 和 404）、`acdce68`（#9 文件）
- 探索稿：`14fc855`、`2ea9c46`，已經在 `725a998` 刪除，要看的話去 git 歷史找

## 待處理

- **#10（2026-11-17 之後）**：每一步都要先問 Kyo。
  1. 關閉 GitHub Pages
  2. 刪除遠端的 `legacy` 和 `redesign` 分支
  3. 移除 `CNAME`、根目錄的 `index.html` 和 `assets/`，並改掉 AGENTS.md 和 README 裡相關的規則。favicon 已經複製到 `public/`，可以放心刪
  4. `gh repo archive kyomind/portfolio`
  5. 確認 `kyomind.tw` 仍然正常，然後關閉 #1
- **小事，不急，也沒有開 issue**：
  - `www.kyomind.tw` 直接顯示網站，沒有 301 轉到 apex（頁面有 canonical，影響不大）
  - port 4321 被一個舊的 `python3 -m http.server` 佔著，pid 82754，看起來是 Kyo 自己開的
  - 測試只驗中文標題，英文文案沒有斷言保護
  - Astro 固定在 7.4.1，因為 7.4.5 需要 Node 22.23.4 以上，本機是 22.23.1
