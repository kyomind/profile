# profile

`kyomind.tw`：Kyo 的個人入口站，把人導向他的產出與帳號，並在專案頁附上代表作作為能力證據。

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
入口站的門面，只呈現個人形象：名片區、產出、帳號；不放代表作的細節。
_Avoid_: landing、主頁

**專案頁**：
入口站上專門呈現代表作細節的分頁，和首頁分開。
_Avoid_: 作品頁、portfolio 頁

**代表作**：
用來證明能力的一個完整案例，可涵蓋多個 repo，連到可驗證的原始碼或文章；只出現在專案頁。
_Avoid_: 作品集、portfolio、專案列表
