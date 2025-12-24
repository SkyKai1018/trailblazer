import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import SlideViewer from './SlideViewer'
import { Loader2 } from 'lucide-react'

// 設定 PDF.js worker
if (typeof window !== 'undefined') {
  // 使用本地 worker 檔案（從 public 資料夾，版本應與 react-pdf 使用的 pdfjs-dist 匹配）
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

/**
 * 將 PDF 自動轉換為圖片並使用 SlideViewer 顯示
 * 這樣可以獲得更好的載入速度和體驗
 */
export default function PDFToImageConverter({ pdfUrl, title = '詳細說明' }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!pdfUrl) {
      setImages([])
      setLoading(false)
      return
    }

    const convertPDFToImages = async () => {
      setLoading(true)
      setError(null)
      setProgress(0)
      setImages([])

      try {
        // 載入 PDF 文件
        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          cMapUrl: null,
          cMapPacked: false,
          standardFontDataUrl: null,
        })

        const pdf = await loadingTask.promise
        const numPages = pdf.numPages
        const imagePromises = []

        console.log(`開始轉換 PDF，共 ${numPages} 頁`)

        // 將每一頁轉換為圖片
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          
          // 設定渲染選項
          const viewport = page.getViewport({ scale: 2.0 }) // 2x 解析度以獲得清晰圖片
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          
          canvas.height = viewport.height
          canvas.width = viewport.width

          // 渲染頁面到 canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }

          await page.render(renderContext).promise

          // 將 canvas 轉換為圖片 URL
          const imageUrl = canvas.toDataURL('image/png')
          imagePromises.push(imageUrl)

          // 更新進度
          const currentProgress = Math.round((pageNum / numPages) * 100)
          setProgress(currentProgress)
          console.log(`已轉換第 ${pageNum}/${numPages} 頁`)
        }

        setImages(imagePromises)
        setLoading(false)
        setProgress(100)
        console.log('PDF 轉換完成，共', imagePromises.length, '張圖片')
      } catch (err) {
        console.error('PDF 轉換錯誤:', err)
        setError(err.message || 'PDF 轉換失敗')
        setLoading(false)
      }
    }

    convertPDFToImages()
  }, [pdfUrl])

  if (!pdfUrl) {
    return null
  }

  if (loading) {
    return (
      <div className="relative bg-slate-100 rounded-lg overflow-hidden min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <div className="text-center">
            <p className="font-medium mb-2">正在轉換 PDF 為圖片...</p>
            <p className="text-sm text-slate-500">{progress}%</p>
            {progress > 0 && (
              <div className="w-64 bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative bg-slate-100 rounded-lg overflow-hidden min-h-[600px] flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md">
          <p className="font-semibold mb-2">轉換失敗</p>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              setProgress(0)
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            重試
          </button>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return null
  }

  // 使用 SlideViewer 顯示轉換後的圖片
  return <SlideViewer images={images} title={title} />
}

