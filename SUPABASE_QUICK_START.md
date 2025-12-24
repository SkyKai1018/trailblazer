# Supabase 快速設定清單

## 必須設定的項目

### ✅ 1. 建立專案
- [ ] 在 supabase.com 建立新專案
- [ ] 記住專案密碼

### ✅ 2. 建立資料表
- [ ] 執行 `supabase-setup.sql`（在 SQL Editor 中）
- [ ] 確認 `shoes` 資料表已建立
- [ ] 確認 `reviews` 資料表已建立

### ✅ 3. 設定 Row Level Security (RLS)
- [ ] 啟用 `shoes` 資料表的 RLS
- [ ] 啟用 `reviews` 資料表的 RLS
- [ ] 建立 4 個 RLS 政策（包含在 `supabase-setup.sql` 中）

### ✅ 4. 設定 Google OAuth
- [ ] 在 Google Cloud Console 建立 OAuth 憑證
- [ ] 在 Supabase 中啟用 Google Provider
- [ ] 設定 Redirect URI

### ✅ 5. 取得 API 金鑰
- [ ] 複製 Project URL
- [ ] 複製 anon public key
- [ ] 設定到 `.env` 檔案

### ✅ 6. 測試
- [ ] 測試登入功能
- [ ] 測試新增鞋款（需登入）
- [ ] 測試發表評論（需登入）

## 詳細說明

完整設定步驟請參考：[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

