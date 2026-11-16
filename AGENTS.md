# AGENTS.md — FramePilot Field Notes 專案協作規則

> 這是給 AI 開發助手的專案規範。開始新增頁面、文章或修改程式之前，先閱讀本檔案；任務結束前完成驗收清單。

## 1. 專案目的與範圍

- **專案名稱：** FramePilot Field Notes（FramePilot 攝影筆記）。
- **目標：** 把攝影基礎、夜景、影片運鏡及拍攝企劃整理成易讀、可搜尋、持續擴充的繁體中文網站。
- **目標讀者：** 喜歡旅行攝影的初學者，以及想快速查閱拍攝技巧的人。
- **核心原則：** 一篇文章只維護一份內容資料；首頁索引與文章詳頁共用渲染邏輯。新增文章不能要求重新複製 HTML 模板。
- **本週課程焦點：** 以 `AGENTS.md` 定義可重複使用的規則；網站能透過 GitHub Pages 公開瀏覽。
- 這是**靜態網站**，不依賴後端、LLM API 或使用者帳號。不要誤稱網站目前有即時 AI 生成功能。

## 2. 技術與專案結構

只使用 HTML5、CSS3、原生 JavaScript；**不引入 React/Vue、CDN 依賴、建置工具或 API Key**。

```text
FramePilot_Fieldnotes/
├── AGENTS.md                # 最高優先的 AI 工作規範
├── README.md                # 使用、預覽及部署教學
├── index.html               # 首頁：搜尋、分類、文章卡片
├── article.html             # 通用文章頁：?slug=xxx
├── tools.html               # FPS／快門參考計算工具
├── about.html               # 專案說明與擴充流程
├── 404.html                 # 找不到頁面時的靜態頁
├── .nojekyll                # GitHub Pages 不經 Jekyll 處理
├── assets/
│   ├── css/style.css        # 全站樣式、設計變數、響應式版型
│   ├── img/nightwalk.svg    # 首頁插畫
│   └── js/
│       ├── articles.js      # 單一文章內容資料來源
│       └── site.js          # 首頁與文章的通用渲染、工具互動
├── scripts/validate.py     # 離線檢查欄位、slug、分類與連結
└── docs/ADDING_ARTICLES.md # 實際新增文章的範例與說明
```

**網站的公開入口固定為根目錄 `index.html`。** 所有內部導覽使用相對路徑，例如 `article.html?slug=night-street`，不要改成 `/article.html`，否則 GitHub Pages 專案子路徑可能出錯。

## 3. 視覺與文字規則

### 視覺

- 主要風格是深色電影感、安靜的編輯式閱讀介面，而不是五顏六色的儀表板。
- 設計變數集中於 `assets/css/style.css` 的 `:root`：深色背景 `--bg`、主文字 `--text`、薄荷綠強調 `--accent`、內容最大寬度 `--max`。
- 卡片圓角、留白、字級、邊框與 hover 效果沿用既有 class，不要針對每篇文章寫獨立 CSS。
- 全站使用系統字體堆疊，避免網路字型造成載入失敗。
- 寬螢幕最多三欄文章卡片，小螢幕縮為單欄。寬度 320px 仍需可閱讀，不得產生水平溢出。
- 不得使用不明版權照片。新增媒體應使用已取得授權的素材，放入 `assets/img/` 並加入替代文字。

### 內容

- 用**台灣繁體中文**，句子簡潔、步驟明確；讀者可能是新手。
- 文章從「為什麼」出發，再解釋「怎麼做」，最後補充限制或小練習。
- 原理與已知設備規格應分開。遇到未知相機功能不要編造按鈕名稱、選單路徑或確切數值。
- 攝影參數為參考起點，**不可宣稱每個場景都適用**；提醒 ISO、快門與曝光的取捨。
- 手動曝光與曝光補償不要混為一談；固定光圈相機不能被指示去改光圈。
- 設備相關內容優先引用官方手冊或可查證資料；若無法查證，描述一般原則並加上注意事項。
- 禁止直接複製網路文章長段落。若使用 AI 協助，README 或作業報告中要揭露參與方式。

