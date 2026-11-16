# ◩ FramePilot Field Notes｜攝影筆記

一個以 `AGENTS.md` 定義開發規則、可以持續新增內容的繁體中文攝影學習網站。

## 專案特色

- 首頁：可搜尋文章、依分類篩選，卡片自動依文章資料產生。
- 共用文章頁：`article.html?slug=xxx` 自動顯示各篇文章、目錄與相關文章。
- 快門小工具：依 FPS 和快門角度估算曝光時間，僅作為學習參考。
- `AGENTS.md`：清楚記錄檔案架構、設計風格、文章 schema、AI 修改規則及驗收流程。
- 無 npm、無後端、不需要 API 金鑰，可直接使用 GitHub Pages 部署。

## 專案檔案

```text
AGENTS.md                 # AI 後續開發規範（作業核心）
index.html                # 首頁
article.html              # 統一文章模板
tools.html                # 影片快門小工具
about.html                # 專案介紹與擴充流程
assets/css/style.css      # 全站樣式
assets/js/articles.js     # 8 篇示範文章，新增內容編輯此檔案
assets/js/site.js         # 搜尋、分類、文章渲染與工具功能
assets/img/nightwalk.svg  # 自製向量封面插畫
scripts/validate.py       # 檢查文章欄位與相容性
```

## 本機預覽

只要有 Python 3：

```bash
python -m http.server 8000
```

然後到 `http://localhost:8000/` 開啟網站。

也可以直接開啟 `index.html` 觀察頁面，但透過本機 HTTP 服務更接近 GitHub Pages 環境。

## 如何新增一篇文章？

1. 閱讀 `AGENTS.md` 的「文章資料唯一來源」與「新增文章流程」。
2. 開啟 `assets/js/articles.js`，加入一個符合欄位規則的新文章物件，使用新的 `slug`。
3. 不必建立另一份文章 HTML；新卡片會自動出現在首頁，點入 `article.html?slug=...` 即可閱讀。
4. 執行 `python scripts/validate.py` 並在瀏覽器檢查搜尋、分類與文章內容。

完整示例見 [`docs/ADDING_ARTICLES.md`](docs/ADDING_ARTICLES.md)。

## GitHub Pages 發布

1. 到 GitHub 建立名為 `framepilot-fieldnotes` 的 **Public** Repository。
2. 上傳專案根目錄的**所有內容**，確保 `index.html` 與 `AGENTS.md` 都在 Repository 最上層，不要多包一層資料夾。
3. Repository → **Settings** → **Pages** → **Build and deployment**：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
   - Save
4. 在 Settings → Pages 確認網站實際 URL。網址通常是 `https://<你的帳號>.github.io/framepilot-fieldnotes/`，需以 GitHub 顯示為準。
5. 把 Repository、公開網站、`AGENTS.md` 連結貼到老師作業繳交區。

> 若透過 GitHub 網頁上傳 ZIP，請注意 GitHub 不會自動幫你解壓縮成各個檔案；需在電腦上先解壓縮，再上傳**解壓後的檔案與資料夾**。

## AI 協作與資料說明

本專案由 ChatGPT 協助規劃 `AGENTS.md`、文章資料結構、視覺介面與程式實作，使用者應審閱及理解後再提交作業。文章內容為攝影學習整理，包含一般技術概念與實作建議，不代表相機品牌官方說明。涉及特定型號時請以實際相機與官方文件為準。

## 後續可延伸功能

- 新增人像攝影、旅遊腳本、長曝光等分類文章。
- 擴充工具，例如拍攝清單或分鏡規劃器。
- 之後可把 RAG、Planning Agent 的成果整合為新功能頁；目前此專案沒有線上 AI API 功能。
