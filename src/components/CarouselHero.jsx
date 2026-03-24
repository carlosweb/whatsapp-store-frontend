import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';

export default function CarouselHero() {
  const { heroSlides } = useCarousel();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [heroSlides]);

  if (!heroSlides || heroSlides.length === 0) {
    // Fallback to the original text-based hero if no slides are uploaded
    return (
      <section className="pt-32 pb-16 sm:pt-48 sm:pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto animate-[slideUp_0.8s_ease]">
          <h2 className="text-5xl sm:text-7xl font-black text-black dark:text-white leading-[1.05] tracking-tighter mb-6">
            {t('hero_title_1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#FF8A00]">{t('hero_title_highlight')}</span>
            <br className="hidden sm:block" />
            {t('hero_title_2')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>
    );
  }

  const nextSlide = () => setActiveIndex((idx) => (idx + 1) % heroSlides.length);
  const prevSlide = () => setActiveIndex((idx) => (idx - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative w-full h-[60vh] sm:h-[80vh] overflow-hidden bg-black group">
      {heroSlides.map((slide, index) => {
        const isActive = index === activeIndex;
        const hasText = slide.title || slide.subtitle || slide.ctaText;
        
        return (
          <div 
            key={slide.id} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {/* Image with Ken Burns effect when active */}
            <div className={`absolute inset-0 w-full h-full ${isActive ? 'animate-[kenBurns_10s_ease-out_forwards]' : ''}`}>
               <img 
                 src={slide.imageUrl} 
                 alt={slide.title || 'Hero Image'} 
                 loading={index === 0 ? "eager" : "lazy"}
                 className="w-full h-full object-cover" 
               />
            </div>
            
            {/* Overlay and Text for Variation A */}
            {hasText && (
              <div className="absolute inset-0 w-full h-full bg-black/40 flex flex-col items-center justify-center px-6 text-center">
                <div className={`transform transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  {slide.title && (
                    <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-4 drop-shadow-2xl">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-lg sm:text-2xl text-white/90 font-medium max-w-2xl mx-auto mb-8 drop-shadow-lg">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.ctaText && (
                    <a 
                      href={slide.ctaUrl || '#'} 
                      className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-transform shadow-xl"
                    >
                      {slide.ctaText}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm opacity-0 group-[&:hover]:opacity-100 transition-opacity hover:bg-black/40 focus:outline-none"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white backdrop-blur-sm opacity-0 group-[&:hover]:opacity-100 transition-opacity hover:bg-black/40 focus:outline-none"
          >
            <ChevronRight size={32} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none shadow-sm ${idx === activeIndex ? 'bg-white scale-125 w-8' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
