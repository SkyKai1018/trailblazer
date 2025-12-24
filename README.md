# TrailBlazer 越野跑鞋圖鑑

一個專注於越野跑鞋的資訊平台，提供跑者詳細的鞋款數據、優缺點分析及實測影片整合。

## 技術棧

- **前端框架**: React 19 (Hooks, Functional Components)
- **路由**: React Router v7
- **樣式**: Tailwind CSS
- **後端服務**: Supabase
  - Authentication: Google 登入
  - Database: PostgreSQL (透過 Supabase)
  - Real-time: 即時評論更新
- **圖標**: Lucide React
- **PDF 檢視**: react-pdf, pdfjs-dist

## 功能特色

### 1. 跑鞋列表 (首頁)
- 卡片式設計展示鞋款
- 即時關鍵字搜尋
- 響應式佈局（桌面 4 欄、平板 3 欄、手機 1 欄）
- 管理員新增鞋款入口

### 2. 詳細資訊頁
- 圖片輪播展示
- **影片播放**：支援 YouTube 連結或本地 .mp4 檔案
- **PDF 投影片檢視器**：以投影片方式展示 PDF 詳細說明，支援左右滑動切換頁面
- 規格參數表
- 優缺點分析（綠色/紅色區塊）
- 詳細文案介紹

### 3. 評論系統
- Google 帳號登入
- 即時評論更新
- 顯示評論者頭像、暱稱、時間

### 4. 後台管理系統 (CMS)
- 權限管理（管理員模式）
- CRUD 功能（新增、讀取、更新、刪除）
- 標籤式優缺點管理
- **多媒體管理**：可上傳圖片、影片（YouTube 或本地檔案）、PDF 詳細說明檔案

## 安裝與設定

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 Supabase

**📖 詳細設定指南請參考 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

快速步驟：

1. 在 [Supabase](https://supabase.com) 建立新專案
2. 執行 `supabase-setup.sql` 建立資料表（在 SQL Editor 中執行）
3. 設定 Google OAuth（Authentication > Providers > Google）
4. 取得專案 URL 和 anon key（Settings > API）
5. 建立 `.env` 檔案：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 設定資料庫

在 Supabase SQL Editor 執行以下 SQL：

```sql
-- 建立 shoes 資料表
CREATE TABLE shoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  stack_height NUMERIC(5,2),
  drop NUMERIC(5,2),
  lug_depth NUMERIC(5,2),
  weight NUMERIC(6,2),
  image_url TEXT,
  short_desc TEXT,
  description TEXT,
  pros TEXT[],
  cons TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 建立 reviews 資料表
CREATE TABLE reviews (
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

-- RLS 政策：所有人可讀 shoes
CREATE POLICY "Anyone can read shoes" ON shoes
  FOR SELECT USING (true);

-- RLS 政策：所有人可讀 reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- RLS 政策：已登入使用者可寫 reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS 政策：管理員可寫 shoes（需根據實際需求調整）
CREATE POLICY "Admins can manage shoes" ON shoes
  FOR ALL USING (auth.role() = 'authenticated');
```

### 4. 設定 Google OAuth

1. 在 Supabase Dashboard > Authentication > Providers
2. 啟用 Google Provider
3. 設定 Google OAuth 憑證

### 5. 啟動開發伺服器

```bash
npm run dev
```

## 專案結構

```
trailblazer/
├── public/
├── src/
│   ├── components/          # 可重用元件
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── ShoeCard.jsx
│   │   ├── ImageCarousel.jsx
│   │   ├── VideoSection.jsx
│   │   ├── SpecTable.jsx
│   │   ├── ProsConsList.jsx
│   │   ├── ReviewForm.jsx
│   │   └── ReviewList.jsx
│   ├── pages/              # 頁面元件
│   │   ├── Home.jsx
│   │   ├── ShoeDetail.jsx
│   │   ├── Admin.jsx
│   │   └── AdminShoeForm.jsx
│   ├── services/           # API 服務層
│   │   └── supabase.js
│   ├── hooks/              # 自訂 Hooks
│   │   ├── useAuth.js
│   │   └── useShoes.js
│   ├── utils/              # 工具函數
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 設計規範

### 配色方案
- **主色調**: Slate-900（導航列）
- **強調色**: Emerald-600（按鈕、圖標、優點）
- **背景色**: Slate-50（整體背景）

### 互動效果
- 按鈕懸停 (Hover) 效果
- 卡片點擊轉場與陰影加深
- 載入與切換頁面時的淡入動畫

## 部署

詳細的部署指南請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### 快速部署

#### 方式 1：Zeabur（推薦，台灣平台）🇹🇼

1. 將專案推送到 GitHub
2. 前往 [zeabur.com](https://zeabur.com)
3. 點擊 "New Project" > "Import Git Repository"
4. 選擇您的 GitHub 專案
5. 設定環境變數：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. 點擊 "Deploy"
7. 完成！獲得自動生成的網址

#### 方式 2：Vercel

1. 將專案推送到 GitHub
2. 前往 [vercel.com](https://vercel.com)
3. 匯入專案
4. 設定環境變數
5. 點擊 Deploy

### 其他部署選項

- **Netlify**：使用 `netlify.toml` 配置
- **Cloudflare Pages**：支援 Vite 專案
- **Firebase Hosting**：使用 Firebase CLI
- **GitHub Pages**：使用 `gh-pages` 套件
- **自己的伺服器**：上傳 `dist` 資料夾內容

詳細說明請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 未來擴充建議

- [ ] 實體圖片上傳（整合 Supabase Storage）
- [ ] 進階篩選（按品牌、重量、落差篩選）
- [ ] 比較模式（並排數據比較）
- [ ] 更嚴格的權限控管（RLS 政策）
- [ ] PWA 支援（離線使用）
- [ ] 多語言支援

## 授權

© 2025 All Rights Reserved.
