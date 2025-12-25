import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useShoes } from '../hooks/useShoes'
import { trackShoeView } from '../utils/analytics'
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
import PerformanceAnalysis from '../components/PerformanceAnalysis'
import FitAndSizing from '../components/FitAndSizing'
import CommunitySentiment from '../components/CommunitySentiment'
import CompetitorComparison from '../components/CompetitorComparison'
import BuyingGuide from '../components/BuyingGuide'
import StructuredData from '../components/StructuredData'
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
        
        // 追蹤鞋款查看
        if (data) {
          const brand = data.brand || ''
          const name = data.name || ''
          trackShoeView(id, name, brand)
        }
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

  // 解析 product_data JSON（處理雙重編碼）
  let productData = {}
  try {
    if (shoe.product_data) {
      if (typeof shoe.product_data === 'string') {
        const trimmed = shoe.product_data.trim()
        if (trimmed && trimmed !== 'null' && trimmed !== '""') {
          let parsed = JSON.parse(trimmed)
          // 如果解析後還是字串，可能是雙重編碼，再解析一次
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed)
            } catch (e2) {
              // 如果第二次解析失敗，使用第一次解析的結果
            }
          }
          productData = parsed && typeof parsed === 'object' ? parsed : {}
        }
      } else if (typeof shoe.product_data === 'object') {
        productData = shoe.product_data
      }
    }
  } catch (e) {
    console.error('解析 product_data 失敗:', e)
    productData = {}
  }
  
  // 確保 productData 永遠是物件，不是 null
  if (!productData || typeof productData !== 'object') {
    productData = {}
  }

  // 取得圖片和影片 URL（優先使用直接欄位，如果 product_data 中的 URL 無效則回退）
  const getImageUrl = () => {
    // 優先順序：直接欄位 > product_data > 舊欄位
    if (shoe.cover_image_url) return shoe.cover_image_url
    if (shoe.image_url) return shoe.image_url
    const pdImage = productData.product_identity?.cover_image_url
    // 檢查 product_data 中的 URL 是否有效（不是 example.com）
    if (pdImage && !pdImage.includes('example.com')) return pdImage
    return null
  }

  const getVideoUrl = () => {
    // 優先順序：直接欄位 > product_data > 舊欄位
    if (shoe.youtube_video_url) return shoe.youtube_video_url
    if (shoe.video_url) return shoe.video_url
    const pdVideo = productData.product_identity?.youtube_video_url
    // 檢查 product_data 中的 URL 是否有效（不是 example）
    if (pdVideo && !pdVideo.includes('watch?v=example')) return pdVideo
    return null
  }

  const coverImageUrl = getImageUrl()
  const youtubeVideoUrl = getVideoUrl()

  // 取得 SEO 資料
  const brand = productData.product_identity?.brand || shoe.brand
  const modelName = productData.product_identity?.model_name || shoe.name
  const summary = productData.marketing_copy?.one_sentence_summary || shoe.short_desc || `${brand} ${modelName} 詳細評測`
  const keywords = `${brand}, ${modelName}, 越野跑鞋, 跑鞋推薦, 跑鞋評測, ${brand} ${modelName} 購買, 越野跑鞋推薦`

  return (
    <>
      <Helmet>
        <title>{`${brand} ${modelName} 評測 | 越野跑鞋圖鑑`}</title>
        <meta name="description" content={summary} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={`${brand} ${modelName} 評測`} />
        <meta property="og:description" content={summary} />
        <meta property="og:image" content={coverImageUrl || shoe.image_url || ''} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/shoe/${shoe.id}` : ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${brand} ${modelName} 評測`} />
        <meta name="twitter:description" content={summary} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/shoe/${shoe.id}` : ''} />
      </Helmet>
      <StructuredData shoe={shoe} productData={productData} />
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
          {/* 主要資訊區塊 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* 標題和行銷文案 */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {productData.product_identity?.brand || shoe.brand} {productData.product_identity?.model_name || shoe.name}
              </h1>
              {productData.product_identity?.nickname && (
                <p className="text-emerald-600 font-medium mb-2">
                  {productData.product_identity.nickname}
                </p>
              )}
              {productData.marketing_copy?.slogan && (
                <p className="text-xl text-slate-700 font-medium mb-3 italic">
                  "{productData.marketing_copy.slogan}"
                </p>
              )}
              {productData.marketing_copy?.one_sentence_summary && (
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {productData.marketing_copy.one_sentence_summary}
                </p>
              )}
              {shoe.short_desc && !productData.marketing_copy?.one_sentence_summary && (
                <p className="text-slate-600 mb-6">{shoe.short_desc}</p>
              )}
            </div>

            {/* 封面圖片和規格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ImageCarousel imageUrl={coverImageUrl} />
              <SpecTable shoe={shoe} />
            </div>

            {/* 詳細介紹 */}
            {productData.marketing_copy?.detailed_introduction && (
              <div className="mb-6 bg-slate-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">
                  詳細介紹
                </h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {productData.marketing_copy.detailed_introduction}
                </div>
              </div>
            )}

            {/* YouTube 影片 */}
            {youtubeVideoUrl && (
              <VideoSection videoUrl={youtubeVideoUrl} title="產品介紹影片" />
            )}

            {/* 投影片或 PDF */}
            {shoe.slides && shoe.slides.length > 0 ? (
              <div className="mt-6">
                <SlideViewer 
                  images={shoe.slides} 
                  title={`${productData.product_identity?.brand || shoe.brand} ${productData.product_identity?.model_name || shoe.name} - 詳細說明`} 
                />
              </div>
            ) : shoe.pdf_url ? (
              <div className="mt-6">
                <PDFToImageConverter 
                  pdfUrl={shoe.pdf_url} 
                  title={`${productData.product_identity?.brand || shoe.brand} ${productData.product_identity?.model_name || shoe.name} - 詳細說明`} 
                />
              </div>
            ) : null}

            {/* 舊版 description（向後相容） */}
            {shoe.description && !productData.marketing_copy?.detailed_introduction && (
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

          {/* 性能分析 */}
          {productData.performance_analysis && (
            <PerformanceAnalysis performanceData={productData.performance_analysis} />
          )}

          {/* 優缺點 */}
          <ProsConsList 
            pros={productData.pros_and_cons?.pros || shoe.pros || []} 
            cons={productData.pros_and_cons?.cons || shoe.cons || []} 
          />

          {/* 版型與尺寸 */}
          {productData.fit_and_sizing && (
            <FitAndSizing fitData={productData.fit_and_sizing} />
          )}

          {/* 社群評價 */}
          {productData.community_sentiment && (
            <CommunitySentiment sentimentData={productData.community_sentiment} />
          )}

          {/* 競爭對手比較 */}
          {productData.competitor_comparison && productData.competitor_comparison.length > 0 && (
            <CompetitorComparison competitors={productData.competitor_comparison} />
          )}

          {/* 購買指南 */}
          {productData.buying_guide && (
            <BuyingGuide buyingGuide={productData.buying_guide} />
          )}

          {/* 評論區塊 */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
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
    </>
  )
}

