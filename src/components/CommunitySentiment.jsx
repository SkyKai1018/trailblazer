import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

export default function CommunitySentiment({ sentimentData }) {
  if (!sentimentData) return null

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-emerald-600 bg-emerald-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      case 'neutral':
        return 'text-slate-600 bg-slate-50'
      default:
        return 'text-slate-600 bg-slate-50'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return ThumbsUp
      case 'negative':
        return ThumbsDown
      default:
        return MessageSquare
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">社群評價</h2>
      
      <div className="space-y-6">
        {/* 整體評價 */}
        {sentimentData.overall_sentiment && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">整體評價</h3>
            <p className="text-slate-700">{sentimentData.overall_sentiment}</p>
          </div>
        )}

        {/* 詳細評價 */}
        {sentimentData.details && sentimentData.details.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">使用者群組意見</h3>
            <div className="space-y-4">
              {sentimentData.details.map((detail, index) => {
                const Icon = getSentimentIcon(detail.sentiment)
                const colorClass = getSentimentColor(detail.sentiment)
                
                return (
                  <div
                    key={index}
                    className={`border-l-4 rounded-r-lg p-4 ${colorClass.split(' ')[1]}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={20} className={`flex-shrink-0 mt-0.5 ${colorClass.split(' ')[0]}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{detail.group}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
                            {detail.sentiment}
                          </span>
                        </div>
                        {detail.comment && (
                          <p className="text-sm mb-2 leading-relaxed">{detail.comment}</p>
                        )}
                        {detail.action && (
                          <p className="text-xs opacity-75 italic">→ {detail.action}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

