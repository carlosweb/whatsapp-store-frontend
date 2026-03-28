import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Carousel({ images, title, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  
  const validImages = images?.filter(Boolean) || [];
  if (validImages.length === 0) validImages.push('');

  const scrollTo = (index) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    setCurrentIndex(index);
  };

  const handleScroll = (e) => {
    const width = e.target.offsetWidth;
    const index = Math.round(e.target.scrollLeft / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative pt-[80%] bg-[#F9F9F9] dark:bg-zinc-800 group rounded-t-[32px] sm:rounded-[32px] overflow-hidden">
      <div 
        ref={scrollRef}
        className="absolute inset-0 w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {validImages.map((img, i) => (
          <div key={i} className="w-full h-full flex-shrink-0 snap-center relative">
            <img src={img} alt={`${title} image ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-5 right-5 z-20 bg-white/90 dark:bg-black/50 backdrop-blur text-black dark:text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all focus:outline-none"
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      {/* Nav Buttons (Desktop only mostly) */}
      {validImages.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); scrollTo(Math.max(0, currentIndex - 1)); }}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/50 backdrop-blur text-black dark:text-white p-2 rounded-full shadow-md transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 focus:outline-none hover:bg-white dark:hover:bg-black/80 ${currentIndex === 0 ? 'hidden' : 'block'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); scrollTo(Math.min(validImages.length - 1, currentIndex + 1)); }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/50 backdrop-blur text-black dark:text-white p-2 rounded-full shadow-md transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 focus:outline-none hover:bg-white dark:hover:bg-black/80 ${currentIndex === validImages.length - 1 ? 'hidden' : 'block'}`}
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
            {validImages.map((_, i) => (
              <button 
                key={i}
                onClick={(e) => { e.stopPropagation(); scrollTo(i); }}
                className={`transition-all duration-300 rounded-full shadow-sm focus:outline-none ${i === currentIndex ? 'w-5 h-1.5 opacity-100 bg-white' : 'w-1.5 h-1.5 opacity-70 hover:opacity-100 bg-white'}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Hide scrollbar CSS injection */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
}
