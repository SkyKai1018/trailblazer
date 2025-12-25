import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { trackReviewSubmit } from '../utils/analytics'
import { Send } from 'lucide-react'

const getMockReviewsKey = (shoeId) => `trailblazer_mock_reviews_${shoeId}`

const getMockReviews = (shoeId) => {
  const stored = localStorage.getItem(getMockReviewsKey(shoeId))
  return stored ? JSON.parse(stored) : []
}

const saveMockReview = (shoeId, review) => {
  const reviews = getMockReviews(shoeId)
  reviews.unshift(review)
  localStorage.setItem(getMockReviewsKey(shoeId), JSON.stringify(reviews))
}

export default function ReviewForm({ shoeId, onReviewAdded }) {
  const { user, signInWithGoogle } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    if (!user) {
      await signInWithGoogle()
      return
    }

    try {
      setLoading(true)
      
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('reviews').insert([
          {
            shoe_id: shoeId,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            user_photo: user.user_metadata?.avatar_url || null,
            content: content.trim(),
          },
        ])

        if (error) throw error
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 300))
        const newReview = {
          id: 'review-' + Date.now(),
          shoe_id: shoeId,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_photo: user.user_metadata?.avatar_url || null,
          content: content.trim(),
          created_at: new Date().toISOString(),
        }
        saveMockReview(shoeId, newReview)
      }

      setContent('')
      
      // 追蹤評論提交
      trackReviewSubmit(shoeId)
      
      // 觸發更新（延遲一點確保資料已寫入）
      setTimeout(() => {
        if (onReviewAdded) {
          onReviewAdded()
        }
      }, 500)
    } catch (error) {
      console.error('發表評論錯誤:', error)
      alert('發表評論失敗：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={user ? '寫下您的評論...' : '請先登入才能發表評論'}
            disabled={!user || loading}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={!user || !content.trim() || loading}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={18} />
          {loading ? '送出中...' : '送出'}
        </button>
      </div>
      {!user && (
        <p className="text-sm text-slate-600 mt-2">
          請先{' '}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="text-emerald-600 hover:text-emerald-700 underline"
          >
            登入
          </button>{' '}
          才能發表評論
        </p>
      )}
    </form>
  )
}

