import { Link } from 'react-router-dom'
import { Paperclip, Download, Mountain, ShoppingBag } from 'lucide-react'
import { PLACEHOLDER_IMAGE } from '../utils/constants'

export default function ShoeCard({ shoe }) {
  return (
    <Link
      to={`/shoe/${shoe.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={shoe.image_url || PLACEHOLDER_IMAGE}
          alt={`${shoe.brand} ${shoe.name}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-1">{shoe.name}</h3>
        {shoe.short_desc && (
          <p className="text-sm text-slate-600 mb-4">{shoe.short_desc}</p>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Paperclip size={16} className="text-emerald-600" />
            <span>{shoe.stack_height || '-'}mm</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Download size={16} className="text-emerald-600" />
            <span>{shoe.drop || '-'}mm 落差</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Mountain size={16} className="text-emerald-600" />
            <span>{shoe.lug_depth || '-'}mm 齒深</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShoppingBag size={16} className="text-emerald-600" />
            <span>{shoe.weight || '-'}g</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

