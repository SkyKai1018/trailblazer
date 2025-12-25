import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useShoes } from '../hooks/useShoes'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Trash2, Edit } from 'lucide-react'

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const { shoes, loading: shoesLoading, deleteShoe } = useShoes()
  const navigate = useNavigate()
  const [editingShoe, setEditingShoe] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">載入中...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const handleDelete = async (id, shoeName) => {
    const confirmMessage = `確定要刪除「${shoeName || '此鞋款'}」嗎？\n\n此操作無法復原！`
    if (window.confirm(confirmMessage)) {
      try {
        await deleteShoe(id)
        // 可選：顯示成功訊息
        // alert('刪除成功')
      } catch (error) {
        alert('刪除失敗：' + error.message)
      }
    }
  }

  const handleEdit = (shoe) => {
    setEditingShoe(shoe)
    navigate(`/admin/edit/${shoe.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900">後台管理</h1>
            <button
              onClick={() => navigate('/admin/new')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              新增鞋款
            </button>
          </div>

          {shoesLoading ? (
            <p className="text-slate-600">載入中...</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-700">圖片</th>
                    <th className="px-4 py-3 text-left text-slate-700">品牌</th>
                    <th className="px-4 py-3 text-left text-slate-700">型號</th>
                    <th className="px-4 py-3 text-left text-slate-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {shoes.map((shoe) => (
                    <tr key={shoe.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">
                        {shoe.image_url ? (
                          <img
                            src={shoe.image_url}
                            alt={shoe.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-200 rounded"></div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{shoe.brand}</td>
                      <td className="px-4 py-3 text-slate-700">{shoe.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(shoe)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="編輯"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(shoe.id, shoe.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="刪除此鞋款"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

