import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useShoes } from '../hooks/useShoes'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FileUpload from '../components/FileUpload'
import { X } from 'lucide-react'

export default function AdminShoeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, loading: authLoading } = useAuth()
  const { getShoeById, createShoe, updateShoe } = useShoes()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    release_year: '',
    release_month: '',
    stack_height: '',
    drop: '',
    lug_depth: '',
    weight: '',
    cover_image_url: '',
    youtube_video_url: '',
    image_url: '',
    video_url: '',
    pdf_url: '',
    slides: [],
    short_desc: '',
    description: '',
    pros: [],
    cons: [],
    product_data: '',
  })

  const [prosInput, setProsInput] = useState('')
  const [consInput, setConsInput] = useState('')
  const [slidesInput, setSlidesInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [productDataError, setProductDataError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, authLoading, navigate])

  useEffect(() => {
    if (isEditMode && id) {
      const fetchShoe = async () => {
        try {
          const shoe = await getShoeById(id)
          // 處理 product_data：如果是物件，轉為 JSON 字串
          let productDataStr = ''
          if (shoe.product_data) {
            try {
              productDataStr = typeof shoe.product_data === 'string'
                ? shoe.product_data
                : JSON.stringify(shoe.product_data, null, 2)
            } catch (e) {
              console.error('解析 product_data 失敗:', e)
            }
          }
          
          // 從 product_data 中提取 release_month
          let releaseMonth = ''
          if (productDataStr) {
            try {
              const parsed = JSON.parse(productDataStr)
              releaseMonth = parsed?.product_identity?.release_month || ''
            } catch (e) {
              // 忽略解析錯誤
            }
          }
          
          setFormData({
            name: shoe.name || '',
            brand: shoe.brand || '',
            category: shoe.category || '',
            release_year: shoe.release_year || '',
            release_month: releaseMonth,
            stack_height: shoe.stack_height || '',
            drop: shoe.drop || '',
            lug_depth: shoe.lug_depth || '',
            weight: shoe.weight || '',
            cover_image_url: shoe.cover_image_url || '',
            youtube_video_url: shoe.youtube_video_url || '',
            image_url: shoe.image_url || '',
            video_url: shoe.video_url || '',
            pdf_url: shoe.pdf_url || '',
            slides: shoe.slides || [],
            short_desc: shoe.short_desc || '',
            description: shoe.description || '',
            pros: shoe.pros || [],
            cons: shoe.cons || [],
            product_data: productDataStr,
          })
        } catch (error) {
          console.error('載入鞋款資料失敗:', error)
          alert('載入鞋款資料失敗')
          navigate('/admin')
        }
      }
      fetchShoe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]) // 只在 id 或 isEditMode 改變時執行，避免覆蓋用戶輸入

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddTag = (type, input, setInput) => {
    if (input.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], input.trim()],
      }))
      setInput('')
    }
  }

  const handleRemoveTag = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProductDataError('')

    try {
      // 驗證並解析 product_data JSON
      let productDataObj = null
      if (formData.product_data && formData.product_data.trim()) {
        try {
          productDataObj = JSON.parse(formData.product_data)
          
          // 確保 product_identity 存在
          if (!productDataObj.product_identity) {
            productDataObj.product_identity = {}
          }
          
          // 更新發行年份和月份到 product_identity
          if (formData.release_year) {
            productDataObj.product_identity.release_year = parseInt(formData.release_year)
          }
          if (formData.release_month) {
            productDataObj.product_identity.release_month = parseInt(formData.release_month)
          }
        } catch (e) {
          setProductDataError('product_data JSON 格式錯誤：' + e.message)
          setLoading(false)
          return
        }
      } else {
        // 如果沒有 product_data，建立基本結構
        productDataObj = {
          product_identity: {}
        }
        if (formData.release_year) {
          productDataObj.product_identity.release_year = parseInt(formData.release_year)
        }
        if (formData.release_month) {
          productDataObj.product_identity.release_month = parseInt(formData.release_month)
        }
      }

      // 從 formData 中移除 release_month，因為它只存在於 product_data 中
      const { release_month, ...dataWithoutMonth } = formData
      
      const submitData = {
        ...dataWithoutMonth,
        stack_height: formData.stack_height ? parseFloat(formData.stack_height) : null,
        drop: formData.drop ? parseFloat(formData.drop) : null,
        lug_depth: formData.lug_depth ? parseFloat(formData.lug_depth) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        release_year: formData.release_year ? parseInt(formData.release_year) : null,
        product_data: productDataObj,
      }

      if (isEditMode) {
        await updateShoe(id, submitData)
      } else {
        await createShoe(submitData)
      }

      navigate('/admin')
    } catch (error) {
      console.error('儲存失敗:', error)
      alert('儲存失敗：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">載入中...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            {isEditMode ? '編輯鞋款' : '新增鞋款'}
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  品牌 *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  型號 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  類別
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="例如：Trail Running Shoes"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    發行年份
                  </label>
                  <input
                    type="number"
                    name="release_year"
                    value={formData.release_year}
                    onChange={handleInputChange}
                    placeholder="例如：2024"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    發行月份
                  </label>
                  <input
                    type="number"
                    name="release_month"
                    value={formData.release_month}
                    onChange={handleInputChange}
                    placeholder="例如：5 (1-12)"
                    min="1"
                    max="12"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stack Height (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="stack_height"
                  value={formData.stack_height}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Drop (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="drop"
                  value={formData.drop}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lug Depth (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="lug_depth"
                  value={formData.lug_depth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weight (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                封面圖片（新格式）
              </label>
              <FileUpload
                label=""
                accept="image/*"
                folder="images"
                maxSize={5 * 1024 * 1024} // 5MB
                onUploadComplete={(url) => {
                  if (url) {
                    setFormData(prev => ({ ...prev, cover_image_url: url }))
                  }
                }}
              />
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">或輸入圖片 URL：</p>
                <input
                  type="text"
                  name="cover_image_url"
                  value={formData.cover_image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cover-image.jpg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                YouTube 影片連結（新格式）
              </label>
              <input
                type="text"
                name="youtube_video_url"
                value={formData.youtube_video_url || ''}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                輸入完整的 YouTube 影片 URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                主圖片（向後相容）
              </label>
              <FileUpload
                label=""
                accept="image/*"
                folder="images"
                maxSize={5 * 1024 * 1024} // 5MB
                onUploadComplete={(url) => {
                  if (url) {
                    setFormData(prev => ({ ...prev, image_url: url }))
                  }
                }}
              />
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">或輸入圖片 URL：</p>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                影片 URL
              </label>
              <input
                type="text"
                name="video_url"
                value={formData.video_url || ''}
                onChange={handleInputChange}
                placeholder="支援 YouTube 連結或本地 .mp4 檔案路徑"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                可輸入 YouTube 連結或本地影片檔案路徑（如：/videos/shoe-intro.mp4）
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                投影片圖片（推薦）
              </label>
              
              {/* 檔案上傳 */}
              <div className="mb-3">
                <FileUpload
                  label="上傳投影片圖片"
                  accept="image/*"
                  folder="slides"
                  maxSize={5 * 1024 * 1024} // 5MB
                  onUploadComplete={(url) => {
                    if (url) {
                      setFormData((prev) => ({
                        ...prev,
                        slides: [...prev.slides, url],
                      }))
                    }
                  }}
                />
              </div>

              {/* URL 輸入 */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={slidesInput}
                  onChange={(e) => setSlidesInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (slidesInput.trim()) {
                        setFormData((prev) => ({
                          ...prev,
                          slides: [...prev.slides, slidesInput.trim()],
                        }))
                        setSlidesInput('')
                      }
                    }
                  }}
                  placeholder="或輸入圖片 URL 後按 Enter（每張投影片一張圖片）"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (slidesInput.trim()) {
                      setFormData((prev) => ({
                        ...prev,
                        slides: [...prev.slides, slidesInput.trim()],
                      }))
                      setSlidesInput('')
                    }
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  新增
                </button>
              </div>
              
              {/* 已新增的圖片列表 */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.slides.map((slide, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span className="max-w-xs truncate">{slide}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          slides: prev.slides.filter((_, i) => i !== index),
                        }))
                      }}
                      className="hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                建議：將簡報轉成圖片（PNG/JPG），每張投影片一張圖片，可上傳或輸入 URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PDF 詳細說明檔案（備用選項）
              </label>
              <FileUpload
                label=""
                accept=".pdf"
                folder="pdfs"
                maxSize={20 * 1024 * 1024} // 20MB
                onUploadComplete={(url) => {
                  // 只有在上傳成功時才更新 URL（url 不為空字串）
                  // 如果 url 為空，表示用戶移除了上傳的檔案，但我們保留手動輸入的 URL
                  if (url && url.trim() !== '') {
                    setFormData(prev => ({ ...prev, pdf_url: url }))
                  }
                }}
              />
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">或輸入 PDF URL：</p>
                <input
                  type="text"
                  name="pdf_url"
                  value={formData.pdf_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/detail.pdf 或 /pdfs/detail.pdf"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                如果沒有投影片圖片，可使用 PDF 檔案（較不推薦，載入較慢）
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                簡短描述
              </label>
              <input
                type="text"
                name="short_desc"
                value={formData.short_desc}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                詳細介紹
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  優點
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={prosInput}
                    onChange={(e) => setProsInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag('pros', prosInput, setProsInput)
                      }
                    }}
                    placeholder="輸入優點後按 Enter"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag('pros', prosInput, setProsInput)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.pros.map((pro, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
                    >
                      {pro}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag('pros', index)}
                        className="hover:text-emerald-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  缺點
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={consInput}
                    onChange={(e) => setConsInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag('cons', consInput, setConsInput)
                      }
                    }}
                    placeholder="輸入缺點後按 Enter"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag('cons', consInput, setConsInput)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.cons.map((con, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      {con}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag('cons', index)}
                        className="hover:text-red-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                完整產品資料 JSON（進階）
              </label>
              <textarea
                name="product_data"
                value={formData.product_data}
                onChange={handleInputChange}
                rows={12}
                placeholder='{"metadata": {...}, "product_identity": {...}, ...}'
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm ${
                  productDataError 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
              {productDataError && (
                <p className="text-xs text-red-600 mt-1">{productDataError}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                可參考範例 JSON 結構。留空則不使用完整產品資料格式。
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? '儲存中...' : '儲存'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

