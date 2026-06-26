# 夜半偷鹹魚

夜半偷鹹魚是一個可放入多本小說的手機閱讀與聽書 App。

## 功能

- 書籍詳情頁與作品簡介
- 70 章全文內建
- 章節目錄與章節搜尋
- 閱讀頁、上一章、下一章
- 聽書播放、暫停、停止
- 聽書語速調整
- 感情朗讀模式、聲音選擇與音高調整
- 對白、旁白、系統提示分段朗讀
- 聽書自動連播下一章
- 睡眠定時停止朗讀
- 紙本、護眼、夜間閱讀模式
- 字體大小調整
- 本機閱讀進度保存
- PWA 安裝與離線閱讀快取
- 多書庫資料結構

## 本機預覽

在 PowerShell 執行：

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

然後打開：

```text
http://localhost:5173/
```

## 部署

這是一個純靜態網站，可直接部署到 GitHub Pages。

## 新增書本

1. 將新書正文 JSON 放到 `data/`，格式可參考 `data/book.json`。
2. 將封面放到 `assets/`。
3. 在 `data/books.json` 的 `books` 陣列新增一筆，填入 `id`、`title`、`cover`、`dataUrl` 等欄位。
4. 發布到 GitHub Pages 後，App 會自動在「作品庫」顯示新書。
