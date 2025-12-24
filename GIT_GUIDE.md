# Git 使用指南 - 上傳到 GitHub

本指南將幫助您將 TrailBlazer 專案上傳到 GitHub。

## 📋 前置準備

### 1. 確認 Git 已安裝

```bash
git --version
```

如果未安裝，請參考：
- **macOS**: `brew install git`
- **Windows**: 下載 [Git for Windows](https://git-scm.com/download/win)
- **Linux**: `sudo apt-get install git` 或 `sudo yum install git`

### 2. 設定 Git 使用者資訊（首次使用）

```bash
git config --global user.name "您的名稱"
git config --global user.email "您的email@example.com"
```

## 🚀 快速開始

### 方法 1：從零開始（推薦）

#### 步驟 1：初始化 Git 倉庫

```bash
cd /Users/skykai/Desktop/dev/trailblazer
git init
```

#### 步驟 2：檢查檔案狀態

```bash
git status
```

#### 步驟 3：添加所有檔案到暫存區

```bash
# 添加所有檔案
git add .

# 或者只添加特定檔案
git add README.md src/ package.json
```

#### 步驟 4：提交變更

```bash
git commit -m "Initial commit: TrailBlazer Trail Running Shoe Guide"
```

#### 步驟 5：在 GitHub 建立新倉庫

1. 前往 [GitHub](https://github.com)
2. 點擊右上角的 **+** > **New repository**
3. 輸入倉庫名稱（例如：`trailblazer`）
4. 選擇 **Public** 或 **Private**
5. **不要**勾選 "Initialize this repository with a README"
6. 點擊 **Create repository**

#### 步驟 6：連接本地倉庫到 GitHub

```bash
# 替換 YOUR_USERNAME 和 YOUR_REPO_NAME 為您的實際值
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 例如：
# git remote add origin https://github.com/skykai/trailblazer.git
```

#### 步驟 7：推送程式碼到 GitHub

```bash
# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 方法 2：如果已經有 Git 倉庫

如果您的專案已經初始化了 Git，直接執行：

```bash
# 檢查遠端倉庫
git remote -v

# 如果沒有遠端倉庫，添加一個
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到 GitHub
git push -u origin main
```

## 📝 日常使用流程

### 提交變更

```bash
# 1. 查看變更狀態
git status

# 2. 添加變更的檔案
git add .                    # 添加所有變更
git add src/components/      # 添加特定目錄
git add README.md            # 添加特定檔案

# 3. 提交變更
git commit -m "描述您的變更"

# 4. 推送到 GitHub
git push
```

### 查看變更歷史

```bash
git log                      # 查看提交歷史
git log --oneline            # 簡潔版本
git log --graph --oneline    # 圖形化顯示
```

### 撤銷變更

```bash
# 撤銷工作區的變更（未 add）
git checkout -- <檔案名>

# 撤銷已 add 但未 commit 的變更
git reset HEAD <檔案名>

# 撤銷最後一次 commit（保留變更）
git reset --soft HEAD~1

# 撤銷最後一次 commit（不保留變更）
git reset --hard HEAD~1
```

## 🔐 使用 SSH 金鑰（推薦）

### 1. 檢查是否已有 SSH 金鑰

```bash
ls -al ~/.ssh
```

### 2. 生成新的 SSH 金鑰

```bash
ssh-keygen -t ed25519 -C "您的email@example.com"
# 按 Enter 使用預設路徑
# 輸入密碼（可選，但建議設定）
```

### 3. 複製公鑰

```bash
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Linux
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip
```

### 4. 添加到 GitHub

1. 前往 GitHub > Settings > SSH and GPG keys
2. 點擊 **New SSH key**
3. 貼上公鑰內容
4. 點擊 **Add SSH key**

### 5. 使用 SSH URL 連接

```bash
# 移除舊的 HTTPS 遠端
git remote remove origin

# 添加 SSH 遠端
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 測試連接
ssh -T git@github.com
```

## 📁 .gitignore 說明

專案已包含 `.gitignore` 檔案，會自動忽略以下內容：

- `node_modules/` - 依賴套件
- `.env` - 環境變數（包含敏感資訊）
- `dist/` - 建置輸出
- `*.log` - 日誌檔案
- `.DS_Store` - macOS 系統檔案

**⚠️ 重要：** 確保 `.env` 檔案不會被提交，因為它包含 Supabase 的 API 金鑰！

## 🔄 分支管理

### 建立新分支

```bash
# 建立並切換到新分支
git checkout -b feature/new-feature

# 或使用新語法
git switch -c feature/new-feature
```

### 切換分支

```bash
git checkout main
# 或
git switch main
```

### 合併分支

```bash
# 切換到主分支
git checkout main

# 合併功能分支
git merge feature/new-feature

# 刪除已合併的分支
git branch -d feature/new-feature
```

## 🐛 常見問題

### 問題 1：推送被拒絕

```bash
# 錯誤：Updates were rejected because the remote contains work...

# 解決方法：先拉取遠端變更
git pull origin main --rebase
git push
```

### 問題 2：忘記提交某些檔案

```bash
# 添加遺漏的檔案
git add <檔案名>
git commit --amend --no-edit  # 修改最後一次提交
git push --force              # 強制推送（謹慎使用）
```

### 問題 3：想要撤銷已推送的提交

```bash
# 建立新的提交來撤銷變更
git revert HEAD
git push
```

### 問題 4：衝突解決

```bash
# 當合併時出現衝突
git status                    # 查看衝突檔案
# 手動編輯衝突檔案，解決衝突標記
git add <解決衝突的檔案>
git commit
```

## 📚 有用的 Git 指令

```bash
# 查看變更差異
git diff                      # 工作區 vs 暫存區
git diff --staged             # 暫存區 vs 最後提交

# 查看特定檔案的變更歷史
git log -- <檔案名>

# 查看誰修改了哪一行
git blame <檔案名>

# 暫存當前變更（切換分支前）
git stash
git stash pop                # 恢復暫存的變更

# 查看遠端倉庫資訊
git remote -v
git remote show origin
```

## 🎯 最佳實踐

1. **經常提交**：小步提交，每次提交只包含相關的變更
2. **清晰的提交訊息**：
   ```
   git commit -m "feat: 新增 PDF 自動轉換為圖片功能"
   git commit -m "fix: 修正 PDF 載入速度問題"
   git commit -m "docs: 更新 README 說明"
   ```
3. **不要提交敏感資訊**：確保 `.env` 在 `.gitignore` 中
4. **推送前先測試**：確保程式碼可以正常運行
5. **使用分支**：新功能在分支中開發，完成後再合併

## 🔗 相關資源

- [Git 官方文件](https://git-scm.com/doc)
- [GitHub 文件](https://docs.github.com/)
- [Git 教學](https://git-scm.com/book/zh-tw/v2)
- [GitHub Desktop](https://desktop.github.com/) - 圖形化 Git 工具

## ✅ 檢查清單

上傳前確認：

- [ ] `.env` 檔案在 `.gitignore` 中
- [ ] `node_modules/` 不會被提交
- [ ] 所有變更都已提交
- [ ] 提交訊息清楚描述變更內容
- [ ] 程式碼可以正常運行
- [ ] README.md 已更新

---

**準備好了嗎？** 執行以下指令開始：

```bash
git add .
git commit -m "Initial commit: TrailBlazer Trail Running Shoe Guide"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

祝您使用愉快！🎉

