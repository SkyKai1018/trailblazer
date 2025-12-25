import { Link } from 'react-router-dom'
import { Paperclip, Download, Mountain, ShoppingBag } from 'lucide-react'
import { PLACEHOLDER_IMAGE } from '../utils/constants'

export default function ShoeCard({ shoe }) {
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

  // 從 product_data 或直接欄位取得資料
  const brand = productData.product_identity?.brand || shoe.brand
  const modelName = productData.product_identity?.model_name || shoe.name
  const nickname = productData.product_identity?.nickname
  const shortDesc = productData.marketing_copy?.one_sentence_summary || shoe.short_desc
  const specs = productData.specifications || {}
  
  // 取得圖片 URL（優先使用直接欄位）
  const getImageUrl = () => {
    if (shoe.cover_image_url) return shoe.cover_image_url
    if (shoe.image_url) return shoe.image_url
    const pdImage = productData.product_identity?.cover_image_url
    if (pdImage && !pdImage.includes('example.com')) return pdImage
    return null
  }
  
  const imageUrl = getImageUrl() || PLACEHOLDER_IMAGE
  
  // 取得規格數據
  const stackHeight = specs.stack_height?.heel_mm || shoe.stack_height
  const drop = specs.drop_mm || shoe.drop
  const lugDepth = specs.lug_depth_mm || shoe.lug_depth
  const weight = specs.weight_g || shoe.weight

  return (
    <Link
      to={`/shoe/${shoe.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={`${brand} ${modelName}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-1">
          {modelName}
          {nickname && (
            <span className="text-emerald-600 text-sm font-normal ml-2">({nickname})</span>
          )}
        </h3>
        {shortDesc && (
          <p className="text-sm text-slate-600 mb-4">{shortDesc}</p>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Paperclip size={16} className="text-emerald-600" />
            <span>{stackHeight || '-'}mm</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Download size={16} className="text-emerald-600" />
            <span>{drop || '-'}mm 落差</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Mountain size={16} className="text-emerald-600" />
            <span>{lugDepth || '-'}mm 齒深</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShoppingBag size={16} className="text-emerald-600" />
            <span>{weight || '-'}g</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

