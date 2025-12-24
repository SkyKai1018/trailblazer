import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

export default function SlideViewer({ images, title = '詳細說明' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 如果沒有圖片或只有一個，返回 null
  if (!images || images.length === 0) {
    return null
  }

  const goToPrevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') goToPrevSlide()
    if (e.key === 'ArrowRight') goToNextSlide()
    if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
  }

  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isFullscreen, images.length])

  const content = (
    <div className="relative bg-slate-100 rounded-lg overflow-hidden">
      {/* 控制列 */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900/80 text-white px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-sm text-slate-300">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
            title="全螢幕"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* 投影片內容區域 */}
      <div className="flex items-center justify-center min-h-[600px] bg-slate-50 p-4 pt-16">
        <div className="flex items-center gap-4 w-full max-w-6xl">
          {/* 上一張按鈕 */}
          <button
            onClick={goToPrevSlide}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-colors z-10"
            aria-label="上一張"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>

          {/* 投影片圖片 */}
          <div className="flex-1 flex justify-center bg-white rounded-lg shadow-lg p-4 overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <img
                src={images[currentIndex]}
                alt={`投影片 ${currentIndex + 1}`}
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  console.error('圖片載入失敗:', images[currentIndex])
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="20"%3E圖片載入失敗%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          </div>

          {/* 下一張按鈕 */}
          <button
            onClick={goToNextSlide}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-colors z-10"
            aria-label="下一張"
          >
            <ChevronRight size={24} className="text-slate-700" />
          </button>
        </div>
      </div>

      {/* 頁碼指示器 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-emerald-600'
                  : 'bg-slate-400 hover:bg-slate-500'
              }`}
              aria-label={`投影片 ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 觸控手勢提示 */}
      <div className="absolute bottom-2 left-4 text-xs text-slate-500 hidden md:block">
        使用 ← → 方向鍵或點擊左右按鈕切換投影片
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors z-20"
          aria-label="關閉全螢幕"
        >
          <X size={24} />
        </button>
        <div className="w-full h-full max-w-7xl">{content}</div>
      </div>
    )
  }

  return content
}

