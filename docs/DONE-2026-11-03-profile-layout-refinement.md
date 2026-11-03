# 入口站版面微調與英文文案測試：實作紀錄與交接

整理日期：2026-11-03

## MEMOS

給沒有上下文的新 session：先讀這段，再看需要的細節。

- 本次承接 `docs/DONE-2026-11-03-profile-redesign.md`，沒有重新設計網站，只補英文文案測試、調整導覽與卡片外留白、將 Copyright 移到卡片外。
- **最終導覽設計**：未選取項目灰字，hover 深灰加底線；目前頁籤是白底 `#ffffff`＋清晰中灰邊框 `#b0aca2`＋深灰字 `#2d3748`（常規字重，不加粗）＋8px 圓角，hover 不加底線。右側語言切換採單一目標按鈕（中文頁顯示 `EN`、英文頁顯示 `中文`，404 顯示 `EN`），不再雙語並列，省下手機空間且防止擠壓折行。所有導覽項目加 `white-space: nowrap`。導覽外緣與下方白色卡片左右完全切齊對齊（`nav` 的 padding 設為 0）。白色大卡片陰影採用柔化負擴散投影（`0 4px 14px -2px rgba(0,0,0,.1)`），自然淡出且完全消除生硬的邊緣線感。**Navbar 不用紅色**。紅色文字連結只用在白卡片內文，首頁按鈕與 DevOps 點綴色不變。
- 桌機 `body` 上方 padding 是 **2.5rem（預設 40px）**，手機仍為 0.5rem。Navbar 與白卡片相隔 **12px**。Copyright 位於白卡片外的米色背景，與卡片相隔 1.5rem。
- **實作完成但視覺修改尚未 commit，也沒有 push**。本次結束前 `main` 相對本機追蹤的 `origin/main` 領先 2 個 commits：`5e876ca`（上一份改版紀錄）與 `d800d02`（英文文案測試）。沒有 fetch；這不是遠端即時查詢結果。
- 尚未提交的程式／規範檔：`src/layouts/Card.astro`、`src/styles/site.css`、`scripts/check-dist.test.mjs`、`DESIGN.md`。另有本份新紀錄文件。
- 最近一次 `make ready`：**31/31 通過**。Chrome 自動檢查涵蓋 7 頁 × 3 個視窗寬度（1440、390、320px）；最後也實際讀取桌機截圖，確認選取框不再貼住白卡片。
- **工作方式有新決策**：Kyo 在本次中途明確要求「剩下的部分你自己實作就好了，不需要再派 Subagent」。後半段已由主代理直接實作；不要照上一篇交接文件自動派 Sonnet。若沒有新指示，接續微調直接做。
- `AGENTS.md` 仍有效：改視覺先讀 `DESIGN.md`；每次 commit 前 `make ready` 必須通過；**push 前問 Kyo**。本次沒有取得 push 授權。
- 本次沒有新開 issue。既有 **#10 舊站清理仍須等 2026-11-17 後**，細節見上一篇交接；本次沒有查詢 GitHub 更新 ticket 狀態，也沒有動舊站、DNS 或部署設定。

## 背景：從局部細節改看整體均衡

Kyo 提供首頁截圖，詢問版面是否均衡。代理最初提出連結列排列、簡介斷行、名字與標語間距等建議，但 Kyo 指出那些不是當下重點。

真正要解決的是：

1. 導覽太靠近畫面上緣，頁面上方的米色留白不夠。
2. Copyright 不需要在白卡片內；它是網站頁尾，應放到外側米色背景。
3. 導覽的連結樣式與目前位置標示應清楚分工。

**沒有實作最初那些局部建議**：沒有重排首頁帳號按鈕、加寬文字欄、硬插簡介換行，也沒有改頭像、名字或標語間距。

## 決策演進與最終定案

### 1. 頁面外部留白與頁尾

- 桌機（≥768px）在既有 media query 增加 `body { padding-top: 2.5rem; }`。
- 手機保留 `body` 原本的 0.5rem 上方 padding。
- 共用 layout 的 `<footer>` 移出 `.card`，成為其後的兄弟節點。
- footer 使用 `margin-top: 1.5rem`，移除原本為卡片內頁尾設計的 padding；底部沿用 body 的 2rem 留白。
- 所有中英文頁與 404 共用這個結構。

### 2. 導覽嘗試過的方向

