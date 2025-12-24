# 簡報轉圖片指南

將 PDF 簡報轉換成圖片格式，可以獲得更好的載入速度和使用者體驗。

## 為什麼使用圖片而不是 PDF？

1. **載入速度更快**：圖片載入比 PDF 解析快得多
2. **相容性更好**：所有瀏覽器都支援圖片，無需 PDF.js
3. **體驗更流暢**：不需要等待 PDF 解析，直接顯示圖片
4. **檔案更小**：優化後的圖片通常比 PDF 小

## 轉換方法

### 方法 1：使用線上工具

1. **PDF24** (https://tools.pdf24.org/zh/pdf-to-jpg)
   - 上傳 PDF 檔案
   - 選擇「轉換為 JPG」
   - 下載所有頁面的圖片

2. **ILovePDF** (https://www.ilovepdf.com/zh-tw/pdf_to_jpg)
   - 上傳 PDF
   - 選擇轉換品質
   - 下載 ZIP 檔案

### 方法 2：使用命令列工具（Mac/Linux）

```bash
# 安裝 ImageMagick（如果尚未安裝）
brew install imagemagick

# 將 PDF 轉換為 PNG 圖片（每頁一張）
convert -density 300 input.pdf -quality 100 output-%02d.png

# 或使用 pdftoppm（如果已安裝 poppler）
pdftoppm -png -r 300 input.pdf output
```

### 方法 3：使用 Python 腳本

```python
from pdf2image import convert_from_path

# 將 PDF 轉換為圖片
images = convert_from_path('input.pdf', dpi=300)

# 儲存每頁為 PNG
for i, image in enumerate(images):
    image.save(f'slide_{i+1:02d}.png', 'PNG')
```

### 方法 4：使用 Adobe Acrobat

1. 開啟 PDF
2. 檔案 > 匯出至 > 影像 > PNG 或 JPEG
3. 選擇解析度（建議 300 DPI）
4. 匯出

## 圖片優化建議

### 1. 解析度
- **建議**：300 DPI（適合螢幕顯示）
- **最大**：不超過 1920x1080 像素（避免檔案過大）

### 2. 格式選擇
- **PNG**：適合有文字和圖表的簡報（無損壓縮）
- **JPG**：適合照片較多的簡報（檔案更小）
- **WebP**：現代瀏覽器支援，檔案最小（推薦）

### 3. 檔案大小
- 每張圖片建議不超過 500KB
- 使用圖片壓縮工具優化：
  - TinyPNG (https://tinypng.com/)
  - Squoosh (https://squoosh.app/)

## 檔案命名建議

使用有順序的檔名，方便管理：
```
slide-01.png
slide-02.png
slide-03.png
...
```

或
```
topo-mtn-racer-4-01.png
topo-mtn-racer-4-02.png
topo-mtn-racer-4-03.png
...
```

## 上傳到專案

1. 將所有圖片放在 `public/slides/` 資料夾
2. 在後台管理系統中，依順序新增每張圖片：
   ```
   /slides/topo-mtn-racer-4-01.png
   /slides/topo-mtn-racer-4-02.png
   /slides/topo-mtn-racer-4-03.png
   ...
   ```

## 範例

假設您有 15 張投影片：

1. 轉換 PDF 為 15 張 PNG 圖片
2. 優化圖片大小（使用 TinyPNG）
3. 將圖片放在 `public/slides/topo-mtn-racer-4/` 資料夾
4. 在後台依序新增：
   - `/slides/topo-mtn-racer-4/01.png`
   - `/slides/topo-mtn-racer-4/02.png`
   - `/slides/topo-mtn-racer-4/03.png`
   - ...（依此類推）

## 優點總結

✅ **載入速度快**：圖片直接顯示，無需解析  
✅ **相容性好**：所有瀏覽器都支援  
✅ **體驗流暢**：即時顯示，無等待時間  
✅ **檔案較小**：優化後通常比 PDF 小  
✅ **易於管理**：可以單獨更新某張投影片  

