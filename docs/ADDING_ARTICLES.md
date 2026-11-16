# 新增一篇 FramePilot 攝影文章 — 實作教學

本文件是 `AGENTS.md` 的操作範例，不可取代完整規範。

## 為什麼只改 `articles.js`？

首頁 `index.html`、文章模板 `article.html` 都從 `window.FRAMEPILOT_ARTICLES` 讀資料。使用者新增文章不必自行排版 HTML，只要把資料依照既有 schema 加入陣列，網站就會自動新增卡片與可開啟的文章網址。

## 新增步驟

1. 打開 `assets/js/articles.js`，找到 `window.FRAMEPILOT_ARTICLES = [`。
2. 在陣列末尾最後一篇物件後加逗號，貼入新文章物件。新 `slug` 必須唯一。
3. 使用既有分類，例如 `夜景與街拍`；若需要新分類，要同步更新 `site.js`、`AGENTS.md` 和驗證腳本。
4. 每篇至少包含導言、兩個段落標題、操作內容和提醒。請把 `updated` 設成實際日期。
5. 執行 `python scripts/validate.py`，預覽首頁並透過 `article.html?slug=rainy-day-photo` 測試。
6. 提交更新並推送 GitHub Pages，確認已公開顯示。

## 可以交給 AI 的明確指令

> 請先閱讀專案根目錄的 AGENTS.md。依照既有風格，在 FramePilot Field Notes 新增一篇「如何拍攝煙火」的文章，放在最合適的分類。請只修改必要的文章資料檔，不要重做首頁或改主色。完成後執行驗證，回報新增 slug、修改檔案與測試結果。

AI 應該只在 `assets/js/articles.js` 加上一筆完整文章資料；如果它要修改既有分類或套件，應先說明原因。

## 測試時要看什麼？

- 首頁文章數會自動增加。
- 搜尋新標籤或文章標題會出現對應卡片。
- 點擊卡片開啟 `article.html?slug=<slug>`。
- 文章內容能顯示表格、提醒、步驟與側邊目錄。
- 手機畫面看起來仍一致。
