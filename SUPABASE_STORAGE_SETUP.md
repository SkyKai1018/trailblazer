# Supabase Storage 設定指南

本指南說明如何設定 Supabase Storage 來上傳和管理 PDF 和圖片檔案。

## 為什麼使用 Supabase Storage？

✅ **整合簡單**：與 Supabase 資料庫完美整合  
✅ **自動 CDN**：檔案自動透過 CDN 分發，載入速度快  
✅ **安全可靠**：內建權限管理  
✅ **免費方案**：免費方案提供 1GB 儲存空間  
✅ **自動備份**：檔案自動備份  

## 設定步驟

### 步驟 1：建立 Storage Bucket

1. **前往 Supabase Dashboard**
   - 登入 [Supabase Dashboard](https://app.supabase.com)
   - 選擇您的專案

2. **開啟 Storage**
   - 在左側選單點擊 "Storage"
   - 點擊 "New bucket"

3. **建立 Bucket**
   - **Name**: `trailblazer-files`
   - **Public bucket**: ✅ **勾選**（這樣才能取得公開 URL）
   - **File size limit**: `20 MB`（PDF 檔案限制）
   - **Allowed MIME types**: 留空（允許所有類型）或設定為 `image/*,application/pdf`
   - 點擊 "Create bucket"

### 步驟 2：設定 Storage 政策（RLS）

1. **開啟 SQL Editor**
   - 在左側選單點擊 "SQL Editor"
   - 點擊 "New query"

2. **執行以下 SQL**：

```sql
-- 允許所有人讀取公開檔案
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'trailblazer-files');

-- 允許已登入使用者上傳檔案
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'trailblazer-files' AND
    auth.role() = 'authenticated'
  );

-- 允許已登入使用者更新自己的檔案
CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'trailblazer-files' AND
    auth.role() = 'authenticated'
  );

-- 允許已登入使用者刪除自己的檔案
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'trailblazer-files' AND
    auth.role() = 'authenticated'
  );
```

3. **點擊 "Run" 執行**

### 步驟 3：測試上傳功能

1. **在應用程式中測試**
   - 登入管理員帳號
   - 前往後台管理系統
   - 嘗試上傳圖片或 PDF
   - 檢查是否成功取得 URL

2. **檢查 Storage**
   - 在 Supabase Dashboard > Storage > trailblazer-files
   - 應該會看到上傳的檔案

## 檔案結構

上傳的檔案會自動組織在以下結構中：

```
trailblazer-files/
├── images/
│   └── 1234567890-abc123.jpg
├── slides/
│   └── 1234567890-xyz789.png
└── pdfs/
    └── 1234567890-doc456.pdf
```

## 使用方式

### 在後台管理系統中

1. **上傳主圖片**
   - 點擊「上傳檔案」區域
   - 選擇圖片檔案
   - 上傳完成後，URL 會自動填入「圖片 URL」欄位

2. **上傳投影片圖片**
   - 點擊「上傳投影片圖片」
   - 選擇圖片檔案
   - 上傳完成後，會自動新增到投影片列表
   - 可以重複上傳多張圖片

3. **上傳 PDF**
   - 點擊「上傳檔案」區域
   - 選擇 PDF 檔案
   - 上傳完成後，URL 會自動填入「PDF URL」欄位

## 檔案大小限制

- **圖片**：建議不超過 5MB
- **PDF**：建議不超過 20MB
- **影片**：建議使用外部連結（YouTube 或 CDN）

## 取得公開 URL

上傳完成後，Supabase 會自動產生公開 URL，格式如下：

```
https://your-project-ref.supabase.co/storage/v1/object/public/trailblazer-files/images/1234567890-abc123.jpg
```

這個 URL 可以直接在瀏覽器中存取，無需認證。

## 權限說明

根據上面的 RLS 政策：

- ✅ **所有人**：可以讀取（下載）檔案
- ✅ **已登入使用者**：可以上傳、更新、刪除檔案
- ❌ **未登入使用者**：只能讀取，無法上傳

## 疑難排解

### 問題 1：上傳失敗，權限錯誤

**解決方案**：
- 確認已登入
- 檢查 Storage 政策是否正確設定
- 確認 bucket 是公開的

### 問題 2：無法取得公開 URL

**解決方案**：
- 確認 bucket 設定為 "Public bucket"
- 檢查檔案是否成功上傳

### 問題 3：檔案大小超過限制

**解決方案**：
- 調整 bucket 的 "File size limit" 設定
- 或壓縮檔案後再上傳

## 費用說明

### 免費方案
- **儲存空間**：1 GB
- **頻寬**：2 GB/月
- **檔案上傳**：無限制

### 付費方案
如需更多儲存空間或頻寬，可升級到付費方案。

## 最佳實踐

1. **圖片優化**：上傳前先壓縮圖片，減少檔案大小
2. **檔案命名**：系統會自動產生唯一檔名，避免衝突
3. **定期清理**：刪除不再使用的檔案，節省儲存空間
4. **備份重要檔案**：定期備份重要檔案

## 與 URL 輸入的比較

| 方式 | 優點 | 缺點 |
|------|------|------|
| **Supabase Storage** | 整合簡單、自動 CDN、安全 | 有儲存空間限制 |
| **URL 輸入** | 無儲存限制、可使用外部服務 | 需要自己管理檔案 |

**建議**：使用 Supabase Storage 上傳，簡單方便且整合度高！

