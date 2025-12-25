import { Footprints, Activity, ShieldAlert, Thermometer } from 'lucide-react'

export default function PerformanceAnalysis({ performanceData, darkMode = false }) {
  if (!performanceData) return null

  const metrics = [
    { key: 'grip', label: '抓地力', icon: Footprints, color: 'blue' },
    { key: 'cushioning', label: '緩震與腳感', icon: Activity, color: 'yellow' },
    { key: 'stability', label: '防護性', icon: ShieldAlert, color: 'teal' },
    { key: 'breathability', label: '透氣性', icon: Thermometer, color: 'red' },
    { key: 'durability', label: '耐用度', icon: ShieldAlert, color: 'green' },
  ]

  const getScoreColor = (score, color) => {
    if (darkMode) {
      if (score >= 9) return { text: 'text-blue-400', bg: 'bg-blue-500', bar: 'bg-blue-500' }
      if (score >= 7) return { text: 'text-yellow-400', bg: 'bg-yellow-500', bar: 'bg-yellow-500' }
      if (score >= 5) return { text: 'text-teal-400', bg: 'bg-teal-500', bar: 'bg-teal-500' }
      return { text: 'text-red-400', bg: 'bg-red-500', bar: 'bg-red-500' }
    } else {
      if (score >= 9) return { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' }
      if (score >= 7) return { text: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500' }
      if (score >= 5) return { text: 'text-yellow-600', bg: 'bg-yellow-50', bar: 'bg-yellow-500' }
      return { text: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500' }
    }
  }

  const getScoreBarWidth = (score) => {
    return `${(score / 10) * 100}%`
  }

  const textColor = darkMode ? 'text-white' : 'text-slate-900'
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-600'
  const borderColor = darkMode ? 'border-slate-700' : 'border-slate-200'

  return (
    <div className={`${darkMode ? '' : 'bg-white rounded-lg shadow-md p-6 mt-6'}`}>
      {!darkMode && <h2 className="text-2xl font-semibold text-slate-900 mb-6">性能分析</h2>}
      <div className="space-y-8">
        {metrics.map((metric) => {
          const data = performanceData[metric.key]
          if (!data) return null

          const Icon = metric.icon
          const score = data.score || 0
          const summary = data.summary || ''
          const description = data.description || ''
          const colors = getScoreColor(score, metric.color)

          return (
            <div key={metric.key} className={`border-b ${borderColor} last:border-0 pb-8 last:pb-0`}>
              <div className="flex justify-between items-end mb-2">
                <h3 className={`text-xl font-bold ${colors.text} flex items-center gap-2`}>
                  <Icon className="w-5 h-5" /> {metric.label}
                </h3>
                <div className="flex items-end gap-1">
                  <span className={`text-2xl font-black ${colors.text}`}>{score.toFixed(1)}</span>
                  <span className={`text-sm ${textSecondary} mb-1`}>/10</span>
                </div>
              </div>

              {/* 評分條 */}
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all duration-500 ${colors.bar}`}
                  style={{ width: getScoreBarWidth(score) }}
                />
              </div>

              {/* 摘要 */}
              {summary && (
                <p className={`${colors.text} font-medium mb-2`}>{summary}</p>
              )}

              {/* 詳細描述 */}
              {description && (
                <p className={`${textSecondary} text-sm leading-relaxed`}>{description}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

