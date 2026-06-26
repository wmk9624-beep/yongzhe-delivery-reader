# 勇者書架

《勇者派送中》的手機小說閱讀 App 原型。

## 功能

- 書籍詳情頁與作品簡介
- 70 章全文內建
- 章節目錄與章節搜尋
- 閱讀頁、上一章、下一章
- 聽書播放、暫停、停止
- 聽書語速調整
- 聽書自動連播下一章
- 睡眠定時停止朗讀
- 紙本、護眼、夜間閱讀模式
- 字體大小調整
- 本機閱讀進度保存
- PWA 安裝與離線閱讀快取

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
