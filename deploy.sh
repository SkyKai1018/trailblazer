#!/bin/bash

# TrailBlazer 部署腳本

echo "🚀 TrailBlazer 部署腳本"
echo "===================="
echo ""

# 檢查環境變數
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "⚠️  警告：環境變數未設定"
  echo "請設定以下環境變數："
  echo "  - VITE_SUPABASE_URL"
  echo "  - VITE_SUPABASE_ANON_KEY"
  echo ""
  read -p "是否繼續建置？（環境變數可在部署平台設定）[y/N] " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 建置專案
echo "📦 建置專案..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ 建置失敗"
  exit 1
fi

echo "✅ 建置完成！"
echo ""

# 檢查 dist 資料夾
if [ ! -d "dist" ]; then
  echo "❌ dist 資料夾不存在"
  exit 1
fi

echo "📁 建置檔案位置: dist/"
echo ""

# 部署選項
echo "選擇部署方式："
echo "1) Vercel (推薦)"
echo "2) Netlify"
echo "3) 僅建置（手動部署）"
echo ""
read -p "請選擇 [1-3]: " choice

case $choice in
  1)
    echo ""
    echo "部署到 Vercel..."
    if command -v vercel &> /dev/null; then
      vercel --prod
    else
      echo "⚠️  Vercel CLI 未安裝"
      echo "請執行: npm i -g vercel"
      echo "或前往 https://vercel.com 使用網頁介面部署"
    fi
    ;;
  2)
    echo ""
    echo "部署到 Netlify..."
    if command -v netlify &> /dev/null; then
      netlify deploy --prod --dir=dist
    else
      echo "⚠️  Netlify CLI 未安裝"
      echo "請執行: npm i -g netlify-cli"
      echo "或前往 https://app.netlify.com 使用拖放方式部署"
    fi
    ;;
  3)
    echo ""
    echo "✅ 建置完成！"
    echo "📁 檔案位置: dist/"
    echo ""
    echo "您可以："
    echo "  - 將 dist/ 內容上傳到您的伺服器"
    echo "  - 使用 FTP/SCP 上傳"
    echo "  - 或使用其他部署平台"
    ;;
  *)
    echo "無效的選擇"
    exit 1
    ;;
esac

echo ""
echo "✨ 完成！"