## 4. 文章資料唯一來源：`assets/js/articles.js`

`articles.js` 只有一個公開資料變數：

```js
window.FRAMEPILOT_ARTICLES = [
  // 每篇文章是一個物件，新增文章請 append 到此陣列
];
```

**每篇文章都必須具備這些欄位：**

| 欄位 | 型別 | 具體規則 |
| --- | --- | --- |
| `slug` | string | 唯一、英文字母小寫／數字／連字號，例如 `long-exposure-guide`；不可重複 |
| `title` | string | 8～40 字為宜，直白說明主題 |
| `subtitle` | string | 一句話說明讀者會學到什麼 |
| `category` | string | 必須選用第 5 節列出的分類 |
| `minutes` | number | 正整數，預估閱讀分鐘數 |
| `summary` | string | 約 30～75 字，顯示於首頁卡片 |
| `tags` | string[] | 1～4 個具體的標籤 |
| `accent` | string | `aqua`、`violet`、`amber`、`mint`、`coral`、`blue`、`lavender`、`sunset` 其中一個 |
| `featured` | boolean | 是否為精選文章；保留欄位，未來可用來做首頁焦點區 |
| `updated` | string | `YYYY-MM-DD`，使用真實修改日期 |
| `blocks` | object[] | 文章內容，按閱讀順序排列 |

**支援的 `blocks` 種類，不可自行猜測不支援的 type。內容請採 JSON 相容寫法（雙引號、無尾逗號），才能通過驗證：**

```js
{ "type": "paragraph", "text": "一段說明文字。" }
{ "type": "section", "text": "段落小標題" }
{ "type": "bullets", "items": ["重點一", "重點二"] }
{ "type": "steps", "items": [{ "title": "步驟名稱", "text": "操作方式" }] }
{ "type": "callout", "tone": "tip", "title": "小提醒", "text": "文字" }
{ "type": "callout", "tone": "caution", "title": "注意", "text": "文字" }
{ "type": "table", "columns": ["欄一", "欄二"], "rows": [["A","B"]] }
```

每篇建議至少：1 段導入、2 個 `section`、3 個以上內容區塊與 1 個提醒／練習。表格列欄數須與 `columns.length` 相等。

## 5. 分類和導覽規則

允許的分類如下，拼字須完全一致：

- `攝影基礎`
- `夜景與街拍`
- `影片與運鏡`
- `設備與實作`
- `拍攝企劃`

首頁分類按鈕由 `assets/js/site.js` 的 `CATEGORY_ORDER` 控制。若新增**既有分類**文章，不需要改 `CATEGORY_ORDER`；若真的需要新增分類，必須同時更新 `CATEGORY_ORDER`、本檔案的分類清單，以及驗證腳本的清單。

文章詳頁網址遵循 `article.html?slug=<slug>`。不要為每篇文章複製建立一份 HTML；`site.js` 會根據 `slug` 自動載入對應內容。搜尋涵蓋文章標題、副標、摘要、分類及標籤。

## 6. AI 新增文章的標準流程

收到「新增一篇文章」需求時，AI **必須照此順序**：

1. 閱讀 `AGENTS.md` 和 `docs/ADDING_ARTICLES.md`，了解當前資料格式。
2. 查看 `assets/js/articles.js`，確認沒有重複文章、slug 或同義題目。
3. 決定 `category`、`slug` 與內容大綱；必要時確認設備資料來源。
4. **只在 `assets/js/articles.js` 新增一個符合 schema 的物件**。除非需求明確要求改設計或功能，不改 HTML 和 CSS。
5. 使用 `python scripts/validate.py` 驗證。檢查無重複 slug，所有必填欄位合法。
6. 開啟 `index.html` 檢查新卡片，檢查搜尋與分類，再點擊新文章連結。
7. 使用手機寬度確認內容不會超出畫面、表格可以捲動。
8. 將新增內容、檢查結果與修改檔案列表交付使用者。

