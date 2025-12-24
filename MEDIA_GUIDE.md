# 多媒體檔案使用指南

本指南說明如何在 TrailBlazer 中新增和管理多媒體內容（影片、投影片圖片和 PDF）。

## 影片檔案

### 支援的格式
- **YouTube 連結**：完整的 YouTube 網址
- **本地影片檔案**：`.mp4`, `.webm`, `.mov` 等格式

### 使用方式

#### 1. YouTube 影片
在後台管理系統的「影片 URL」欄位中輸入：
```
https://www.youtube.com/watch?v=VIDEO_ID
```
或
```
https://youtu.be/VIDEO_ID
```

#### 2. 本地影片檔案
如果您的影片檔案放在 `public` 資料夾中：
```
/videos/shoe-intro.mp4
```

如果放在其他位置，使用完整路徑：
```
https://your-domain.com/videos/shoe-intro.mp4
```

### 範例
```
# YouTube
https://www.youtube.com/watch?v=dQw4w9WgXcQ

# 本地檔案（放在 public/videos/）
/videos/topo-mtn-racer-4-intro.mp4
```

## 投影片圖片（推薦）

### 為什麼使用圖片而不是 PDF？
- ✅ **載入速度快**：圖片直接顯示，無需解析
- ✅ **相容性好**：所有瀏覽器都支援
- ✅ **體驗流暢**：即時顯示，無等待時間
- ✅ **檔案較小**：優化後通常比 PDF 小

### 使用方式

#### 1. 準備圖片
將 PDF 簡報轉換為圖片（每頁一張）：
- 使用線上工具：PDF24、ILovePDF
- 使用命令列：ImageMagick、pdftoppm
- 詳細說明請參考 `SLIDE_CONVERSION_GUIDE.md`

#### 2. 上傳圖片
將圖片放在 `public/slides/` 資料夾：
```
public/slides/
  ├── topo-mtn-racer-4-01.png
  ├── topo-mtn-racer-4-02.png
  ├── topo-mtn-racer-4-03.png
  └── ...
```

#### 3. 在後台新增
在「投影片圖片」欄位中，依順序新增每張圖片 URL：
```
/slides/topo-mtn-racer-4-01.png
/slides/topo-mtn-racer-4-02.png
/slides/topo-mtn-racer-4-03.png
```

### 圖片格式建議
- **格式**：PNG（文字多）或 JPG（照片多）
- **解析度**：300 DPI
- **尺寸**：建議不超過 1920x1080 像素
- **檔案大小**：每張不超過 500KB

## PDF 詳細說明檔案（備用選項）

### 支援的格式
- PDF 檔案（`.pdf`）

### 使用方式

#### 1. 線上 PDF
在後台管理系統的「PDF 詳細說明檔案 URL」欄位中輸入完整 URL：
```
https://example.com/pdfs/shoe-detail.pdf
```

#### 2. 本地 PDF 檔案
如果您的 PDF 檔案放在 `public` 資料夾中：
```
/pdfs/topo-mountain-racer-4-deep-dive.pdf
```

### PDF 檢視器功能（不推薦，載入較慢）
- **左右滑動**：使用滑鼠點擊左右按鈕，或使用鍵盤方向鍵（← →）
- **全螢幕模式**：點擊右上角的全螢幕按鈕
- **頁碼顯示**：顯示當前頁碼和總頁數
- **頁碼指示器**：底部顯示頁碼點，可直接點擊跳轉

**注意**：建議使用投影片圖片代替 PDF，載入速度更快、體驗更好。

### 範例
```
# 線上 PDF
https://example.com/pdfs/topo-mountain-racer-4-deep-dive.pdf

# 本地檔案（放在 public/pdfs/）
/pdfs/topo-mountain-racer-4-deep-dive.pdf
```

## 檔案結構建議

建議的專案結構：
```
trailblazer/
├── public/
│   ├── videos/
│   │   └── shoe-intro.mp4
│   └── pdfs/
│       └── shoe-detail.pdf
├── src/
└── ...
```

## 注意事項

1. **檔案大小**：建議影片檔案不超過 50MB，PDF 檔案不超過 20MB，以確保良好的載入速度
2. **檔案格式**：確保影片和 PDF 檔案格式正確，瀏覽器才能正常播放/顯示
3. **CORS 設定**：如果使用外部 URL，確保伺服器允許跨域存取
4. **路徑設定**：本地檔案路徑應相對於 `public` 資料夾

## 資料庫欄位

在 Supabase 資料庫中，`shoes` 資料表包含以下欄位：
- `video_url` (TEXT)：影片 URL
- `slides` (TEXT[])：投影片圖片 URL 陣列（推薦）
- `pdf_url` (TEXT)：PDF 檔案 URL（備用選項）

這些欄位都是可選的，如果未設定，對應的功能區塊將不會顯示。

**優先順序**：如果同時設定了 `slides` 和 `pdf_url`，系統會優先顯示投影片圖片。

