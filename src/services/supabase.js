import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 檢查是否已設定 Supabase
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(`
⚠️ Supabase 環境變數未設定，將使用模擬資料模式

應用程式仍可正常運作，但資料不會真正儲存。
若要使用真實資料庫功能，請：
1. 在 Supabase (https://supabase.com) 建立新專案
2. 前往 Project Settings > API
3. 複製 Project URL 和 anon public key
4. 在專案根目錄的 .env 檔案中填入：

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

5. 重新啟動開發伺服器 (npm run dev)
  `)
}

// 建立 Supabase 客戶端（即使未設定也建立，避免應用程式崩潰）
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

