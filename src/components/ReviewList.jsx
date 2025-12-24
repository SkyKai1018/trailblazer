import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { User } from 'lucide-react'
import { mockReviews } from '../utils/mockData'

const getMockReviewsKey = (shoeId) => `trailblazer_mock_reviews_${shoeId}`

const getMockReviews = (shoeId) => {
  const stored = localStorage.getItem(getMockReviewsKey(shoeId))
  if (stored) {
    return JSON.parse(stored)
  }
  // 如果沒有儲存的資料，使用預設模擬資料
  return mockReviews[shoeId] || []
}

const saveMockReviews = (shoeId, reviews) => {
  localStorage.setItem(getMockReviewsKey(shoeId), JSON.stringify(reviews))
}

export default function ReviewList({ shoeId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('shoe_id', shoeId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setReviews(data || [])
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 200))
        const mockData = getMockReviews(shoeId)
        setReviews(mockData)
      }
    } catch (error) {
      console.error('取得評論錯誤:', error)
      // 如果 Supabase 失敗，回退到模擬資料
      if (isSupabaseConfigured) {
        const mockData = getMockReviews(shoeId)
        setReviews(mockData)
      }
    } finally {
      setLoading(false)
    }
  }, [shoeId])

  useEffect(() => {
    fetchReviews()

    if (isSupabaseConfigured) {
      // 訂閱即時更新
      const channel = supabase
        .channel(`reviews:${shoeId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reviews',
            filter: `shoe_id=eq.${shoeId}`,
          },
          () => {
            // 延遲一點確保資料已寫入
            setTimeout(() => {
              fetchReviews()
            }, 300)
          }
        )
        .subscribe()

      // 同時監聽自訂事件（作為備用方案）
      const handleReviewAdded = () => {
        setTimeout(() => {
          fetchReviews()
        }, 500)
      }
      window.addEventListener('reviewAdded', handleReviewAdded)

      return () => {
        supabase.removeChannel(channel)
        window.removeEventListener('reviewAdded', handleReviewAdded)
      }
    } else {
      // 在模擬模式下，監聽自訂事件來更新評論
      const handleReviewAdded = () => {
        setTimeout(() => {
          fetchReviews()
        }, 300)
      }
      window.addEventListener('reviewAdded', handleReviewAdded)
      return () => {
        window.removeEventListener('reviewAdded', handleReviewAdded)
      }
    }
  }, [shoeId, fetchReviews])

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <p className="text-slate-600">載入評論中...</p>
  }

  if (reviews.length === 0) {
    return <p className="text-slate-600">尚無評論</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            {review.user_photo ? (
              <img
                src={review.user_photo}
                alt={review.user_name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={20} className="text-slate-500" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-900">
                  {review.user_name}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">
                {review.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

