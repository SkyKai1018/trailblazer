import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'

export default function CompetitorComparison({ competitors }) {
  if (!competitors || competitors.length === 0) return null

  const getPriceDiffColor = (priceDiff) => {
    if (!priceDiff) return 'text-slate-600'
    if (priceDiff.toLowerCase().includes('higher') || priceDiff.includes('+')) {
      return 'text-red-600'
    }
    if (priceDiff.toLowerCase().includes('lower') || priceDiff.includes('-')) {
      return 'text-emerald-600'
    }
    return 'text-slate-600'
  }

  const getPriceDiffIcon = (priceDiff) => {
    if (!priceDiff) return Minus
    if (priceDiff.toLowerCase().includes('higher') || priceDiff.includes('+')) {
      return TrendingUp
    }
    if (priceDiff.toLowerCase().includes('lower') || priceDiff.includes('-')) {
      return TrendingDown
    }
    return Minus
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">競爭對手比較</h2>
      
      <div className="space-y-6">
        {competitors.map((competitor, index) => {
          const PriceIcon = getPriceDiffIcon(competitor.price_diff)
          const priceColor = getPriceDiffColor(competitor.price_diff)
          
          return (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    {competitor.competitor_brand} {competitor.competitor_model}
                  </h3>
                  <span className="inline-block text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {competitor.relation_type}
                  </span>
                </div>
                {competitor.price_diff && (
                  <div className={`flex items-center gap-1 ${priceColor}`}>
                    <PriceIcon size={18} />
                    <span className="text-sm font-medium">{competitor.price_diff}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">主要差異</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {competitor.key_difference}
                  </p>
                </div>

                {competitor.buying_tip && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg p-4">
                    <div className="flex items-start gap-2">
                      <ArrowRight size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-900 mb-1">購買建議</h4>
                        <p className="text-emerald-800 text-sm leading-relaxed">
                          {competitor.buying_tip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

