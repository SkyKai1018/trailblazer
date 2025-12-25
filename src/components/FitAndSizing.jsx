import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

export default function FitAndSizing({ fitData }) {
  if (!fitData) return null

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      case 'success':
        return CheckCircle2
      default:
        return AlertTriangle
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">版型與尺寸</h2>
      
      <div className="space-y-6">
        {/* 整體版型 */}
        {fitData.overall_fit && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">整體版型</h3>
            <p className="text-slate-700">{fitData.overall_fit}</p>
          </div>
        )}

        {/* 磨合期 */}
        {fitData.break_in_period && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">磨合期</h3>
            <p className="text-slate-700">{fitData.break_in_period}</p>
          </div>
        )}

        {/* 警告事項 */}
        {fitData.alerts && fitData.alerts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">注意事項</h3>
            <div className="space-y-3">
              {fitData.alerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.type)
                return (
                  <div
                    key={index}
                    className={`border-l-4 rounded-r-lg p-4 ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={20} className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{alert.title}</h4>
                        <p className="text-sm leading-relaxed">{alert.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 購買建議 */}
        {fitData.recommendation && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg p-4">
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">購買建議</h3>
            <p className="text-emerald-800 leading-relaxed">{fitData.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

