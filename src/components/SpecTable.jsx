import { Paperclip, Download, Mountain, ShoppingBag, Layers, Footprints, Calendar } from 'lucide-react'

export default function SpecTable({ shoe }) {
  // 從 product_data 或直接從 shoe 物件讀取規格
  let productData = {}
  try {
    if (shoe.product_data) {
      if (typeof shoe.product_data === 'string') {
        const trimmed = shoe.product_data.trim()
        if (trimmed && trimmed !== 'null') {
          const parsed = JSON.parse(trimmed)
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
  
  const specs = productData?.specifications || {}

  // 取得發行年月份顯示值
  const getReleaseDateValue = () => {
    // 優先從 JSON 取得
    const releaseYear = productData.product_identity?.release_year || shoe.release_year
    const releaseMonth = productData.product_identity?.release_month
    
    if (releaseYear) {
      if (releaseMonth) {
        // 有年份和月份：顯示為 "2024年5月" 或 "2024-05"
        return `${releaseYear}年${releaseMonth}月`
      } else {
        // 只有年份：顯示為 "2024年"
        return `${releaseYear}年`
      }
    }
    return '-'
  }

  // 取得鞋底厚度顯示值
  const getStackHeightValue = () => {
    // 優先使用 JSON 資料
    if (specs.stack_height) {
      // 如果是物件，有 heel_mm 和 forefoot_mm
      if (typeof specs.stack_height === 'object' && specs.stack_height.heel_mm !== undefined && specs.stack_height.forefoot_mm !== undefined) {
        return `${specs.stack_height.heel_mm}mm (後) / ${specs.stack_height.forefoot_mm}mm (前)`
      }
      // 如果只有 heel_mm
      if (typeof specs.stack_height === 'object' && specs.stack_height.heel_mm !== undefined) {
        return `${specs.stack_height.heel_mm}mm (後)`
      }
      // 如果是數字
      if (typeof specs.stack_height === 'number') {
        return `${specs.stack_height}mm`
      }
    }
    // 回退到直接欄位
    if (shoe.stack_height) {
      return `${shoe.stack_height}mm`
    }
    return '-'
  }

  // 基本規格（向後相容）
  const basicSpecs = [
    {
      label: '鞋底厚度',
      value: getStackHeightValue(),
      icon: Paperclip,
      note: specs.stack_height?.note,
    },
    {
      label: '足跟差',
      value: specs.drop_mm 
        ? `${specs.drop_mm}mm` 
        : shoe.drop 
        ? `${shoe.drop}mm` 
        : '-',
      icon: Download,
    },
    {
      label: '齒深',
      value: specs.lug_depth_mm 
        ? `${specs.lug_depth_mm}mm` 
        : shoe.lug_depth 
        ? `${shoe.lug_depth}mm` 
        : '-',
      icon: Mountain,
    },
    {
      label: '重量',
      value: specs.weight_g 
        ? `${specs.weight_g}g${specs.weight_note ? ` (${specs.weight_note})` : ''}` 
        : shoe.weight 
        ? `${shoe.weight}g` 
        : '-',
      icon: ShoppingBag,
    },
    {
      label: '發行年月份',
      value: getReleaseDateValue(),
      icon: Calendar,
    },
  ]

  const components = specs.components || {}

  return (
    <div className="bg-slate-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">規格參數</h2>
      
      {/* 基本規格 */}
      <div className="space-y-3 mb-6">
        {basicSpecs.map((spec, index) => {
          const Icon = spec.icon
          return (
            <div key={index}>
              <div className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-emerald-600" />
                  <span className="text-slate-700">{spec.label}</span>
                </div>
                <span className="font-semibold text-slate-900">{spec.value}</span>
              </div>
              {spec.note && (
                <p className="text-xs text-slate-500 mt-1 ml-8">{spec.note}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* 組件技術 */}
      {(components.outsole || components.midsole || components.upper) && (
        <div className="mt-6 pt-6 border-t border-slate-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Layers size={20} className="text-emerald-600" />
            技術組件
          </h3>
          <div className="space-y-4">
            {components.outsole && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Footprints size={16} className="text-emerald-600" />
                  大底 (Outsole)
                </h4>
                <p className="text-sm text-slate-700 mb-1">
                  <span className="font-medium">{components.outsole.tech}</span>
                </p>
                {components.outsole.feature && (
                  <p className="text-xs text-slate-600">{components.outsole.feature}</p>
                )}
              </div>
            )}
            {components.midsole && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Layers size={16} className="text-emerald-600" />
                  中底 (Midsole)
                </h4>
                <p className="text-sm text-slate-700 mb-1">
                  <span className="font-medium">{components.midsole.tech}</span>
                </p>
                {components.midsole.feature && (
                  <p className="text-xs text-slate-600">{components.midsole.feature}</p>
                )}
              </div>
            )}
            {components.upper && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Layers size={16} className="text-emerald-600" />
                  鞋面 (Upper)
                </h4>
                <p className="text-sm text-slate-700 mb-1">
                  <span className="font-medium">{components.upper.tech}</span>
                </p>
                {components.upper.feature && (
                  <p className="text-xs text-slate-600">{components.upper.feature}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

