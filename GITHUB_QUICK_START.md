# GitHub 快速上傳指南

## 🚀 5 分鐘快速上傳

### 步驟 1：初始化（如果還沒做）

```bash
cd /Users/skykai/Desktop/dev/trailblazer
git init
```

### 步驟 2：添加所有檔案

```bash
git add .
```

### 步驟 3：第一次提交

```bash
git commit -m "Initial commit: TrailBlazer Trail Running Shoe Guide"
```

### 步驟 4：在 GitHub 建立倉庫

1. 前往 https://github.com/new
2. 輸入倉庫名稱：`trailblazer`（或您喜歡的名稱）
3. 選擇 **Public** 或 **Private**
4. **不要**勾選任何初始化選項
5. 點擊 **Create repository**

### 步驟 5：連接並推送

```bash
# 替換 YOUR_USERNAME 為您的 GitHub 使用者名稱
git remote add origin https://github.com/YOUR_USERNAME/trailblazer.git
git branch -M main
git push -u origin main
```

### 步驟 6：輸入認證資訊

- 如果使用 HTTPS，會要求輸入 GitHub 使用者名稱和密碼（或 Personal Access Token）
- 如果使用 SSH，需要先設定 SSH 金鑰（見下方）

## 🔑 使用 Personal Access Token（HTTPS）

如果 GitHub 要求密碼，您需要使用 Personal Access Token：

1. 前往 GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 點擊 **Generate new token (classic)**
3. 勾選 `repo` 權限
4. 複製生成的 token
5. 在推送時使用 token 作為密碼

## 🔐 使用 SSH（推薦，更安全）

### 快速設定 SSH

```bash
# 1. 生成 SSH 金鑰
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按 Enter 使用預設路徑
# 輸入密碼（可選）

# 2. 複製公鑰
pbcopy < ~/.ssh/id_ed25519.pub

# 3. 添加到 GitHub
# 前往 https://github.com/settings/keys
# 點擊 "New SSH key"，貼上並儲存

# 4. 測試連接
ssh -T git@github.com

# 5. 使用 SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/trailblazer.git
git push -u origin main
```

## ✅ 完成！

您的程式碼現在應該已經在 GitHub 上了！

查看您的倉庫：`https://github.com/YOUR_USERNAME/trailblazer`

## 📝 之後的更新

每次修改後：

```bash
git add .
git commit -m "描述您的變更"
git push
```

就是這麼簡單！🎉

