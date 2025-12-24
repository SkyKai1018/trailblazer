import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useShoes } from '../hooks/useShoes'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ImageCarousel from '../components/ImageCarousel'
import VideoSection from '../components/VideoSection'
import PDFSlideViewer from '../components/PDFSlideViewer'
import PDFToImageConverter from '../components/PDFToImageConverter'
import SlideViewer from '../components/SlideViewer'
import SpecTable from '../components/SpecTable'
import ProsConsList from '../components/ProsConsList'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import { ArrowLeft } from 'lucide-react'

export default function ShoeDetail() {
  const { id } = useParams()
  const { getShoeById } = useShoes()
  const [shoe, setShoe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const data = await getShoeById(id)
        setShoe(data)
      } catch (error) {
        console.error('載入鞋款資料失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchShoe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">載入中...</p>
      </div>
    )
  }

  if (!shoe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-600 mb-4">找不到此鞋款</p>
        <Link
          to="/"
          className="text-emerald-600 hover:text-emerald-700 underline"
        >
          返回首頁
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          返回列表
        </Link>

        <div className="max-w-6xl mx-auto fade-in">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {shoe.brand} {shoe.name}
            </h1>
            {shoe.short_desc && (
              <p className="text-slate-600 mb-6">{shoe.short_desc}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ImageCarousel imageUrl={shoe.image_url} />
              <SpecTable shoe={shoe} />
            </div>

            <VideoSection videoUrl={shoe.video_url} title="鞋子介紹影片" />

            {/* 優先使用圖片投影片，如果沒有則自動將 PDF 轉換為圖片 */}
            {shoe.slides && shoe.slides.length > 0 ? (
              <div className="mt-6">
                <SlideViewer 
                  images={shoe.slides} 
                  title={`${shoe.brand} ${shoe.name} - 詳細說明`} 
                />
              </div>
            ) : shoe.pdf_url ? (
              <div className="mt-6">
                <PDFToImageConverter 
                  pdfUrl={shoe.pdf_url} 
                  title={`${shoe.brand} ${shoe.name} - 詳細說明`} 
                />
              </div>
            ) : null}

            <ProsConsList pros={shoe.pros || []} cons={shoe.cons || []} />

            {shoe.description && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">
                  詳細介紹
                </h2>
                <div className="text-slate-700 whitespace-pre-line">
                  {shoe.description}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              評論
            </h2>
            <ReviewForm shoeId={id} onReviewAdded={() => {
              // 觸發評論列表更新
              setReviewRefreshKey(prev => prev + 1)
              // 同時觸發事件（模擬模式使用）
              const event = new CustomEvent('reviewAdded')
              window.dispatchEvent(event)
            }} />
            <div className="mt-6">
              <ReviewList key={reviewRefreshKey} shoeId={id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

