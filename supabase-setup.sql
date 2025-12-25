-- TrailBlazer 資料庫設定 SQL
-- 在 Supabase SQL Editor 中執行此檔案

-- 建立 shoes 資料表
CREATE TABLE IF NOT EXISTS shoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100),  -- 新增：鞋款類別
  release_year INTEGER,  -- 新增：發行年份
  stack_height NUMERIC(5,2),
  drop NUMERIC(5,2),
  lug_depth NUMERIC(5,2),
  weight NUMERIC(6,2),
  cover_image_url TEXT,  -- 新增：封面圖片 URL
  youtube_video_url TEXT,  -- 新增：YouTube 影片連結
  image_url TEXT,  -- 保留向後相容
  video_url TEXT,  -- 保留向後相容
  pdf_url TEXT,
  slides TEXT[],  -- 投影片圖片 URL 陣列（推薦使用）
  short_desc TEXT,
  description TEXT,
  pros TEXT[],
  cons TEXT[],
  product_data JSONB,  -- 新增：完整產品資料 JSON 結構
  created_at TIMESTAMP DEFAULT NOW()
);

-- 建立 reviews 資料表
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shoe_id UUID REFERENCES shoes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name VARCHAR(255),
  user_photo TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 啟用 Row Level Security
ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策（如果存在）
DROP POLICY IF EXISTS "Anyone can read shoes" ON shoes;
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage shoes" ON shoes;

-- RLS 政策：所有人可讀 shoes
CREATE POLICY "Anyone can read shoes" ON shoes
  FOR SELECT USING (true);

-- RLS 政策：所有人可讀 reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- RLS 政策：已登入使用者可寫 reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS 政策：管理員可寫 shoes（目前設定為所有已登入使用者，可根據需求調整）
-- 若要限制為特定 Email，可使用：
-- CREATE POLICY "Admins can manage shoes" ON shoes
--   FOR ALL USING (
--     auth.role() = 'authenticated' AND
--     auth.jwt() ->> 'email' IN ('admin@example.com')
--   );
CREATE POLICY "Admins can manage shoes" ON shoes
  FOR ALL USING (auth.role() = 'authenticated');

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_reviews_shoe_id ON reviews(shoe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_shoes_brand ON shoes(brand);
CREATE INDEX IF NOT EXISTS idx_shoes_category ON shoes(category);
CREATE INDEX IF NOT EXISTS idx_shoes_release_year ON shoes(release_year);
CREATE INDEX IF NOT EXISTS idx_shoes_created_at ON shoes(created_at);
-- JSONB 索引（支援 JSON 查詢）
CREATE INDEX IF NOT EXISTS idx_shoes_product_data ON shoes USING GIN (product_data);

