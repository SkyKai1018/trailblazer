import { CheckCircle2, XCircle, AlertCircle, ShoppingBag } from 'lucide-react'

export default function BuyingGuide({ buyingGuide }) {
  if (!buyingGuide || !buyingGuide.scenarios || buyingGuide.scenarios.length === 0) {
    return null
  }

  const getRecommendationIcon = (recommendation) => {
    const rec = recommendation?.toLowerCase() || ''
    if (rec.includes("don't buy") || rec.includes('不買')) {
      return XCircle
    }
    if (rec.includes('buy') || rec.includes('推薦') || rec.includes('建議')) {
      return CheckCircle2
    }
    return AlertCircle
  }

  const getRecommendationColor = (recommendation) => {
    const rec = recommendation?.toLowerCase() || ''
    if (rec.includes("don't buy") || rec.includes('不買')) {
      return 'bg-red-50 border-red-200 text-red-800'
    }
    if (rec.includes('buy') || rec.includes('推薦') || rec.includes('建議')) {
      return 'bg-emerald-50 border-emerald-200 text-emerald-800'
    }
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const getRecommendationLabel = (recommendation) => {
    const rec = recommendation?.toLowerCase() || ''
    if (rec.includes("don't buy") || rec.includes('不買')) {
      return '誰不該買'
    }
    if (rec.includes('buy') || rec.includes('推薦')) {
      return '誰該買'
    }
    if (rec.includes('try') || rec.includes('試穿')) {
      return '建議試穿'
    }
    return recommendation
  }

  // 排序：誰該買放前面，誰不該買放後面
  const sortedScenarios = [...buyingGuide.scenarios].sort((a, b) => {
    const aRec = a.recommendation?.toLowerCase() || ''
    const bRec = b.recommendation?.toLowerCase() || ''
    
    // 誰該買 (Buy) 排在前面
    const aIsBuy = aRec.includes('buy') && !aRec.includes("don't")
    const bIsBuy = bRec.includes('buy') && !bRec.includes("don't")
    
    if (aIsBuy && !bIsBuy) return -1
    if (!aIsBuy && bIsBuy) return 1
    return 0
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag size={24} className="text-emerald-600" />
        <h2 className="text-2xl font-semibold text-slate-900">購買指南</h2>
      </div>
      
      <div className="space-y-4">
        {sortedScenarios.map((scenario, index) => {
          const Icon = getRecommendationIcon(scenario.recommendation)
          const colorClass = getRecommendationColor(scenario.recommendation)
          
          return (
            <div
              key={index}
              className={`border-l-4 rounded-r-lg p-5 ${colorClass}`}
            >
              <div className="flex items-start gap-3">
                <Icon size={24} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{getRecommendationLabel(scenario.recommendation)}</h3>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed font-medium">
                    {scenario.condition}
                  </p>
                  {scenario.reason && (
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-sm leading-relaxed">{scenario.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

