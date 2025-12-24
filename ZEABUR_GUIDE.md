# Zeabur 部署指南

Zeabur 是一個台灣團隊開發的雲端部署平台，非常適合部署 TrailBlazer 專案。

## 為什麼選擇 Zeabur？

✅ **台灣團隊開發**：中文支援，溝通無障礙  
✅ **簡單易用**：直觀的介面，零配置  
✅ **自動 HTTPS**：自動提供 SSL 憑證  
✅ **免費方案**：適合個人專案和小型應用  
✅ **自動部署**：連接 GitHub 後自動部署  
✅ **多種框架支援**：自動偵測 Vite/React 專案  

## 快速開始

### 步驟 1：準備 GitHub 儲存庫

1. 將專案推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/trailblazer.git
   git push -u origin main
   ```

### 步驟 2：在 Zeabur 建立專案

1. **註冊/登入 Zeabur**
   - 前往 [zeabur.com](https://zeabur.com)
   - 使用 GitHub 帳號登入（推薦）

2. **建立新專案**
   - 點擊 "New Project"
   - 選擇 "Import Git Repository"
   - 選擇您的 GitHub 儲存庫

3. **Zeabur 會自動偵測**
   - 自動識別為 Vite 專案
   - 自動設定建置指令

### 步驟 3：設定環境變數

在專案設定中新增環境變數：

1. 點擊專案 > Settings > Environment Variables
2. 新增以下變數：

   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. 點擊 "Save"

### 步驟 4：部署

1. 點擊 "Deploy" 按鈕
2. 等待建置完成（約 2-5 分鐘）
3. 獲得自動生成的網址，例如：`trailblazer-xxx.zeabur.app`

## 詳細設定

### 建置配置

Zeabur 會自動偵測，但您也可以手動設定：

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`（預設）

### 路由設定

Zeabur 會自動處理 SPA 路由，但如果有問題，可以在 `zeabur.json` 中設定：

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 自訂網域

1. 在專案設定中點擊 "Domains"
2. 輸入您的網域（例如：`trailblazer.example.com`）
3. 按照指示設定 DNS 記錄
4. Zeabur 會自動提供 SSL 憑證

## 持續部署

連接 GitHub 後，Zeabur 會自動：

- ✅ 監聽 `main` 或 `master` 分支的推送
- ✅ 自動觸發建置和部署
- ✅ 顯示部署狀態和日誌

## 環境變數管理

### 在 Zeabur Dashboard 設定

1. 專案 > Settings > Environment Variables
2. 新增/編輯/刪除環境變數
3. 變更後需要重新部署

### 使用 Zeabur CLI

```bash
# 安裝 CLI
npm install -g @zeabur/cli

# 登入
zeabur login

# 查看專案
zeabur projects list

# 設定環境變數
zeabur env set VITE_SUPABASE_URL=your_url

# 部署
zeabur deploy
```

## 監控與日誌

### 查看部署日誌

1. 在專案中點擊 "Deployments"
2. 選擇特定的部署
3. 查看建置和運行日誌

### 效能監控

- Zeabur 提供基本的效能監控
- 可以查看請求數、回應時間等

## 疑難排解

### 問題 1：建置失敗

**可能原因**：
- 環境變數未設定
- Node.js 版本不相容
- 依賴安裝失敗

**解決方案**：
1. 檢查建置日誌
2. 確認環境變數已設定
3. 檢查 `package.json` 中的依賴

### 問題 2：路由 404 錯誤

**解決方案**：
- 確認 `zeabur.json` 中的路由設定正確
- 或聯繫 Zeabur 支援

### 問題 3：環境變數未生效

**解決方案**：
1. 確認變數名稱以 `VITE_` 開頭
2. 重新部署專案
3. 清除瀏覽器快取

## 費用說明

### 免費方案

- ✅ 免費部署
- ✅ 自動 HTTPS
- ✅ 基本監控
- ✅ 自動部署

### 付費方案

如需更多資源或功能，可升級到付費方案。

## 與其他平台比較

| 功能 | Zeabur | Vercel | Netlify |
|------|--------|--------|---------|
| 中文支援 | ✅ | ❌ | ❌ |
| 免費方案 | ✅ | ✅ | ✅ |
| 自動 HTTPS | ✅ | ✅ | ✅ |
| 自動部署 | ✅ | ✅ | ✅ |
| 台灣伺服器 | ✅ | ❌ | ❌ |

## 最佳實踐

1. **使用環境變數**：不要將敏感資訊寫在程式碼中
2. **版本控制**：確保所有變更都推送到 GitHub
3. **測試部署**：在部署前先在本地測試
4. **監控日誌**：定期檢查部署日誌
5. **備份資料**：定期備份 Supabase 資料

## 支援與資源

- **官方文件**：https://zeabur.com/docs
- **Discord 社群**：https://discord.gg/zeabur
- **GitHub**：https://github.com/zeabur

## 總結

Zeabur 是一個非常適合台灣開發者的部署平台，特別是對於 React/Vite 專案。設定簡單，部署快速，是 TrailBlazer 專案的絕佳選擇！

