# profile

`kyomind.tw`：Kyo 的個人入口站，由首頁、專案頁、關於頁三頁組成：讓訪客快速知道他是誰、找到他的產出與帳號，並評估他的能力。

## 站台

**入口站**：
`kyomind.tw` 本身，Kyo 對外的品牌入口；獨立於部落格，不是部落格的 about 頁。
_Avoid_: landing page、個人網站、profile 頁

**產出**：
Kyo 自己經營、內容由他產生的站點；目前只有部落格。
_Avoid_: 作品、外部連結

**帳號**：
Kyo 在第三方平台的個人頁，例如 GitHub、LinkedIn、Threads、X。
_Avoid_: 社群連結、social links

**舊站**：
目前部署在 GitHub Pages、手寫 HTML 的入口站；切換後保留一段時間當作退路。
_Avoid_: 現行版、v1

**新站**：
用 Astro 重寫、部署在 Cloudflare Pages 的入口站。
_Avoid_: 改版站、v2

**預覽站**：
切換前的新站，只能從 `*.pages.dev` 網域存取。
_Avoid_: staging、測試站

**切換**：
把 `kyomind.tw` 的 DNS 從 GitHub Pages 改指向 Cloudflare Pages，由新站開始對外服務。
_Avoid_: 上線、cutover

## 內容

**首頁**：
入口站的門面，只呈現個人形象：名片區、產出、帳號；不放專案細節。
_Avoid_: landing、主頁

**專案頁**：
呈現 Kyo 公開專案的分頁：代表作放在最前面、寫最詳細，其他專案依序列在後面。
_Avoid_: 作品頁、portfolio 頁

**代表作**：
專案頁上最主要的完整案例（目前是 WeaMind），可涵蓋多個 repo，連到可驗證的原始碼或文章。
_Avoid_: 作品集、portfolio

**關於頁**：
讓人快速評估 Kyo 能力的專業簡介：經歷、技術棧、寫作成績、CV 與聯絡方式。完整的故事由部落格的 about 頁負責，這裡只連過去。
_Avoid_: 履歷頁、about me、自我介紹

**導覽**：
每一頁卡片上方那一列，連到首頁、專案頁、關於頁，並提供語言切換。
_Avoid_: menu、選單、nav bar
