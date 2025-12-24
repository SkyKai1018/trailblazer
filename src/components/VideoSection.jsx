import { Play } from 'lucide-react'
import { useState, useRef } from 'react'

export default function VideoSection({ videoUrl, title = '鞋子介紹影片' }) {
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef(null)

  if (!videoUrl) {
    return null
  }

  // 判斷是 YouTube 連結還是本地影片
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isLocalVideo = videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.mov')

  if (showVideo) {
    if (isYouTube) {
      // YouTube 影片
      let embedUrl = videoUrl
      if (videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.split('/').pop().split('?')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (videoUrl.includes('watch?v=')) {
        const videoId = videoUrl.split('v=')[1].split('&')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }

      return (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )
    } else if (isLocalVideo) {
      // 本地影片檔案
      return (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 shadow-lg">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full"
              onError={(e) => {
                console.error('影片載入錯誤:', e)
                alert('無法載入影片，請確認檔案路徑正確')
              }}
            >
              您的瀏覽器不支援影片播放
            </video>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <div
        className="aspect-video rounded-lg bg-slate-900 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors relative overflow-hidden group shadow-lg"
        onClick={() => setShowVideo(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
          <p className="text-white text-sm">點擊播放{isLocalVideo ? '影片' : '評測影片'}</p>
        </div>
      </div>
    </div>
  )
}

