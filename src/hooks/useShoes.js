import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { mockShoes } from '../utils/mockData'

// 使用 localStorage 儲存模擬資料（僅在未設定 Supabase 時）
const STORAGE_KEY = 'trailblazer_mock_shoes'

const getMockShoes = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : mockShoes
}

const saveMockShoes = (shoes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shoes))
}

export function useShoes() {
  const [shoes, setShoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchShoes()
  }, [])

  const fetchShoes = async () => {
    try {
      setLoading(true)
      
      if (isSupabaseConfigured) {
        // 使用真實 Supabase
        const { data, error } = await supabase
          .from('shoes')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setShoes(data || [])
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 300)) // 模擬載入延遲
        const mockData = getMockShoes()
        setShoes(mockData)
      }
    } catch (err) {
      setError(err.message)
      console.error('取得鞋款資料錯誤:', err)
      // 如果 Supabase 失敗，回退到模擬資料
      if (isSupabaseConfigured) {
        const mockData = getMockShoes()
        setShoes(mockData)
      }
    } finally {
      setLoading(false)
    }
  }

  const getShoeById = async (id) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('shoes')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 200))
        const mockData = getMockShoes()
        const shoe = mockData.find(s => s.id === id)
        if (!shoe) throw new Error('找不到此鞋款')
        return shoe
      }
    } catch (err) {
      console.error('取得鞋款詳細資料錯誤:', err)
      throw err
    }
  }

  const createShoe = async (shoeData) => {
    try {
      // 處理 product_data：如果是物件，確保正確格式
      const processedData = {
        ...shoeData,
        product_data: shoeData.product_data 
          ? (typeof shoeData.product_data === 'string' 
              ? shoeData.product_data 
              : JSON.stringify(shoeData.product_data))
          : null
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('shoes')
          .insert([processedData])
          .select()
          .single()

        if (error) throw error
        await fetchShoes()
        return data
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockData = getMockShoes()
        const newShoe = {
          ...processedData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          // 在模擬模式下，product_data 保持為物件
          product_data: typeof processedData.product_data === 'string'
            ? JSON.parse(processedData.product_data)
            : processedData.product_data
        }
        const updatedData = [newShoe, ...mockData]
        saveMockShoes(updatedData)
        setShoes(updatedData)
        return newShoe
      }
    } catch (err) {
      console.error('新增鞋款錯誤:', err)
      throw err
    }
  }

  const updateShoe = async (id, shoeData) => {
    try {
      // 處理 product_data：如果是物件，確保正確格式
      const processedData = {
        ...shoeData,
        product_data: shoeData.product_data !== undefined
          ? (typeof shoeData.product_data === 'string' 
              ? shoeData.product_data 
              : JSON.stringify(shoeData.product_data))
          : undefined
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('shoes')
          .update(processedData)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        await fetchShoes()
        return data
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockData = getMockShoes()
        const updatedData = mockData.map(shoe => {
          if (shoe.id === id) {
            const updated = { ...shoe, ...processedData }
            // 在模擬模式下，product_data 保持為物件
            if (updated.product_data && typeof updated.product_data === 'string') {
              updated.product_data = JSON.parse(updated.product_data)
            }
            return updated
          }
          return shoe
        })
        saveMockShoes(updatedData)
        setShoes(updatedData)
        return updatedData.find(s => s.id === id)
      }
    } catch (err) {
      console.error('更新鞋款錯誤:', err)
      throw err
    }
  }

  const deleteShoe = async (id) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('shoes')
          .delete()
          .eq('id', id)

        if (error) throw error
        await fetchShoes()
      } else {
        // 使用模擬資料
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockData = getMockShoes()
        const updatedData = mockData.filter(shoe => shoe.id !== id)
        saveMockShoes(updatedData)
        setShoes(updatedData)
      }
    } catch (err) {
      console.error('刪除鞋款錯誤:', err)
      throw err
    }
  }

  return {
    shoes,
    loading,
    error,
    fetchShoes,
    getShoeById,
    createShoe,
    updateShoe,
    deleteShoe,
  }
}

