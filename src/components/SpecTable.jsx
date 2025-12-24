import { Paperclip, Download, Mountain, ShoppingBag } from 'lucide-react'

export default function SpecTable({ shoe }) {
  const specs = [
    {
      label: 'Stack Height',
      value: shoe.stack_height ? `${shoe.stack_height}mm` : '-',
      icon: Paperclip,
    },
    {
      label: 'Drop',
      value: shoe.drop ? `${shoe.drop}mm` : '-',
      icon: Download,
    },
    {
      label: 'Lug Depth',
      value: shoe.lug_depth ? `${shoe.lug_depth}mm` : '-',
      icon: Mountain,
    },
    {
      label: 'Weight',
      value: shoe.weight ? `${shoe.weight}g` : '-',
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="bg-slate-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">規格參數</h2>
      <div className="space-y-3">
        {specs.map((spec, index) => {
          const Icon = spec.icon
          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-emerald-600" />
                <span className="text-slate-700">{spec.label}</span>
              </div>
              <span className="font-semibold text-slate-900">{spec.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

