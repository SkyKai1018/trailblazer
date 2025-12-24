import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'

const MOCK_USER_KEY = 'trailblazer_mock_user'

const getMockUser = () => {
  const stored = localStorage.getItem(MOCK_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

const saveMockUser = (user) => {
  if (user) {
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(MOCK_USER_KEY)
  }
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 使用真實 Supabase
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user)
        setLoading(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      // 使用模擬模式
      const mockUser = getMockUser()
      setUser(mockUser)
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) {
        console.error('登入錯誤:', error)
        throw error
      }
    } else {
      // 模擬登入
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        email: 'demo@example.com',
        user_metadata: {
          full_name: '示範使用者',
          avatar_url: null,
        },
      }
      saveMockUser(mockUser)
      setUser(mockUser)
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('登出錯誤:', error)
        throw error
      }
    } else {
      // 模擬登出
      saveMockUser(null)
      setUser(null)
    }
  }

  const isAdmin = () => {
    // 目前綁定於登入狀態，實務上可綁定特定 Email
    // 在模擬模式下，登入後即為管理員
    return user !== null
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAdmin: isAdmin(),
  }
}

