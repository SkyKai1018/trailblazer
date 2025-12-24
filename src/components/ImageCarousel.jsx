import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PLACEHOLDER_IMAGE } from '../utils/constants'

export default function ImageCarousel({ imageUrl }) {
  // 目前使用單一圖片，未來可擴充為多圖輪播
  const images = imageUrl ? [imageUrl] : [PLACEHOLDER_IMAGE]
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
        <img
          src={images[currentIndex]}
          alt="Shoe"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            aria-label="上一張"
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            aria-label="下一張"
          >
            <ChevronRight size={20} className="text-slate-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`圖片 ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

