'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "المنتج",
      links: [
        { name: "الميزات", href: "#features" },
        { name: "الخطط والأسعار", href: "#plans" },
        { name: "العملاء", href: "#clients" },
        { name: "التحديثات", href: "#updates" },
        { name: "الأمان", href: "#security" }
      ]
    },
    {
      title: "الشركة",
      links: [
        { name: "من نحن", href: "#about" },
        { name: "فريق العمل", href: "#team" },
        { name: "الوظائف", href: "#careers" },
        { name: "الأخبار", href: "#news" },
        { name: "المستثمرون", href: "#investors" }
      ]
    },
    {
      title: "الدعم",
      links: [
        { name: "مركز المساعدة", href: "#help" },
        { name: "تواصل معنا", href: "#contact" },
        { name: "الدعم الفني", href: "#support" },
        { name: "التدريب", href: "#training" },
        { name: "الوثائق", href: "#docs" }
      ]
    },
    {
      title: "القانونية",
      links: [
        { name: "سياسة الخصوصية", href: "#privacy" },
        { name: "شروط الاستخدام", href: "#terms" },
        { name: "سياسة الكوكيز", href: "#cookies" },
        { name: "اتفاقية الخدمة", href: "#sla" },
        { name: "الامتثال", href: "#compliance" }
      ]
    }
  ];

  const socialLinks = [
    {
      name: "تويتر",
      href: "#twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "لينكد إن",
      href: "#linkedin",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "فيسبوك",
      href: "#facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "إنستغرام",
      href: "#instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.896.896 1.386 2.047 1.386 3.344s-.49 2.448-1.297 3.323c-.896.896-2.047 1.386-3.344 1.386zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.896-.896-1.386-2.047-1.386-3.344s.49-2.448 1.297-3.323c.896-.896 2.047-1.386 3.344-1.386s2.448.49 3.323 1.297c.896.896 1.386 2.047 1.386 3.344s-.49 2.448-1.297 3.323c-.896.896-2.047 1.386-3.344 1.386z"/>
        </svg>
      )
    },
    {
      name: "يوتيوب",
      href: "#youtube",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  const features = [
    "إدارة شاملة للأعمال",
    "تقارير تحليلية متقدمة",
    "أمان عالي المستوى",
    "دعم فني على مدار الساعة",
    "تكامل مع أنظمة متعددة",
    "واجهة سهلة الاستخدام"
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse animation-delay-200"></div>
      </div>
      
      {/* القسم الرئيسي */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* معلومات الشركة */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <Image 
                  src="/identity/primary-logo.png" 
                  alt="Business Manager Logo" 
                  width={180} 
                  height={60} 
                  className="h-12 w-auto brightness-0 invert"
                />
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              منصة إدارة الأعمال الشاملة التي تساعد الشركات على تحسين أدائها وزيادة إنتاجيتها من خلال حلول تقنية متطورة ومبتكرة.
            </p>
            
            <div className="mb-8">
              <h4 className="font-bold text-xl mb-6 text-white">✨ الميزات الرئيسية:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* روابط التواصل الاجتماعي */}
            <div>
              <h4 className="font-bold text-xl mb-6 text-white">🌐 تابعنا على:</h4>
              <div className="flex space-x-4 space-x-reverse">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-secondary rounded-2xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:shadow-lg"
                    aria-label={social.name}
                  >
                    <div className="text-gray-300 group-hover:text-white transition-colors">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* أقسام الروابط */}
          {footerSections.map((section, index) => (
            <div key={index} className="group">
              <h4 className="font-bold text-xl mb-8 text-white group-hover:text-primary transition-colors duration-300">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 text-base flex items-center group"
                    >
                      <span className="w-2 h-2 bg-primary/50 rounded-full mr-3 group-hover:bg-primary transition-colors duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* النشرة الإخبارية */}
      <div className="relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-2xl font-bold mb-4 text-white flex items-center">
                  📧 اشترك في نشرتنا الإخبارية
                </h4>
                <p className="text-gray-300 text-lg leading-relaxed">احصل على آخر التحديثات والنصائح المفيدة لإدارة أعمالك بكفاءة أكبر</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-lg"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark rounded-2xl font-bold transition-all duration-300 whitespace-nowrap text-white shadow-lg hover:shadow-xl hover:scale-105">
                  اشتراك الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات الاتصال السريع */}
      <div className="relative border-t border-white/10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex items-center justify-center md:justify-start bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">اتصل بنا</p>
                <p className="text-white font-bold text-lg">+966 50 123 4567</p>
              </div>
            </div>
            <div className="group flex items-center justify-center md:justify-start bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">راسلنا</p>
                <p className="text-white font-bold text-lg">info@businessmanager.com</p>
              </div>
            </div>
            <div className="group flex items-center justify-center md:justify-start bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">الموقع</p>
                <p className="text-white font-bold text-lg">الرياض، السعودية</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* حقوق الطبع والنشر */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-base mb-6 md:mb-0 flex items-center">
              <span className="text-2xl mr-2">©</span>
              <span>{currentYear} Business Manager. جميع الحقوق محفوظة.</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-8 text-base">
              <a href="#privacy" className="text-gray-400 hover:text-white hover:translate-y-1 transition-all duration-300 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                سياسة الخصوصية
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white hover:translate-y-1 transition-all duration-300 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                شروط الاستخدام
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-white hover:translate-y-1 transition-all duration-300 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                سياسة الكوكيز
              </a>
              <a href="#sitemap" className="text-gray-400 hover:text-white hover:translate-y-1 transition-all duration-300 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                خريطة الموقع
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;