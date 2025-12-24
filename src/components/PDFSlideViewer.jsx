import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// 設定 PDF.js worker 和優化選項
if (typeof window !== 'undefined') {
  // 使用本地 worker 檔案（從 public 資料夾，版本應與 react-pdf 使用的 pdfjs-dist 匹配）
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
  
  // 優化 PDF.js 設定以加快載入速度
  pdfjs.GlobalWorkerOptions.workerPort = null // 使用預設 worker
}

export default function PDFSlideViewer({ pdfUrl, title = '詳細說明' }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    setPageNumber(1)
    setLoading(true)
    setError(null)
    setLoadProgress(0)
    
    // 設定超時處理（30 秒）
    const timeout = setTimeout(() => {
      if (loading) {
        setError('PDF 載入超時，請檢查檔案路徑或網路連線')
        setLoading(false)
      }
    }, 30000)

    return () => clearTimeout(timeout)
  }, [pdfUrl])

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF 載入成功，總頁數:', numPages)
    setNumPages(numPages)
    setLoading(false)
    setError(null)
    setLoadProgress(100)
  }

  const onDocumentLoadProgress = ({ loaded, total }) => {
    if (total > 0) {
      const progress = Math.round((loaded / total) * 100)
      setLoadProgress(progress)
    }
  }

  const onDocumentLoadError = (error) => {
    console.error('PDF 載入錯誤:', error)
    console.error('錯誤詳情:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    let errorMessage = '無法載入 PDF 檔案'
    if (error.message) {
      errorMessage += `: ${error.message}`
    }
    setError(errorMessage)
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') goToPrevPage()
    if (e.key === 'ArrowRight') goToNextPage()
    if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
  }

  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isFullscreen, numPages])

  if (!pdfUrl) {
    return null
  }

  const content = (
    <div className="relative bg-slate-100 rounded-lg overflow-hidden">
      {/* 控制列 */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900/80 text-white px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">{title}</h3>
          {numPages && (
            <span className="text-sm text-slate-300">
              {pageNumber} / {numPages}
            </span>
          )}
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

      {/* PDF 內容區域 */}
      <div className="flex items-center justify-center min-h-[600px] bg-slate-50 p-4 pt-16">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p>載入 PDF 中... {loadProgress > 0 && `${loadProgress}%`}</p>
            {loadProgress > 0 && (
              <div className="w-64 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            )}
            <p className="text-xs text-slate-400">檔案路徑: {pdfUrl}</p>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center max-w-md">
            <p className="mb-2 font-semibold">{error}</p>
            <p className="text-sm text-slate-600 mb-3">
              檔案路徑: {pdfUrl}
            </p>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                setPageNumber(1)
                setNumPages(null)
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              重新載入
            </button>
          </div>
        )}
        {!loading && !error && (
          <div className="flex items-center gap-4 w-full max-w-4xl">
            {/* 上一頁按鈕 */}
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="上一頁"
            >
              <ChevronLeft size={24} className="text-slate-700" />
            </button>

            {/* PDF 頁面 */}
            <div className="flex-1 flex justify-center bg-white rounded-lg shadow-lg p-4 overflow-auto">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                onLoadProgress={onDocumentLoadProgress}
                loading={<div className="text-slate-600">載入中...</div>}
                className="flex justify-center"
                options={{
                  // 優化載入速度的選項
                  cMapUrl: null, // 禁用字體映射以加快載入
                  cMapPacked: false,
                  standardFontDataUrl: null, // 禁用標準字體以加快載入
                  disableAutoFetch: false,
                  disableStream: false,
                  disableRange: false,
                  // 啟用快取以加快後續載入
                  verbosity: 0, // 減少日誌輸出
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false} // 禁用文字層以加快渲染（如果不需要文字選擇）
                  renderAnnotationLayer={false} // 禁用註解層以加快渲染（如果不需要互動註解）
                  className="shadow-lg"
                  width={typeof window !== 'undefined' ? Math.min(800, window.innerWidth - 200) : 800}
                  loading={<div className="text-slate-600">載入頁面中...</div>}
                />
              </Document>
            </div>

            {/* 下一頁按鈕 */}
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="下一頁"
            >
              <ChevronRight size={24} className="text-slate-700" />
            </button>
          </div>
        )}
      </div>

      {/* 頁碼指示器 */}
      {numPages && numPages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: Math.min(numPages, 10) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => setPageNumber(pageNum)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  pageNumber === pageNum
                    ? 'bg-emerald-600'
                    : 'bg-slate-400 hover:bg-slate-500'
                }`}
                aria-label={`第 ${pageNum} 頁`}
              />
            )
          })}
          {numPages > 10 && (
            <span className="text-xs text-slate-600 ml-2">
              ... {numPages} 頁
            </span>
          )}
        </div>
      )}

      {/* 觸控手勢提示 */}
      <div className="absolute bottom-2 left-4 text-xs text-slate-500 hidden md:block">
        使用 ← → 方向鍵或點擊左右按鈕切換頁面
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
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

