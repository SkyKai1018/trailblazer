import { Mountain } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-600 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mountain size={20} className="text-emerald-600" />
          <span className="font-semibold">Sk Trail - 越野跑鞋推薦平台</span>
        </div>
        <p className="text-sm">© 2025 All Rights Reserved.</p>
      </div>
    </footer>
  )
}

