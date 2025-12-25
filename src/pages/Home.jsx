import { useState } from 'react'
import { useShoes } from '../hooks/useShoes'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ShoeCard from '../components/ShoeCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Plus } from 'lucide-react'

export default function Home() {
  const { shoes, loading } = useShoes()
  const { isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredShoes = shoes.filter((shoe) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    
    // 搜尋直接欄位
    const matchesDirect = (
      shoe.name?.toLowerCase().includes(query) ||
      shoe.brand?.toLowerCase().includes(query) ||
      shoe.short_desc?.toLowerCase().includes(query)
    )
    
    if (matchesDirect) return true
    
    // 搜尋 product_data JSON
    try {
      let productData = {}
      if (shoe.product_data) {
        if (typeof shoe.product_data === 'string') {
          const trimmed = shoe.product_data.trim()
          if (trimmed && trimmed !== 'null' && trimmed !== '""') {
            let parsed = JSON.parse(trimmed)
            if (typeof parsed === 'string') {
              try {
                parsed = JSON.parse(parsed)
              } catch (e2) {}
            }
            productData = parsed && typeof parsed === 'object' ? parsed : {}
          }
        } else if (typeof shoe.product_data === 'object') {
          productData = shoe.product_data
        }
      }
      
      if (productData && typeof productData === 'object') {
        const matchesJSON = (
          productData.product_identity?.brand?.toLowerCase().includes(query) ||
          productData.product_identity?.model_name?.toLowerCase().includes(query) ||
          productData.product_identity?.nickname?.toLowerCase().includes(query) ||
          productData.marketing_copy?.slogan?.toLowerCase().includes(query) ||
          productData.marketing_copy?.one_sentence_summary?.toLowerCase().includes(query)
        )
        return matchesJSON
      }
    } catch (e) {
      // 解析失敗，忽略
    }
    
    return false
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {isAdmin && (
          <div className="max-w-7xl mx-auto mb-6">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus size={20} />
              新增鞋款
            </Link>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">載入中...</p>
          </div>
        ) : filteredShoes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              {searchQuery ? '找不到符合條件的鞋款' : '尚無鞋款資料'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto fade-in">
            {filteredShoes.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

