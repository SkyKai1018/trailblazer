import { CheckCircle2, XCircle } from 'lucide-react'

export default function ProsConsList({ pros, cons }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {pros && pros.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-600" />
            優點
          </h3>
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li
                key={index}
                className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded text-slate-700"
              >
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {cons && cons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            <XCircle size={20} className="text-red-600" />
            缺點
          </h3>
          <ul className="space-y-2">
            {cons.map((con, index) => (
              <li
                key={index}
                className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-slate-700"
              >
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

