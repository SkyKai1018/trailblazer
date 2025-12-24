# TrailBlazer 部署指南

本指南說明如何將 TrailBlazer 專案部署到各種平台。

## 部署前準備

### 1. 設定 Supabase

1. 在 [Supabase](https://supabase.com) 建立專案
2. 執行 `supabase-setup.sql` 建立資料表
3. 設定 Google OAuth（Authentication > Providers > Google）
4. 取得專案 URL 和 anon key（Settings > API）

### 2. 準備環境變數

建立 `.env.production` 檔案：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 建置專案

```bash
npm run build
```

建置完成後，會在 `dist` 資料夾產生靜態檔案。

---

## 部署選項

### 選項 1：Vercel（推薦）⭐

**優點**：
- 免費方案充足
- 自動 HTTPS
- 全球 CDN
- 自動部署（連接 GitHub）
- 零配置

**步驟**：

1. **安裝 Vercel CLI**（可選）：
   ```bash
   npm i -g vercel
   ```

2. **部署方式 A：使用 CLI**
   ```bash
   cd trailblazer
   vercel
   ```
   按照提示輸入：
   - 是否要部署？Yes
   - 專案名稱：trailblazer
   - 目錄：`./`
   - 環境變數：輸入 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`

3. **部署方式 B：使用 GitHub（推薦）**
   - 將專案推送到 GitHub
   - 前往 [vercel.com](https://vercel.com)
   - 點擊 "New Project"
   - 匯入 GitHub 專案
   - 設定環境變數：
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - 點擊 "Deploy"

4. **設定建置指令**（Vercel 會自動偵測，但可手動設定）：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**自訂網域**：
- 在 Vercel 專案設定中可新增自訂網域
- 自動提供 SSL 憑證

---

### 選項 2：Netlify

**優點**：
- 免費方案
- 自動 HTTPS
- 持續部署
- 表單處理

**步驟**：

1. **安裝 Netlify CLI**（可選）：
   ```bash
   npm i -g netlify-cli
   ```

2. **部署方式 A：使用 CLI**
   ```bash
   cd trailblazer
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **部署方式 B：使用拖放**
   - 前往 [app.netlify.com](https://app.netlify.com)
   - 將 `dist` 資料夾拖放到頁面上
   - 設定環境變數（Site settings > Environment variables）

4. **部署方式 C：連接 GitHub**
   - 將專案推送到 GitHub
   - 在 Netlify 中新增網站
   - 連接 GitHub 儲存庫
   - 設定建置設定：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 設定環境變數

**Netlify 設定檔**（`netlify.toml`）：
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 選項 3：Cloudflare Pages

**優點**：
- 免費方案
- 全球 CDN
- 快速部署
- 無限頻寬

**步驟**：

1. **使用 Cloudflare Pages**
   - 前往 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 選擇 Pages > Create a project
   - 連接 GitHub 儲存庫
   - 設定建置：
     - Framework preset: Vite
     - Build command: `npm run build`
     - Build output directory: `dist`
   - 設定環境變數

2. **或使用 Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler pages deploy dist --project-name=trailblazer
   ```

---

### 選項 4：GitHub Pages

**優點**：
- 免費
- 簡單
- 與 GitHub 整合

**步驟**：

1. **安裝 gh-pages**：
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 `package.json`**：
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/trailblazer"
   }
   ```

3. **部署**：
   ```bash
   npm run deploy
   ```

4. **設定 GitHub Pages**：
   - 前往 GitHub 儲存庫設定
   - Pages > Source: `gh-pages` 分支
   - 設定環境變數（需要使用 GitHub Actions）

**注意**：GitHub Pages 不支援環境變數，需要：
- 使用 GitHub Actions 建置
- 或將環境變數編譯進程式碼（不推薦，安全性較低）

---

### 選項 5：Firebase Hosting

**優點**：
- Google 基礎設施
- 免費方案
- 與 Firebase 整合

**步驟**：

1. **安裝 Firebase CLI**：
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **初始化 Firebase**：
   ```bash
   cd trailblazer
   firebase init hosting
   ```
   選擇：
   - Public directory: `dist`
   - Single-page app: Yes
   - Overwrite index.html: No

3. **建立 `firebase.json`**：
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **部署**：
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

### 選項 6：Zeabur（台灣平台）🇹🇼

**優點**：
- 台灣團隊開發，中文支援
- 免費方案
- 自動 HTTPS
- 簡單易用
- 支援多種框架

**步驟**：

1. **使用 Zeabur Dashboard（推薦）**
   - 前往 [zeabur.com](https://zeabur.com)
   - 註冊/登入帳號
   - 點擊 "New Project"
   - 選擇 "Import Git Repository"
   - 連接 GitHub/GitLab 儲存庫
   - Zeabur 會自動偵測為 Vite 專案

2. **設定建置配置**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **設定環境變數**
   - 在專案設定中新增：
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **部署**
   - 點擊 "Deploy"
   - 等待建置完成
   - 獲得自動生成的網址

5. **自訂網域**（可選）
   - 在專案設定中可新增自訂網域
   - 自動提供 SSL 憑證

**Zeabur 設定檔**（`zeabur.json`，可選）：
```json
{
  "build": {
    "command": "npm run build",
    "outputDirectory": "dist"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**使用 Zeabur CLI**（可選）：
```bash
# 安裝 Zeabur CLI
npm install -g @zeabur/cli

# 登入
zeabur login

# 部署
zeabur deploy
```

---

### 選項 7：自己的伺服器（VPS/雲端主機）

**優點**：
- 完全控制
- 可自訂設定

**步驟**：

1. **建置專案**：
   ```bash
   npm run build
   ```

2. **上傳檔案**：
   - 將 `dist` 資料夾內容上傳到伺服器
   - 使用 FTP、SCP 或 rsync

3. **設定 Web 伺服器**：

   **Nginx 設定**（`/etc/nginx/sites-available/trailblazer`）：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/trailblazer/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 快取靜態資源
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

   **Apache 設定**（`.htaccess`）：
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 環境變數設定

所有平台都需要設定以下環境變數：

- `VITE_SUPABASE_URL`: Supabase 專案 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key

**注意**：`VITE_` 前綴的變數會在建置時嵌入到程式碼中，確保不要將敏感資訊（如 service role key）放在這些變數中。

---

## 持續部署（CI/CD）

### GitHub Actions 範例

建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 部署檢查清單

- [ ] Supabase 專案已建立並設定
- [ ] 資料表已建立（執行 `supabase-setup.sql`）
- [ ] Google OAuth 已設定
- [ ] 環境變數已設定
- [ ] 專案已建置成功（`npm run build`）
- [ ] 測試部署環境中的功能
- [ ] 檢查 HTTPS 是否正常
- [ ] 測試所有功能（登入、CRUD、評論等）

---

## 推薦部署方案

**最佳選擇**：
- **Zeabur**：台灣團隊開發，中文支援，簡單易用 🇹🇼（推薦給台灣用戶）
- **Vercel**：最適合 React/Vite 專案，零配置，自動 HTTPS 和 CDN

**次選**：
- **Netlify** 或 **Cloudflare Pages**：功能類似 Vercel
- **Firebase Hosting**：與 Google 服務整合

---

## 疑難排解

### 問題：路由 404 錯誤
**解決方案**：確保設定 SPA 路由重寫規則（所有路由指向 `index.html`）

### 問題：環境變數未生效
**解決方案**：
- 確認變數名稱以 `VITE_` 開頭
- 重新建置專案
- 檢查部署平台的環境變數設定

### 問題：Supabase 連線失敗
**解決方案**：
- 檢查 Supabase URL 和 key 是否正確
- 確認 Supabase 專案已啟用
- 檢查 CORS 設定

---

## 效能優化建議

1. **圖片優化**：
   - 使用 WebP 格式
   - 壓縮圖片大小
   - 使用 CDN 快取

2. **程式碼分割**：
   - Vite 已自動處理
   - 考慮使用動態 import

3. **快取策略**：
   - 設定適當的 Cache-Control headers
   - 使用 Service Worker（PWA）

---

## 監控與分析

建議加入：
- **Vercel Analytics**：效能監控
- **Google Analytics**：使用者分析
- **Sentry**：錯誤追蹤

