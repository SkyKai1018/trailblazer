# Google Analytics 4 (GA4) 設定指南

本指南將幫助你設定 Google Analytics 來追蹤網站 https://trailblazer.zeabur.app/ 的觀看人數和使用者行為。

## 📊 可以追蹤的資料

- **觀看人數**：每日、每週、每月的訪客數
- **頁面瀏覽量**：哪些頁面最受歡迎
- **使用者行為**：使用者從哪裡來、停留時間、跳出率
- **鞋款查看**：哪些鞋款被查看最多
- **搜尋行為**：使用者搜尋什麼關鍵字
- **評論提交**：評論提交次數

## 🚀 設定步驟

### 1. 建立 Google Analytics 帳戶

1. 前往 [Google Analytics](https://analytics.google.com/)
2. 點擊「開始測量」或「建立帳戶」
3. 輸入帳戶名稱（例如：TrailBlazer）
4. 設定資料共用選項（可選）

### 2. 建立屬性（Property）

1. 點擊「建立屬性」
2. 選擇「網站」
3. 輸入屬性名稱：`TrailBlazer Website`
4. 選擇時區：`(GMT+08:00) 台北`
5. 選擇貨幣：`新台幣 (TWD)`

### 3. 建立資料串流（Data Stream）

1. 選擇「網站」
2. 輸入網站 URL：`https://trailblazer.zeabur.app`
3. 輸入串流名稱：`TrailBlazer Production`
4. 點擊「建立串流」

### 4. 取得 Measurement ID

1. 在資料串流頁面，你會看到「測量 ID」
2. 格式類似：`G-XXXXXXXXXX`
3. **複製這個 ID**

**你的 Measurement ID**: `G-E3XG71V144`

### 5. 設定環境變數（可選）

你的 Measurement ID 已經預設在程式碼中（`G-E3XG71V144`），所以**不需要**設定環境變數也能運作。

如果你想使用不同的 ID 或透過環境變數管理，可以在 Zeabur 專案中添加：

1. 前往 Zeabur Dashboard
2. 選擇你的專案
3. 進入「Environment Variables」或「環境變數」
4. 添加新的環境變數：
   - **Key**: `VITE_GA_MEASUREMENT_ID`
   - **Value**: 你的 Measurement ID（例如：`G-E3XG71V144`）

**注意**：如果設定了環境變數，它會覆蓋預設值。

### 6. 重新部署（如果需要）

如果修改了環境變數，Zeabur 會自動重新部署你的應用程式。

## 📈 查看分析資料

### 即時資料

1. 前往 Google Analytics
2. 左側選單選擇「報表」>「即時」
3. 可以看到目前正在瀏覽網站的使用者

### 常用報表

- **總覽**：整體流量趨勢
- **使用者**：新訪客 vs 回訪者
- **流量取得**：使用者從哪裡來（Google、直接輸入、社群媒體等）
- **參與度**：頁面瀏覽、平均停留時間
- **事件**：自訂事件（鞋款查看、搜尋、評論提交）

## 🔍 查看特定事件

### 鞋款查看事件

在「事件」報表中，可以查看：
- `view_item`：哪些鞋款被查看最多
- 包含鞋款 ID、名稱、品牌等資訊

### 搜尋事件

- `search`：使用者搜尋的關鍵字
- 可以了解使用者最常搜尋什麼

### 評論事件

- `submit_review`：評論提交次數
- 可以追蹤使用者參與度

## 🎯 進階設定（可選）

### 設定轉換事件

如果某些行為對你很重要（例如：評論提交），可以設為轉換事件：

1. 前往「管理」>「事件」
2. 找到 `submit_review` 事件
3. 切換「標記為轉換」

### 設定目標對象

可以根據使用者行為建立目標對象，例如：
- 經常查看鞋款的使用者
- 提交過評論的使用者

## 📱 行動應用程式

Google Analytics 也提供行動應用程式，可以隨時查看資料：
- [iOS App](https://apps.apple.com/app/google-analytics/id881599038)
- [Android App](https://play.google.com/store/apps/details?id=com.google.android.apps.giant)

## 🔒 隱私權設定

根據 GDPR 和其他隱私法規，你可能需要：

1. 在網站上添加 Cookie 同意通知
2. 在隱私權政策中說明使用 Google Analytics
3. 考慮使用 Google Analytics 的同意模式（Consent Mode）

## 🆘 疑難排解

### 看不到資料？

1. **檢查環境變數**：確認 `VITE_GA_MEASUREMENT_ID` 已正確設定
2. **等待時間**：GA4 可能需要幾分鐘到幾小時才會顯示資料
3. **檢查即時報表**：先查看即時報表確認追蹤是否正常運作
4. **檢查瀏覽器控制台**：確認沒有 JavaScript 錯誤

### 測試追蹤

1. 開啟瀏覽器開發者工具（F12）
2. 前往「Network」標籤
3. 篩選 `google-analytics` 或 `gtag`
4. 瀏覽網站，應該會看到對 Google Analytics 的請求

## 📚 相關資源

- [Google Analytics 官方文件](https://support.google.com/analytics)
- [GA4 教學](https://support.google.com/analytics/answer/10089681)
- [事件追蹤指南](https://support.google.com/analytics/answer/9267735)

---

設定完成後，你就可以在 Google Analytics 中查看網站的完整分析資料了！

