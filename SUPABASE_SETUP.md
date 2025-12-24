# Supabase 設定指南

本指南詳細說明如何在 Supabase 中設定 TrailBlazer 專案所需的所有資料和配置。

## 步驟 1：建立 Supabase 專案

1. **前往 Supabase**
   - 訪問 [supabase.com](https://supabase.com)
   - 使用 GitHub 帳號登入（推薦）

2. **建立新專案**
   - 點擊 "New Project"
   - 填寫專案資訊：
     - **Name**: `trailblazer`（或您喜歡的名稱）
     - **Database Password**: 設定一個強密碼（請記住，之後會用到）
     - **Region**: 選擇離您最近的區域（建議選擇 `Southeast Asia (Singapore)`）
     - **Pricing Plan**: 選擇 Free（免費方案）

3. **等待專案建立**
   - 約需 2-3 分鐘
   - 建立完成後會收到通知

---

## 步驟 2：建立資料表

### 方法 A：使用 SQL Editor（推薦）

1. **開啟 SQL Editor**
   - 在左側選單點擊 "SQL Editor"
   - 點擊 "New query"

2. **執行 SQL 腳本**
   - 複製 `supabase-setup.sql` 的內容
   - 貼到 SQL Editor
   - 點擊 "Run" 或按 `Cmd/Ctrl + Enter`

3. **確認建立成功**
   - 應該會看到 "Success. No rows returned"
   - 檢查左側選單的 "Table Editor"，應該會看到 `shoes` 和 `reviews` 資料表

### 方法 B：手動建立（如果 SQL 執行失敗）

#### 建立 `shoes` 資料表

1. 點擊 "Table Editor" > "New table"
2. 設定：
   - **Name**: `shoes`
   - **Description**: `跑鞋資料表`

3. 新增欄位：

| 欄位名稱 | 類型 | 說明 | 必填 | 預設值 |
|---------|------|------|------|--------|
| `id` | uuid | 主鍵 | ✅ | `uuid_generate_v4()` |
| `name` | varchar(255) | 鞋款名稱 | ✅ | - |
| `brand` | varchar(100) | 品牌 | ✅ | - |
| `stack_height` | numeric(5,2) | 鞋底厚度 (mm) | ❌ | - |
| `drop` | numeric(5,2) | 足跟差 (mm) | ❌ | - |
| `lug_depth` | numeric(5,2) | 鞋齒深度 (mm) | ❌ | - |
| `weight` | numeric(6,2) | 重量 (g) | ❌ | - |
| `image_url` | text | 圖片 URL | ❌ | - |
| `video_url` | text | 影片 URL | ❌ | - |
| `pdf_url` | text | PDF 檔案 URL | ❌ | - |
| `slides` | text[] | 投影片圖片 URL 陣列 | ❌ | - |
| `short_desc` | text | 簡短描述 | ❌ | - |
| `description` | text | 詳細介紹 | ❌ | - |
| `pros` | text[] | 優點列表 | ❌ | - |
| `cons` | text[] | 缺點列表 | ❌ | - |
| `created_at` | timestamp | 建立時間 | ❌ | `now()` |

4. 設定主鍵：
   - 選擇 `id` 欄位
   - 勾選 "Is Primary Key"

#### 建立 `reviews` 資料表

1. 點擊 "Table Editor" > "New table"
2. 設定：
   - **Name**: `reviews`
   - **Description**: `評論資料表`

3. 新增欄位：

| 欄位名稱 | 類型 | 說明 | 必填 | 預設值 |
|---------|------|------|------|--------|
| `id` | uuid | 主鍵 | ✅ | `uuid_generate_v4()` |
| `shoe_id` | uuid | 鞋款 ID（外鍵） | ✅ | - |
| `user_id` | uuid | 使用者 ID（外鍵） | ❌ | - |
| `user_name` | varchar(255) | 使用者名稱 | ❌ | - |
| `user_photo` | text | 使用者頭像 URL | ❌ | - |
| `content` | text | 評論內容 | ✅ | - |
| `created_at` | timestamp | 建立時間 | ❌ | `now()` |

4. 設定外鍵：
   - 點擊 `shoe_id` 欄位
   - 在 "Foreign Key" 設定：
     - **Referenced Table**: `shoes`
     - **Referenced Column**: `id`
     - **On Delete**: `Cascade`

---

## 步驟 3：設定 Row Level Security (RLS)

### 啟用 RLS

1. **為 `shoes` 資料表啟用 RLS**
   - 在 Table Editor 中選擇 `shoes` 資料表
   - 點擊 "Enable RLS" 開關

2. **為 `reviews` 資料表啟用 RLS**
   - 在 Table Editor 中選擇 `reviews` 資料表
   - 點擊 "Enable RLS" 開關

### 建立 RLS 政策

#### 在 SQL Editor 中執行以下 SQL：

```sql
-- 刪除現有政策（如果存在）
DROP POLICY IF EXISTS "Anyone can read shoes" ON shoes;
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage shoes" ON shoes;

-- 政策 1: 所有人可讀取 shoes
CREATE POLICY "Anyone can read shoes" ON shoes
  FOR SELECT USING (true);

-- 政策 2: 所有人可讀取 reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- 政策 3: 已登入使用者可新增 reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 政策 4: 已登入使用者可管理 shoes（目前設定為所有登入使用者）
-- 若要限制為特定 Email，請使用以下版本：
-- CREATE POLICY "Admins can manage shoes" ON shoes
--   FOR ALL USING (
--     auth.role() = 'authenticated' AND
--     auth.jwt() ->> 'email' IN ('admin@example.com', 'another-admin@example.com')
--   );
CREATE POLICY "Admins can manage shoes" ON shoes
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 步驟 4：設定 Google OAuth

### 在 Google Cloud Console 設定

1. **建立 OAuth 憑證**
   - 前往 [Google Cloud Console](https://console.cloud.google.com)
   - 建立新專案或選擇現有專案
   - 前往 "APIs & Services" > "Credentials"
   - 點擊 "Create Credentials" > "OAuth client ID"
   - 選擇 "Web application"
   - 設定：
     - **Name**: `TrailBlazer`
     - **Authorized redirect URIs**: 
       ```
       https://your-project-ref.supabase.co/auth/v1/callback
       ```
       （在 Supabase 的 Authentication > URL Configuration 中可以找到）

2. **取得憑證**
   - 複製 **Client ID** 和 **Client Secret**

### 在 Supabase 中設定

1. **開啟 Authentication 設定**
   - 在 Supabase Dashboard 左側選單點擊 "Authentication"
   - 點擊 "Providers"

2. **啟用 Google Provider**
   - 找到 "Google"
   - 點擊開關啟用
   - 填入：
     - **Client ID (for OAuth)**: 從 Google Cloud Console 取得的 Client ID
     - **Client Secret (for OAuth)**: 從 Google Cloud Console 取得的 Client Secret
   - 點擊 "Save"

3. **設定 Redirect URL**
   - 在 "Authentication" > "URL Configuration"
   - 確認 **Site URL** 設定正確（部署後更新為實際網址）
   - **Redirect URLs** 應該包含：
     ```
     http://localhost:5173/**
     https://your-deployed-domain.com/**
     ```

---

## 步驟 4.5：設定 Supabase Storage（可選，但推薦）

如果您想要使用檔案上傳功能，需要設定 Supabase Storage。

**📖 詳細設定指南請參考 [SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md)**

快速步驟：

1. **建立 Storage Bucket**
   - 在 Supabase Dashboard > Storage
   - 點擊 "New bucket"
   - 名稱：`trailblazer-files`
   - 勾選 "Public bucket"
   - 點擊 "Create bucket"

2. **設定 Storage 政策**
   - 在 SQL Editor 執行 Storage RLS 政策（參考 `SUPABASE_STORAGE_SETUP.md`）

設定完成後，就可以在後台管理系統中直接上傳圖片和 PDF 檔案了！

---

## 步驟 5：取得 API 金鑰

1. **前往 API 設定**
   - 點擊左側選單的 "Settings"（齒輪圖示）
   - 點擊 "API"

2. **複製以下資訊**
   - **Project URL**: 
     ```
     https://your-project-ref.supabase.co
     ```
   - **anon public key**: 
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

3. **設定到專案中**
   - 在專案根目錄建立 `.env` 檔案：
     ```env
     VITE_SUPABASE_URL=https://your-project-ref.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

---

## 步驟 6：建立索引（效能優化）

在 SQL Editor 中執行：

```sql
-- 為 reviews 建立索引
CREATE INDEX IF NOT EXISTS idx_reviews_shoe_id ON reviews(shoe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- 為 shoes 建立索引
CREATE INDEX IF NOT EXISTS idx_shoes_brand ON shoes(brand);
CREATE INDEX IF NOT EXISTS idx_shoes_created_at ON shoes(created_at);
```

---

## 步驟 7：測試設定

### 測試資料表

1. **手動新增測試資料**
   - 在 Table Editor 中選擇 `shoes` 資料表
   - 點擊 "Insert row"
   - 填入測試資料：
     ```json
     {
       "name": "測試鞋款",
       "brand": "測試品牌",
       "stack_height": 30,
       "drop": 4,
       "lug_depth": 5,
       "weight": 300
     }
     ```
   - 點擊 "Save"

2. **檢查資料**
   - 確認資料已成功新增
   - 檢查所有欄位是否正確

### 測試認證

1. **在應用程式中測試登入**
   - 啟動開發伺服器：`npm run dev`
   - 點擊登入按鈕
   - 應該會跳轉到 Google 登入頁面
   - 登入後應該會回到應用程式

---

## 設定檢查清單

完成以下所有項目：

- [ ] Supabase 專案已建立
- [ ] `shoes` 資料表已建立
- [ ] `reviews` 資料表已建立
- [ ] 外鍵關係已設定（reviews.shoe_id → shoes.id）
- [ ] RLS 已啟用（兩個資料表）
- [ ] RLS 政策已建立（4 個政策）
- [ ] Google OAuth 已設定
- [ ] Redirect URLs 已設定
- [ ] API 金鑰已取得
- [ ] 環境變數已設定（.env 檔案）
- [ ] 索引已建立（效能優化）
- [ ] **Storage Bucket 已建立**（可選，但推薦）
- [ ] **Storage RLS 政策已設定**（可選，但推薦）
- [ ] 測試資料已新增
- [ ] 登入功能已測試

---

## 常見問題

### Q1: RLS 政策設定後無法讀取資料？

**A**: 檢查政策是否正確建立，確認 `USING (true)` 語法正確。

### Q2: Google OAuth 登入失敗？

**A**: 
- 檢查 Redirect URI 是否正確設定
- 確認 Google Cloud Console 中的 Redirect URI 與 Supabase 中的一致
- 檢查 Client ID 和 Secret 是否正確

### Q3: 無法新增鞋款資料？

**A**: 
- 確認已登入（auth.role() = 'authenticated'）
- 檢查 RLS 政策是否允許 INSERT
- 確認所有必填欄位都已填入

### Q4: 評論無法顯示？

**A**: 
- 檢查 `shoe_id` 是否正確
- 確認 RLS 政策允許 SELECT
- 檢查外鍵關係是否正確

---

## 安全性建議

1. **不要將 service_role key 放在前端**
   - 只使用 `anon` key
   - `service_role` key 具有完整權限，只能在後端使用

2. **限制管理員權限**
   - 修改 RLS 政策，只允許特定 Email 管理 shoes
   - 參考步驟 3 中的註解說明

3. **定期備份資料**
   - 在 Supabase Dashboard > Database > Backups 中設定自動備份

4. **監控使用量**
   - 在 Dashboard 中監控 API 使用量
   - 免費方案有使用限制

---

## 下一步

設定完成後，您可以：

1. **在本地測試**
   ```bash
   npm run dev
   ```

2. **部署到 Zeabur/Vercel**
   - 參考 `DEPLOYMENT_GUIDE.md`

3. **新增真實資料**
   - 使用後台管理系統新增鞋款
   - 或直接在 Supabase Table Editor 中新增

---

## 需要幫助？

- **Supabase 文件**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Supabase GitHub**: https://github.com/supabase/supabase

