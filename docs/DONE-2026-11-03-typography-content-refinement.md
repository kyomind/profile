# 字型、排版與內容微調紀錄

整理日期：2026-11-03

## MEMOS：下個 Session 先看

- 本次主要工作已完成：參考 neo-blog 調整字型與標題、首頁標語漸層、關於頁內容與技術棧排版。現行視覺規範以根目錄 `DESIGN.md` 為準；改視覺前先讀，偏離規範先問 Kyo。
- 整理時變更仍在工作樹，尚未 commit 或 push；接手先用 `git status` 確認現況。push 前必須先問 Kyo，commit 前必須通過 `make ready`。
- `make dev`／`npm run dev` 固定使用 **4322**，4321 留給 blog repo。預覽網址 http://localhost:4322；本次曾啟動背景 dev server，但下次 session 不保證仍在執行。
- 最近一次 `make ready`：build 成功，32 項測試通過。尚未由 agent 在瀏覽器完整檢查各尺寸排版；Kyo 曾自行預覽並逐步回饋。
- 無使用者交辦但尚未實作的事項。下方列出非阻塞的驗證注意事項，不代表已建立 GitHub issue。

## 本次決策與實作

### 字型與標題

- 英數字改用 neo-blog 同一份本機 Nunito Latin variable：`src/assets/fonts/nunito-latin-variable.woff2`，授權檔在同目錄。`src/styles/site.css` 宣告 `@font-face`、`font-display: swap`，中文字形回退系統字型。字型同源提供，不需擴充 `public/_headers` 的 CSP。
- 標題顏色參考 neo-blog `src/styles/even.css`：H2 `#34495e`、H3 `#5a7c9f`。
- 字級歷經試用而收斂：首頁名字 **2.25rem**；其他 H1 **1.875rem**、H2 **1.5rem**、H3 **1.25rem**。以預設根字級 16px 計算分別為 36、30、24、20px。內文 1.1rem、導覽 1.2rem。首頁名字刻意比其他 H1 大。
- 先試過 blog 的 32／28／24px，但 Kyo 覺得與內文落差太大，最後採用上述較收斂的值；不要直接把 blog 的字級重新套回來。

### 首頁標語

- 中英文均為 **DevOps × AI × Python**；首頁 title 及由共用 layout 產出的 OG／Twitter title 同步。文案集中 `src/content/index.ts`；`src/components/Home.astro` 目前依 ` × ` 拆成三段，第一段固定套 `.devops`。未來改順序時，須同步調整標記與測試，避免漸層跑到別的字。
- 舊站 `assets/css/style.css` 的 DevOps 漸層為 `#ff512f → #dd2476`。新版最初是刻意改單色，並非遷移遺漏；Kyo 希望恢復炫一點的漸層，同意兼顧白底對比度。
- 最終漸層為 `#d83c18 → #d60069`，方向 90deg；端點白底對比約 4.59、5.17。第一次較深的版本被認為不夠鮮豔；此漸層是現行設計規範的明確例外，其他文字／按鈕不跟著加漸層。

### 關於頁與專案頁

- 頁內 H1 改為「個人專案」／「關於我」及 **Personal Projects**／**About Me**；導覽文字與 HTML title 刻意維持原樣。
- 關於頁英文區塊標題統一 title case：**Tech Stack**、**CV and Contact**、**More About Me**；標題與內文／連結文字的大小寫用途不同。
- 技術棧的 **Python Backend** 為 Kyo 接受的名稱；討論過 **Python & Backend**，最後保留前者。768px 以上用雙欄 grid，較窄維持單欄；三組依原資料順序排列。結構在 `src/components/About.astro`，樣式在 `src/styles/site.css`。
- 公職經歷改成與其他職涯一致的「職稱・機構＋一行工作描述」：書記官・法務部行政執行署宜蘭分署，處理行政執行案件、任職 5 年多；英文同步。neo-blog 的 `src/content/posts/orange-days-02.md` 確認任職機構、職稱和年資；「處理行政執行案件」是依機構及職稱概括，並非從文章確認的具體職責。Kyo 特別指出經歷皆為過去式，不必多加「曾」，敘述口氣應與其他職涯一致。
- 寫作成績的系列全名為《Django 忍法帖——Django Ninja 入門指南》，中英文皆連至 https://ithelp.ithome.com.tw/users/20167825/ironman/7451 並用安全外連屬性。名稱由 neo-blog `src/content/pages/django-ninja.md` 及其文章交叉確認；當時直接讀取 iThome 回應 403。`About.writing.items` 支援純字串或含文字與連結的物件，由 `About.astro` 渲染。

## 驗證與接續注意

- `scripts/check-dist.test.mjs` 已同步檢查字型打包、標題色與字級、導覽字級、頁面標題、系列連結、標語與安全外連等；`make ready` 會先 build 再執行測試。
- 可視需要在桌機及窄手機尺寸檢查：1.2rem 導覽列是否溢出、768px 前後技術棧雙欄是否舒適、標題與標語換行，以及漸層實際呈現。這些目前沒有完整瀏覽器驗證紀錄。
- 延伸文案時維持中英文同步；首頁簡介、標語、description 與 OG／Twitter 資訊的同步規則見 `AGENTS.md`。安全 header 只放 `public/_headers`。
- 不要修改或刪除 `CNAME`、根目錄舊站 `index.html` 和 `assets/`；它們保留作舊站退路。本次只讀取舊站 CSS 作參考。
- 先前脈絡另見 `docs/DONE-2026-11-03-profile-redesign.md`、`docs/DONE-2026-11-03-profile-layout-refinement.md`；若歷史紀錄與本文件或 `DESIGN.md` 不同，以後者及目前程式為準。
