'use client';

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "تحليلات متقدمة",
      description: "احصل على رؤى عميقة حول أداء أعمالك مع تقارير تفاعلية ولوحات معلومات شاملة",
      color: "primary"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "إدارة الفريق",
      description: "نظم فريقك وتابع مهامهم وتقدمهم في الوقت الفعلي مع أدوات التعاون المتقدمة",
      color: "secondary"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "أمان متقدم",
      description: "حماية بيانات عملك بأعلى معايير الأمان مع التشفير والنسخ الاحتياطي التلقائي",
      color: "success"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "أتمتة المهام",
      description: "وفر الوقت والجهد مع أدوات الأتمتة الذكية التي تتولى المهام المتكررة",
      color: "warning"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      title: "تقارير ذكية",
      description: "تقارير تلقائية مفصلة تساعدك على اتخاذ قرارات مدروسة لنمو أعمالك",
      color: "info"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "تطبيق محمول",
      description: "إدارة أعمالك من أي مكان مع تطبيقنا المحمول المتاح على جميع الأجهزة",
      color: "secondary"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: "text-primary bg-primary/10",
      secondary: "text-secondary bg-secondary/10",
      success: "text-green-600 bg-green-100",
      warning: "text-yellow-600 bg-yellow-100",
      info: "text-blue-600 bg-blue-100"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            ✨ ميزات متطورة
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            ميزات تجعل إدارة أعمالك
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              أسهل وأكثر فعالية
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            اكتشف مجموعة شاملة من الأدوات والميزات المصممة خصيصاً لتلبية احتياجات أعمالك وتحقيق أهدافك بكفاءة عالية
          </p>
        </div>

        {/* شبكة الميزات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-primary/20 overflow-hidden"
            >
              {/* تأثير الخلفية عند التمرير */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* الأيقونة */}
              <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
                {/* تأثير الإضاءة */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* العنوان */}
              <h3 className="relative text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              {/* الوصف */}
              <p className="relative text-gray-600 leading-relaxed text-lg">
                {feature.description}
              </p>
              
              {/* خط زخرفي */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>

        {/* قسم إضافي */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              جاهز لتجربة الفرق؟
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف الشركات التي تستخدم منصتنا لإدارة أعمالها بكفاءة أكبر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                ابدأ التجربة المجانية
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300">
                تحدث مع خبير
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;