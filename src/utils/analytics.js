// Google Analytics 4 設定
// 使用環境變數 VITE_GA_MEASUREMENT_ID 來設定你的 GA4 Measurement ID
// 如果未設定環境變數，可以使用預設值 G-E3XG71V144

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-E3XG71V144'

// 初始化 Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID 未設定')
    return
  }

  // 載入 gtag.js
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // 初始化 gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

// 追蹤頁面瀏覽
export const trackPageView = (path) => {
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    })
  }
}

// 追蹤事件
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, eventParams)
  }
}

// 追蹤鞋款查看
export const trackShoeView = (shoeId, shoeName, brand) => {
  trackEvent('view_item', {
    item_id: shoeId,
    item_name: shoeName,
    item_brand: brand,
    item_category: 'Trail Running Shoes',
  })
}

// 追蹤搜尋
export const trackSearch = (searchQuery) => {
  trackEvent('search', {
    search_term: searchQuery,
  })
}

// 追蹤評論提交
export const trackReviewSubmit = (shoeId) => {
  trackEvent('submit_review', {
    item_id: shoeId,
  })
}