### 新增文章的最小範例

```json
{
  "slug": "rainy-day-photo",
  "title": "雨天街拍的三個觀察重點",
  "subtitle": "從反射、色彩與安全距離開始。",
  "category": "夜景與街拍",
  "minutes": 4,
  "summary": "下雨不代表不能拍照，試著從水面反光、光線方向和走路安全來規劃鏡頭。",
  "tags": ["雨天", "街拍"],
  "accent": "blue",
  "featured": false,
  "updated": "2026-11-16",
  "blocks": [
    { "type": "paragraph", "text": "先觀察光，再按快門。" },
    { "type": "section", "text": "三個練習" },
    { "type": "bullets", "items": ["找反射", "看光向", "注意安全"] },
    { "type": "section", "text": "拍完後檢查" },
    { "type": "callout", "tone": "tip", "title": "小提醒", "text": "拍攝時不要阻礙行人。" }
  ]
}
```

> 這只是格式示例；沒有實際新增到網站，不應在作業報告中誤稱此篇已發布。

## 7. 新增「功能頁」的規則

只有要求新增**不同功能**（例如新計算工具、作品集）時才建立新的 `xxx.html`：

1. 小寫英文加 `-` 命名，例如 `depth-of-field.html`，放專案根目錄。
2. 複用現有 Header/Footer、`assets/css/style.css` 變數與 `.container` 等設計 class。
3. 新功能腳本優先放 `assets/js/site.js` 中清楚命名的初始化函數，或在功能明顯獨立時新增 `assets/js/<page>.js`。
4. 導覽至少加一個能從現有頁面抵達新頁的入口；不要讓頁面成為孤島。
5. 必須有語意標題、可操作的鍵盤控制、基本 aria 標籤和行動版檢查。
6. 不要以新增「內容文章」為理由任意新增另一份 `article-*.html` 模板。

## 8. 修改時的邊界與安全

- 不得更改既有文章 `slug`，因為會破壞舊連結；若不得不改，提供相容導覽。
- 不擅自移除文章、修改原本的設計色系或加入外部第三方追蹤碼。
- DOM 輸出優先使用 `textContent`，不要把文章資料直接丟進不安全的 `innerHTML`。
- 網站不得放任何 API Key、token、密碼、學號、私人資訊。
- `AGENTS.md` 是規範；與要求衝突時，先清楚告知再實作，不要默默改規則。
- 對外資料如有不確定性，先說明限制。不要虛構已部署的網址或已完成的測試。

## 9. 發布與測試標準（Definition of Done）

每次 AI 新增內容或修改功能後，完成下列檢查：

```bash
python scripts/validate.py
node --check assets/js/articles.js
node --check assets/js/site.js
python -m http.server 8000
# 瀏覽器開啟 http://localhost:8000
```

**驗收清單：**

- [ ] 首頁 `index.html` 正常顯示文章卡片。
- [ ] 分類按鈕及搜尋欄可正常篩選內容。
- [ ] `article.html?slug=<新文章>` 能開啟，文章內容與目錄可讀。
- [ ] 錯誤 slug 顯示可返回首頁的訊息。
- [ ] 行動版窄螢幕沒有溢出，表格可水平捲動。
- [ ] `tools.html` 快門計算器有正常更新且未將建議值宣稱為唯一答案。
- [ ] 沒有暴露敏感資訊，也沒有憑空編造來源與相機規格。
- [ ] GitHub Pages 路徑使用相對連結，頁面可從導覽抵達。

## 10. GitHub Pages 規則

採 GitHub Pages **Deploy from a branch**，來源是 `main` 的 `/(root)`。

- 根目錄要保留 `index.html` 與 `.nojekyll`。
- 推送版本後確認 Pages 連結可開啟；不要只依賴本機預覽。
- Repository 及網頁網址請以實際 GitHub 發布結果為準，**不可虛構使用者帳號或 URL**。
- 每次新增文章只需更新 `assets/js/articles.js` 並推送。首頁卡片、搜尋及詳頁由通用程式自動處理。
