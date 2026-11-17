'use client'

import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface RoomGalleryProps {
  images: string[]
  roomTitle: string
}

export function RoomGallery({ images, roomTitle }: RoomGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const validImages = images.filter(Boolean)

  if (validImages.length === 0) {
    return (
      <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Sin imágenes disponibles</div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
      <div className="relative w-full h-full">
        <div
          ref={emblaRef}
          className="w-full h-full overflow-hidden"
        >
          <div className="flex w-full h-full">
            {validImages.map((img, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-full h-full transition-opacity duration-300 ${
                  i === selectedIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt={`${roomTitle} imagen ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="mt-3 flex gap-2 justify-center">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                emblaApi?.scrollTo(i)
                setSelectedIndex(i)
              }}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === selectedIndex
                  ? 'border-teal-600 scale-105'
                  : 'border-transparent hover:border-teal-200'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}