'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    "احنا نفكر",
    "احنا نبدع", 
    "احنا نخطط",
    "احنا ندير"
  ];

  // صور العرض - يمكن استبدالها بصور حقيقية
  const slides = [
    {
      id: 1,
      title: "إدارة المشاريع بذكاء",
      description: "نظم مشاريعك وتابع تقدمها بسهولة",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-blue-600/80 to-purple-600/80"
    },
    {
      id: 2,
      title: "فريق عمل متناغم",
      description: "تواصل مع فريقك وحقق أهدافكم معاً",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-green-600/80 to-teal-600/80"
    },
    {
      id: 3,
      title: "تحليلات متقدمة",
      description: "اتخذ قرارات مدروسة بناءً على البيانات",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-orange-600/80 to-red-600/80"
    },
    {
      id: 4,
      title: "أمان وموثوقية",
      description: "بياناتك محمية بأعلى معايير الأمان",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      gradient: "from-indigo-600/80 to-blue-600/80"
    }
  ];

  // تأثير الكتابة المتحركة
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 80 : 150;
    const pauseTime = isDeleting ? 1000 : 3000;

    const timer = setTimeout(() => {
      if (!isDeleting && typingText === currentPhrase) {
        // انتهى من الكتابة، ابدأ المسح بعد توقف
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typingText === '') {
        // انتهى من المسح، انتقل للجملة التالية
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else if (isDeleting) {
        // مسح الأحرف
        setTypingText(currentPhrase.substring(0, typingText.length - 1));
      } else {
        // كتابة الأحرف
        setTypingText(currentPhrase.substring(0, typingText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingText, currentPhraseIndex, isDeleting, phrases]);

  // التنقل التلقائي بين الصور
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* صور العرض */}
      <div className="relative w-full h-screen">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* صورة الخلفية */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* طبقة التدرج */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
            
            {/* المحتوى */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                {/* النص المتحرك الثابت */}
                <div className="mb-8">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight">
                    <span className="typing-text">
                      {typingText}
                      <span className="typing-cursor animate-pulse">|</span>
                    </span>
                  </h1>
                </div>
                

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* أزرار التنقل */}
      <button
        onClick={prevSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="الصورة السابقة"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="الصورة التالية"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* مؤشرات الصور */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`انتقل إلى الصورة ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;