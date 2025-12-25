import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useShoes } from '../hooks/useShoes'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoSection from '../components/VideoSection'
import SlideViewer from '../components/SlideViewer'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import PerformanceAnalysis from '../components/PerformanceAnalysis'
import FitAndSizing from '../components/FitAndSizing'
import CommunitySentiment from '../components/CommunitySentiment'
import CompetitorComparison from '../components/CompetitorComparison'
import BuyingGuide from '../components/BuyingGuide'
import {
  Mountain,
  Menu,
  X,
  Activity,
  Footprints,
  ShieldAlert,
  Ruler,
  Scale,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Thermometer,
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  DollarSign,
  Calendar,
  ArrowLeft
} from 'lucide-react'

export default function ShoeDetailEnhanced() {
  const { id } = useParams()
  const { getShoeById } = useShoes()
  const [shoe, setShoe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState('intro')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 定義區塊導航
  const sections = [
    { id: 'intro', label: '前言與背景' },
    { id: 'tech', label: '科技解析' },
    { id: 'performance', label: '動態實測' },
    { id: 'durability', label: '耐用與版型' },
    { id: 'sentiment', label: '社群風向' },
    { id: 'verdict', label: '總結評價' },
    { id: 'reviews', label: '使用者評論' }
  ]

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
  }, [id])

  // 處理滾動和 Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Scroll Spy 邏輯
      const scrollPosition = window.scrollY + window.innerHeight / 3
      
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveSection(id)
      setIsMobileMenuOpen(false)
    }
  }

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

  // 取得資料
  const brand = productData.product_identity?.brand || shoe.brand
  const modelName = productData.product_identity?.model_name || shoe.name
  const nickname = productData.product_identity?.nickname
  const slogan = productData.marketing_copy?.slogan
  const oneSentenceSummary = productData.marketing_copy?.one_sentence_summary || shoe.short_desc
  const detailedIntro = productData.marketing_copy?.detailed_introduction || shoe.description

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
  const specs = productData.specifications || {}
  const priceInfo = productData.product_identity?.price_info

  // 取得規格數據
  const weight = specs.weight_g || shoe.weight
  const stackHeight = specs.stack_height?.heel_mm || shoe.stack_height
  const drop = specs.drop_mm || shoe.drop
  const lugDepth = specs.lug_depth_mm || shoe.lug_depth
  const releaseYear = productData.product_identity?.release_year || shoe.release_year

  const NavLink = ({ id, label }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`text-sm font-bold tracking-wide transition-colors duration-300 hover:text-blue-500 uppercase ${
        activeSection === id ? 'text-blue-600' : 'text-slate-600'
      }`}
    >
      {label.split(' ')[0]}
    </button>
  )

  return (
    <div className="font-sans text-slate-800 bg-slate-50 selection:bg-blue-200 relative">
      {/* 側邊快速導航（桌面版） */}
      <div className="hidden lg:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 z-40 gap-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group flex items-center justify-end gap-3 transition-all duration-300"
            aria-label={`Scroll to ${section.label}`}
          >
            <span className={`text-xs font-bold text-right transition-all duration-300 ${
              activeSection === section.id 
                ? 'text-blue-600 opacity-100 translate-x-0' 
                : 'text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
            }`}>
              {section.label}
            </span>
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === section.id 
                ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg shadow-blue-500/30' 
                : 'bg-transparent border-slate-300 group-hover:border-blue-400 group-hover:bg-blue-50'
            }`} />
          </button>
        ))}
      </div>

      {/* 固定導航欄 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-black tracking-tighter italic text-slate-900 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
          >
            <Mountain className="w-6 h-6 text-blue-600" />
            {brand} <span className="text-blue-600">{modelName}</span>
          </Link>

          {/* 桌面導航 */}
          <div className="hidden md:flex gap-8">
            {sections.map((section) => (
              <NavLink key={section.id} id={section.id} label={section.label} />
            ))}
          </div>

          {/* 行動選單切換 */}
          <button 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 行動選單下拉 */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 border-t">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-sm font-bold tracking-wide transition-colors duration-300 hover:text-blue-500 uppercase text-left ${
                  activeSection === section.id ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden pt-20">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/40 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex gap-2 mb-2">
              <div className="inline-block px-3 py-1 bg-yellow-400 text-slate-900 font-bold text-xs tracking-widest uppercase rounded-sm">
                深度評測
              </div>
              {releaseYear && (
                <div className="inline-block px-3 py-1 bg-slate-700 text-white font-bold text-xs tracking-widest uppercase rounded-sm border border-slate-600">
                  {releaseYear} 新款
                </div>
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {brand.toUpperCase()} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                {modelName.toUpperCase()}
              </span>
            </h1>

            {nickname && (
              <div className="flex items-center gap-4 text-slate-400 font-mono text-sm">
                <span>AKA "{nickname}"</span>
                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                <span>{productData.product_identity?.market_positioning || 'Trail Running Shoes'}</span>
              </div>
            )}

            {slogan && (
              <p className="text-xl md:text-2xl text-slate-300 font-light border-l-4 border-blue-500 pl-4">
                {slogan}
              </p>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => scrollToSection('verdict')} 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition font-bold rounded-full shadow-lg shadow-blue-900/50"
              >
                看結論
              </button>
              <button 
                onClick={() => scrollToSection('tech')} 
                className="px-8 py-3 border border-white/30 hover:bg-white/10 transition font-bold rounded-full"
              >
                深入解析
              </button>
            </div>
          </div>

          <div className="relative">
            {/* 產品圖片 */}
            {coverImageUrl && !imageError ? (
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10 transform rotate-[-5deg] hover:rotate-0 transition duration-500">
                <img 
                  src={coverImageUrl} 
                  alt={`${brand} ${modelName}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl shadow-2xl flex items-center justify-center border border-white/10 transform rotate-[-5deg] hover:rotate-0 transition duration-500 group cursor-pointer">
                <div className="text-center">
                  <span className="text-slate-500 text-lg block mb-2">[產品形象圖]</span>
                  {priceInfo && (
                    <span className="text-slate-600 text-sm group-hover:text-blue-400 transition-colors">
                      {priceInfo.currency} MSRP ${priceInfo.msrp}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 浮動統計卡片 */}
            {weight && (
              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase">Weight (US9)</div>
                <div className="text-2xl font-black">{weight}g</div>
              </div>
            )}
            {stackHeight && (
              <div className="absolute top-10 -right-4 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase">Stack Height</div>
                <div className="text-2xl font-black">{stackHeight}mm</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 前言與背景區塊 */}
      <section id="intro" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Activity className="text-blue-600" />
              背景與定位
            </h2>
            {oneSentenceSummary && (
              <p className="text-lg leading-relaxed text-slate-600 mb-8">
                {oneSentenceSummary}
              </p>
            )}
            {detailedIntro && (
              <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-slate-900 mb-2">詳細介紹</h3>
                <p className="text-slate-600 whitespace-pre-line">
                  {detailedIntro}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 科技解析區塊 */}
      <section id="tech" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">靜態分析：科技與設計</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* 大底卡片 */}
            {specs.components?.outsole && (
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group border-t-4 border-yellow-500 h-full">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Footprints className="text-yellow-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">大底：仿生蹄狀設計</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                    <span><strong>{specs.components.outsole.tech}</strong></span>
                  </li>
                  {specs.components.outsole.feature && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span>{specs.components.outsole.feature}</span>
                    </li>
                  )}
                  {specs.lug_depth_mm && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span><strong>{specs.lug_depth_mm}mm 深齒</strong></span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* 中底卡片 */}
            {specs.components?.midsole && (
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group border-t-4 border-blue-500 h-full">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Scale className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">中底：輕量化硬派</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                    <span><strong>{specs.components.midsole.tech}</strong></span>
                  </li>
                  {specs.components.midsole.feature && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span>{specs.components.midsole.feature}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* 鞋面卡片 */}
            {specs.components?.upper && (
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group border-t-4 border-red-500 h-full">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="text-red-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">鞋面：編織鎧甲</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                    <span><strong>{specs.components.upper.tech}</strong></span>
                  </li>
                  {specs.components.upper.feature && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span>{specs.components.upper.feature}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* 詳細規格表格 */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-600" />
                詳細規格數據 (Specifications)
              </h3>
              {releaseYear && (
                <span className="text-xs font-mono text-slate-400 bg-slate-200 px-2 py-1 rounded">{releaseYear} Model</span>
              )}
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* 左欄 */}
              <div className="p-6 space-y-4">
                {weight && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Scale className="w-4 h-4" /> 重量 (Weight)
                    </div>
                    <span className="font-bold text-slate-900">
                      {weight}g {specs.weight_note && <span className="text-xs text-slate-400 font-normal">({specs.weight_note})</span>}
                    </span>
                  </div>
                )}
                {drop && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <ArrowUpDown className="w-4 h-4" /> 足跟差 (Drop)
                    </div>
                    <span className="font-bold text-slate-900">{drop}mm</span>
                  </div>
                )}
                {specs.lug_depth_mm && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Ruler className="w-4 h-4" /> 齒深 (Lug Depth)
                    </div>
                    <span className="font-bold text-slate-900">{specs.lug_depth_mm}mm</span>
                  </div>
                )}
                {releaseYear && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar className="w-4 h-4" /> 發布年份
                    </div>
                    <span className="font-bold text-slate-900">{releaseYear}</span>
                  </div>
                )}
              </div>

              {/* 右欄 */}
              <div className="p-6 space-y-4">
                {specs.stack_height && (
                  <>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500 text-sm">男款鞋高 (Stack Height)</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">
                          {specs.stack_height.heel_mm || stackHeight}mm <span className="text-xs text-slate-400 font-normal">/ 跟</span>
                        </span>
                        {specs.stack_height.forefoot_mm && (
                          <span className="font-bold text-slate-900 block">
                            {specs.stack_height.forefoot_mm}mm <span className="text-xs text-slate-400 font-normal">/ 前</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {specs.stack_height.note && (
                      <p className="text-xs text-slate-500 italic">{specs.stack_height.note}</p>
                    )}
                  </>
                )}
                {priceInfo && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <DollarSign className="w-4 h-4" /> 定價 (MSRP)
                    </div>
                    <div className="text-right">
                      {priceInfo.twd_approx?.regular && (
                        <span className="font-bold text-slate-900 block">NT${priceInfo.twd_approx.regular.toLocaleString()}</span>
                      )}
                      <span className="text-xs text-slate-400 font-normal">{priceInfo.currency} ${priceInfo.msrp}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 動態實測區塊 */}
      {productData.performance_analysis && (
        <section id="performance" className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8">動態實測：路感與性能</h2>
                <PerformanceAnalysis performanceData={productData.performance_analysis} darkMode={true} />
              </div>
              <div className="relative h-full min-h-[400px] bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-4">
                  <Mountain className="text-slate-600 w-12 h-12 opacity-20" />
                </div>
                {productData.performance_analysis.cushioning?.description && (
                  <>
                    <blockquote className="text-2xl md:text-3xl font-serif italic text-slate-300 leading-relaxed text-center">
                      "{productData.performance_analysis.cushioning.description}"
                    </blockquote>
                    <div className="mt-6 text-center text-blue-400 font-bold tracking-widest uppercase text-sm">
                      - 測試者回饋 -
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 耐用度與版型區塊 */}
      <section id="durability" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* 耐用度內容 */}
            {productData.performance_analysis?.durability && (
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <ShieldAlert className="text-blue-600" />
                  耐用度：{productData.performance_analysis.durability.summary}
                </h2>
                <p className="text-slate-600 mb-6">{productData.performance_analysis.durability.description}</p>
              </div>
            )}

            {/* 版型警告 */}
            {productData.fit_and_sizing && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 bg-red-500 text-white px-8 py-2 rotate-12 font-bold shadow-md flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> 嚴重警示
                </div>
                <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <Ruler className="w-6 h-6" />
                  版型建議 (Critical Fit Issue)
                </h2>
                <p className="text-red-700 mb-6 font-medium">
                  {productData.fit_and_sizing.overall_fit}
                </p>
                <FitAndSizing fitData={productData.fit_and_sizing} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 社群評價區塊 */}
      {productData.community_sentiment && (
        <section id="sentiment" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                社群評價 ({productData.community_sentiment.overall_sentiment})
              </h2>
            </div>
            <CommunitySentiment sentimentData={productData.community_sentiment} />
          </div>
        </section>
      )}

      {/* 競爭對手比較 */}
      {productData.competitor_comparison && productData.competitor_comparison.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <CompetitorComparison competitors={productData.competitor_comparison} />
          </div>
        </section>
      )}

      {/* 總結評價區塊 */}
      <section id="verdict" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-slate-50 rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-10 md:p-16">
              <h2 className="text-4xl font-black text-center mb-12">總結與購買指南</h2>
              
              {/* 優缺點 */}
              {productData.pros_and_cons && (
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {/* 優點 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-green-700 border-b-2 border-green-200 pb-2 mb-4">優點 (Pros)</h3>
                    <ul className="space-y-4">
                      {productData.pros_and_cons.pros?.map((pro, index) => (
                        <li key={index} className="flex gap-3 text-slate-700">
                          <CheckCircle2 className="text-green-500 shrink-0 mt-1" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 缺點 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-red-700 border-b-2 border-red-200 pb-2 mb-4">缺點 (Cons)</h3>
                    <ul className="space-y-4">
                      {productData.pros_and_cons.cons?.map((con, index) => (
                        <li key={index} className="flex gap-3 text-slate-700">
                          <XCircle className="text-red-500 shrink-0 mt-1" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 購買指南 */}
              {productData.buying_guide && (
                <>
                  <BuyingGuide buyingGuide={productData.buying_guide} />
                  <div className="bg-slate-900 text-white p-8 md:p-12 rounded-2xl text-center mt-8">
                    <h3 className="text-lg font-bold text-blue-400 uppercase tracking-widest mb-4">Final Verdict</h3>
                    {slogan && (
                      <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-6">
                        「{slogan}」
                      </p>
                    )}
                    {productData.fit_and_sizing?.recommendation && (
                      <p className="text-slate-300 text-sm">
                        {productData.fit_and_sizing.recommendation}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 使用者評論區塊 */}
      <section id="reviews" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">使用者評論</h2>
            <ReviewForm shoeId={id} onReviewAdded={() => {
              setReviewRefreshKey(prev => prev + 1)
              const event = new CustomEvent('reviewAdded')
              window.dispatchEvent(event)
            }} />
            <div className="mt-6">
              <ReviewList key={reviewRefreshKey} shoeId={id} />
            </div>
          </div>
        </div>
      </section>

      {/* YouTube 影片 */}
      {youtubeVideoUrl && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <VideoSection videoUrl={youtubeVideoUrl} title="產品介紹影片" />
          </div>
        </section>
      )}

      {/* 投影片 */}
      {shoe.slides && shoe.slides.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <SlideViewer 
              images={shoe.slides} 
              title={`${brand} ${modelName} - 詳細說明`} 
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