| 階段 | 做法 | 結果 |
|---|---|---|
| 原版 | 目前頁籤深灰字＋固定底線，其他灰字 | Kyo 希望不要預設底線 |
| 第一次調整 | 目前頁籤紅字，其他灰字，hover 才加底線 | 顏色同時承擔連結與目前位置，語意不夠清楚 |
| 討論但未實作 | 目前頁籤深灰粗體，其他紅字 | Kyo 偏好以背景與框線標示選取 |
| 第二次調整 | 目前頁籤灰底細框，其他紅字；語言切換相同 | 紅色在 Navbar 太搶眼；選取框底部貼住白卡片 |
| 第三次調整 | 目前項目灰底細框；其他灰字，hover 深灰加底線 | 灰底與米色頁面底色階差太小、不明顯，且邊框干擾字體可讀性 |
| 第四次調整 | 目前項目深色底 `#2d3748`＋淺灰字 `#f5f4f1` | 導覽具備大面積深色塊，與名字同色且過重，和卡片內 Blog 紅色按鈕產生視覺衝突 |
| **最終版** | **目前項目白底 `#ffffff`＋清晰中灰框 `#b0aca2`＋深灰字 `#2d3748`；語言切換採單一目標開關（`EN` / `中文`）；項目禁止折行；導覽左右外緣與白卡片完全對齊；與卡片留 12px** | 白底 Mini card 呼應大白卡片，邊框清晰對比充足，不搶 Blog 紅色按鈕焦點，手機寬度充裕絕不折行 |

### 3. 最終樣式契約

- Navbar 未選取：`#6b7280`，無底線。
- Navbar 未選取 hover：`#2d3748`，加底線，offset 4px。
- Navbar 已選取：白底 `#ffffff`、深灰文字 `#2d3748`（常規字重，不加粗）、邊框 `#b0aca2`，8px 圓角；hover 不加底線。
- Navbar 語言切換：單一目標按鈕（中文頁放 `EN`，英文頁放 `中文`），不帶 `aria-current`，右緣貼齊卡片右界。
- Navbar 防折行：所有 `nav a` 設置 `white-space: nowrap`。
- 白色卡片陰影：`0 4px 14px -2px rgba(0,0,0,.1)`，負 spread 消除底邊硬線，柔和自然彌散。
- Navbar 對齊：`nav` 不設左右 padding（`padding: 0`），使第一個 Item 左外緣與最後一個 Item 右外緣，和大白卡片（`.card`）的左右邊界在同一條鉛垂線上完全對齊（align）。`nav .lang` 設 `gap: 0.25rem` 與左側項目間距一致。
- 所有導覽項目預留 1px 透明邊框，選取狀態不因新增邊框而位移。
- 導覽項目上下 padding 從 0.6rem 減為 0.4rem，仍保留 `min-height: 44px`。縮小內距不是縮掉可點擊範圍。
- Navbar `margin-bottom: 12px`，讓選取框與白卡片分離。
- 原生鍵盤焦點框保留；不加陰影或浮起動畫。
- 白卡片內文連結（`main:not(.home) a`，含 404）：`#b84c32`，預設無底線，hover 加底線，offset 3px。
- 首頁部落格／帳號按鈕不改；DevOps 的點綴色也不改。

## 變更位置與語意

| 檔案 | 本次責任 |
|---|---|
| `src/layouts/Card.astro` | footer 移到卡片外；語言切換改為單一目標按鈕（Toggle） |
| `src/styles/site.css` | 桌機外部上方留白、外部 footer、導覽白底中灰框／常規字重／12px 間距／對齊卡片、防折行、卡片立體陰影、紅色內文連結 |
| `DESIGN.md` | 同步最終設計契約；導覽選取態、單一語言切換、防折行、卡片陰影與邊界對齊契約 |
| `scripts/check-dist.test.mjs` | 英文文案、頁尾結構、單一目標語言切換、導覽與內文 CSS 的回歸保護 |

頁籤仍使用 `<a>` 導覽，不是 ARIA tab widget，不需要加 `role="tab"` 或另做 JavaScript 鍵盤控制。

- 頁面導覽目前項目：既有 `aria-current="page"`。
- 語言切換：採單一目標按鈕（Toggle），中文頁顯示 `EN` 連往英文對應頁，英文頁顯示 `中文` 連往中文對應頁；不並列當前語言，不加 `aria-current`。
- 404 的 `current` 未設定，導覽列不標目前項目；語言切換顯示 `EN` 連往英文首頁。
- 所有文字與網址仍集中在 `src/content/index.ts`；本次沒有改文案。

## 英文測試：已獨立提交

Commit：`d800d02 Add assertions for English page copy`。

原本英文測試已有路由、導覽、區塊連結一致性、meta／OG／Twitter 同步，但只檢查內容存在或沒有中文，沒有固定英文文案的斷言。

新增 4 個測試（21 → 25）：

