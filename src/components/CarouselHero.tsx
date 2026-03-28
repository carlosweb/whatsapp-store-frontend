import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MonitorSmartphone, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCarousel, useConfig } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';

export default function CarouselHero() {
  const { heroSlides } = useCarousel();
  const { config } = useConfig();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [heroSlides]);

  const nextSlide = () => setActiveIndex((idx) => (idx + 1) % heroSlides.length);
  const prevSlide = () => setActiveIndex((idx) => (idx - 1 + heroSlides.length) % heroSlides.length);

  // If no slides, use the translations to create a default split layout hero
  const slidesToRender = (!heroSlides || heroSlides.length === 0) ? [{
    id: 'default',
    title: `${t('hero_title_1')} ${t('hero_title_highlight')} ${t('hero_title_2')}`,
    subtitle: t('hero_subtitle'),
    ctaText: 'Check Schedule', // Matching reference image button text conceptually to look good
    ctaUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop'
  }] : heroSlides;

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 flex items-center min-h-[100svh] pt-16">
      {/* 
        Background Decorative Tracks replacing the yellow reference image background elements
      */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] -z-10 overflow-hidden hidden lg:block">
         <div className="absolute top-[10%] -right-[10%] w-[120%] h-32 bg-[var(--color-primary)] opacity-10 rounded-full dark:opacity-5" />
         <div className="absolute top-[35%] -right-[20%] w-[140%] h-48 bg-[var(--color-primary)] opacity-15 rounded-full dark:opacity-10" />
         <div className="absolute top-[65%] right-[5%] w-[80%] h-24 bg-[var(--color-primary)] opacity-[0.08] rounded-full dark:opacity-[0.03]" />
         <div className="absolute bottom-[5%] -right-[5%] w-[110%] h-32 bg-[var(--color-primary)] opacity-10 rounded-full dark:opacity-5" />
      </div>

      {slidesToRender.map((slide, index) => {
        const isActive = index === activeIndex;
        // The title in default has a big break in reference
        
        return (
          <div 
            key={slide.id} 
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center ${isActive ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 pointer-events-none translate-x-8'}`}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full h-full flex flex-col lg:flex-row items-center justify-center pt-8 pb-16 gap-8 lg:gap-16">
              
              {/* Left Column (Text) */}
              <div className="w-full lg:w-[50%] z-20 flex flex-col justify-center text-center lg:text-left mt-8 lg:mt-0">
                
                <h3 className="text-[var(--color-primary)] font-extrabold tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 sm:mb-6 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                   <span className="w-12 h-0.5 bg-[var(--color-primary)] hidden sm:block"></span>
                   {config.businessName ? `${config.businessName} PRESENTS` : 'THE FASTER THE BETTER'}
                </h3>

                <h2 className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-black text-gray-900 dark:text-white leading-[1.05] tracking-tighter mb-6 sm:mb-8 text-balance uppercase">
                  {slide.title || 'FAST, SAFE, AND SECURE DELIVERY'}
                </h2>
                
                <p className="text-lg sm:text-xl text-gray-500 dark:text-zinc-400 font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
                  {slide.subtitle || 'Entrust the delivery of your packages to our premium team who have more than ten years experience in the field of delivery services'}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-12 lg:mb-16">
                   {slide.ctaText && (
                     <a 
                       href={slide.ctaUrl || '#'} 
                       className="w-full sm:w-auto bg-[#FFC53D] hover:bg-[#F2B325] text-black px-8 py-4 sm:py-5 rounded-full text-base sm:text-lg font-extrabold shadow-xl shadow-[#FFC53D]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                       style={{ backgroundColor: 'var(--color-primary)', color: '#fff', boxShadow: '0 10px 20px -5px var(--color-primary)' }}
                     >
                       {slide.ctaText}
                     </a>
                   )}

                </div>

                {/* Features inline list at the bottom matching reference */}
                <div className="hidden sm:flex items-center justify-center lg:justify-start gap-6 xl:gap-12 mt-auto pt-8 flex-wrap">
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                       <MonitorSmartphone size={20} className="stroke-[2.5]" />
                     </div>
                     <span className="font-bold text-sm text-gray-800 dark:text-zinc-200">Customer-driven</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-xl">
                       <Clock size={20} className="stroke-[2.5]" />
                     </div>
                     <span className="font-bold text-sm text-gray-800 dark:text-zinc-200">Time-bound</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                       <ShieldCheck size={20} className="stroke-[2.5]" />
                     </div>
                     <span className="font-bold text-sm text-gray-800 dark:text-zinc-200">Safety</span>
                   </div>
                </div>

              </div>

              {/* Right Column (Image + Shapes) */}
              <div className="w-full lg:w-[50%] relative flex justify-center lg:justify-end items-center h-[350px] sm:h-[450px] lg:h-auto min-h-[400px] mt-4 lg:mt-0">
                 
                 {/* Decorative Circle Behind */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[120%] max-w-[500px] aspect-square bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 rounded-full blur-2xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{animationDuration: '4s'}} />
                 
                 {/* Main Image */}
                 <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square lg:aspect-[4/5] z-10 mx-auto lg:mr-0">
                   <img 
                     src={slide.imageUrl || 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2000&auto=format&fit=crop'} 
                     alt={slide.title || 'Hero'} 
                     loading={index === 0 ? "eager" : "lazy"}
                     // We use object-contain here because the user reference features a heavily masked/transparent image. 
                     // But if they upload a regular photo, object-cover with heavy rounded corners looks best. Let's use object-cover + rounded corners.
                     className={`w-full h-full object-cover rounded-[3rem] shadow-2xl dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] border-[8px] sm:border-[12px] border-white dark:border-zinc-900 ${isActive ? 'animate-[slideUp_1.5s_ease-out_forwards]' : ''}`} 
                   />

                   {/* Floating Elements mimicking the reference graphic */}
                   <div className="absolute -left-6 sm:-left-12 top-[15%] bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl flex items-center gap-4 animate-[bounce_4s_ease-in-out_infinite] z-20 border border-gray-100 dark:border-white/5">
                      <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] p-3 rounded-xl border border-[var(--color-primary)]/20"><MonitorSmartphone size={24} className="stroke-[2.5]" /></div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-tight">Fast Orders</div>
                        <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">1-Click Checkout</div>
                      </div>
                   </div>

                   <div className="absolute -right-4 sm:-right-8 bottom-[15%] bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl flex items-center gap-4 animate-[bounce_5s_ease-in-out_infinite_reverse] z-20 border border-gray-100 dark:border-white/5">
                      <div className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 p-3 rounded-xl"><ShieldCheck size={24} className="stroke-[2.5]" /></div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-tight">Secure Pay</div>
                        <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">End-to-End</div>
                      </div>
                   </div>
                 </div>

              </div>

            </div>
          </div>
        );
      })}

      {/* Navigation Arrows for Multiple Slides */}
      {slidesToRender.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white/70 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-black dark:text-white backdrop-blur-md opacity-0 hover:opacity-100 md:group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-black hover:scale-110 shadow-lg focus:outline-none hidden sm:block group"
          >
            <ChevronLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white/70 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-black dark:text-white backdrop-blur-md opacity-0 hover:opacity-100 md:group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-black hover:scale-110 shadow-lg focus:outline-none hidden sm:block group"
          >
            <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-3 rounded-full border border-gray-200/50 dark:border-white/10">
            {slidesToRender.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ease-out focus:outline-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${idx === activeIndex ? 'bg-[var(--color-primary)] w-8 scale-110' : 'w-2.5 bg-gray-400 dark:bg-zinc-600 hover:bg-[var(--color-primary)]/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
