import { useState } from 'react'
import { Upload, X, Loader2, Check } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { useAuth } from '../hooks/useAuth'

export default function FileUpload({ 
  onUploadComplete, 
  accept = 'image/*,.pdf',
  folder = 'uploads',
  maxSize = 10 * 1024 * 1024, // 10MB
  label = '上傳檔案'
}) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [error, setError] = useState('')

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 檢查檔案大小
    if (file.size > maxSize) {
      setError(`檔案大小超過限制（最大 ${maxSize / 1024 / 1024}MB）`)
      return
    }

    setError('')
    setUploading(true)
    setUploadProgress(0)

    try {
      if (isSupabaseConfigured && user) {
        // 使用 Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        // 上傳檔案
        const { data, error: uploadError } = await supabase.storage
          .from('trailblazer-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // 取得公開 URL
        const { data: { publicUrl } } = supabase.storage
          .from('trailblazer-files')
          .getPublicUrl(filePath)

        setUploadedUrl(publicUrl)
        setUploadProgress(100)
        
        if (onUploadComplete) {
          onUploadComplete(publicUrl)
        }
      } else {
        // 模擬模式：使用 FileReader 轉換為 data URL（僅限圖片）
        if (file.type.startsWith('image/')) {
          await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const dataUrl = e.target.result
              setUploadedUrl(dataUrl)
              setUploadProgress(100)
              if (onUploadComplete) {
                onUploadComplete(dataUrl)
              }
              resolve()
            }
            reader.onerror = () => {
              const error = new Error('檔案讀取失敗')
              setError(error.message)
              reject(error)
            }
            reader.readAsDataURL(file)
          })
        } else {
          throw new Error('模擬模式僅支援圖片上傳，請設定 Supabase Storage 上傳 PDF')
        }
      }
    } catch (err) {
      console.error('上傳錯誤:', err)
      setError(err.message || '上傳失敗，請重試')
      setUploadedUrl('')
    } finally {
      setUploading(false)
      // 重置 input
      e.target.value = ''
    }
  }

  const handleRemove = () => {
    setUploadedUrl('')
    setError('')
    if (onUploadComplete) {
      onUploadComplete('')
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      
      {!uploadedUrl ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-emerald-500 transition-colors">
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading || (isSupabaseConfigured && !user)}
              className="hidden"
              id={`file-upload-${folder}`}
            />
            <label
              htmlFor={`file-upload-${folder}`}
              className={`flex flex-col items-center cursor-pointer ${
                uploading || (isSupabaseConfigured && !user) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                  <p className="text-sm text-slate-600">上傳中... {uploadProgress}%</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    點擊或拖放檔案到此處
                  </p>
                  <p className="text-xs text-slate-500">
                    支援：{accept.includes('image') ? '圖片' : ''} {accept.includes('.pdf') ? 'PDF' : ''}
                    {maxSize && `（最大 ${maxSize / 1024 / 1024}MB）`}
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <Check className="w-5 h-5 text-emerald-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-900 truncate">
              上傳成功
            </p>
            <p className="text-xs text-emerald-700 truncate">
              {uploadedUrl}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
            title="移除"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!isSupabaseConfigured && (
        <p className="text-xs text-slate-500">
          ⚠️ 模擬模式：僅支援圖片預覽，PDF 請使用 Supabase Storage
        </p>
      )}

      {isSupabaseConfigured && !user && (
        <p className="text-xs text-slate-500">
          ⚠️ 請先登入才能上傳檔案
        </p>
      )}
    </div>
  )
}