1. 三個英文頁面的精確 `<title>`。
2. 英文首頁 bio、標語，以及 description 等於預期 bio。
3. 首頁、專案頁、關於頁的 h1／h2 清單。
4. 關於頁公司名稱：INFOTECH、AMASTek、Sinyi Realty。

使用字面預期值，不從 `content` 匯入相同資料當作測試答案。既有測試繼續負責 OG／Twitter 與 description 同步。

當時由 Sonnet 修改暫存的 `dist/` 做 mutation check：將 Projects 標題改錯、將 bio 的 engineer 改成 developer，新測試確實失敗；之後重跑 `make ready` 還原生成檔，25/25 通過。這項 mutation check 是協作者回報；主代理另外檢查 diff 並重跑成功測試。

## 後續測試與驗證

最終共有 **31 個 node:test**：

- 英文文案：原 21 + 4 = 25。
- 頁尾結構擴至英文三頁：25 + 3 = 28；404 在既有測試中呼叫相同 helper。
- 導覽樣式：+1。
- 語言選取：+1。
- 內文連結樣式：+1。

`assertFooterAfterCard` 檢查一張卡片、一個 footer，以及 `</main></div><footer>…</footer></body>` 的順序；它是配合目前簡單 HTML 結構的檢查，不是通用 DOM parser。未來若增加 wrapper，需一起調整。

CSS 測試讀取建置後的 CSS。注意 minifier 會把 `transparent` 轉成 `#0000`，目前測試容許兩者。若建置工具升級改變 CSS 序列化，應先分清是測試格式假設失效還是樣式真的退步，不要直接改產品行為迎合正則。

### 瀏覽器檢查

使用獨立 Playwright CLI session 搭配本機 Chrome：

```bash
playwright-cli -s=profile-neutral open http://localhost:4321 --browser=chrome
# resize / run-code / screenshot
playwright-cli -s=profile-neutral close
```

預設 browser 啟動失敗，因為指定版本的 chrome-for-testing 不在本機；改用已安裝的 `--browser=chrome` 即可，不需要安裝新套件或瀏覽器。

最終檢查涵蓋：

- 路徑 `/`、`/projects/`、`/about/`、`/en/`、`/en/projects/`、`/en/about/`、`/404`。
- 寬度 1440、390、320px，共 21 組。
- Navbar 與卡片實際間距為 12px。
- 所有導覽項目高度至少 44px，沒有水平溢出。
- Navbar 一般／hover 顏色與底線；內文連結一般／hover 顏色與底線。
- 前一輪另驗過目前頁籤與語言的選取數量、樣式、選取 hover 不加底線，以及鍵盤 Tab 焦點框。
- 最終桌機截圖實際讀取確認，路徑 `/tmp/profile-neutral-desktop.png`（暫存，不保證下次仍存在）。

限制：沒有測 Safari／Firefox 或實體手機；尺寸模擬不等於真機驗證。請勿只憑 computed style 通過就宣稱視覺完成，這次就曾漏看選取框貼住卡片，最後才補上截圖檢查。

## 本機環境與收尾

- 本次使用既有 `localhost:4321` 的 Node 開發伺服器；沒有啟動或停止該伺服器。上一篇記載的舊 Python server 狀態已不能當成現在事實，接手時請重新查 `lsof`。
- 本次建立的 Herdr 協作者分頁已全部關閉；後半段未再派工。
- 本次 Playwright browser sessions 已關閉；自動產生的 `.playwright-cli/` snapshot/log 已移除，不應提交。
- `/tmp/profile-*.png` 和驗證 log 是暫存產物，不是專案依賴。
- 沒有改安全 headers、外部資源、CNAME、根目錄舊站檔案或 Cloudflare 設定。

## 待處理事項

1. **本次視覺修改與本文件尚待提交**：先 `git diff` 確認現況，再依 Kyo 指示 commit；每次 commit 前重跑 `make ready`。不必再把已提交的英文文案測試重做一次。
2. **push 尚未授權**：需問 Kyo；push 到 main 會觸發正式站部署。不能把允許 commit 當作允許 push。
3. **既有 #10**：2026-11-17 後才能清理舊站，每一步須取得授權；舊站清理與總 spec #1 收尾細節見上一篇文件。本次沒有新增 issue，也沒有新的已知功能 bug。
4. 上一份交接提到的 www 轉址與 Astro／Node 升級，本次沒有處理或重新查證；英文文案測試缺口則已補。

若繼續調整視覺，先看目前 `DESIGN.md` 和瀏覽器實際畫面，優先確認整體留白、導覽層級與互動語意，不要自行延伸成新的視覺重設計。
