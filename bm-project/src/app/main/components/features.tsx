'use client';

const Features = () => {
  const features = [
    { icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h8" /></svg>
    ), title: "نشر وظائف بسهولة", description: "إنشاء ونشر فرص عمل مع تفاصيل واضحة", color: "primary" },
    { icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    ), title: "التقديم السريع", description: "تقديم الباحثين على الوظائف بملفهم وبياناتهم", color: "secondary" },
    { icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 1.343 3 3v5H9v-5c0-1.657 1.343-3 3-3z" /></svg>
    ), title: "برامج تدريب", description: "نشر وتسجيل في البرامج التدريبية", color: "success" },
    { icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" /></svg>
    ), title: "إشعارات فورية", description: "تنبيهات بالطلبات والقبول والرفض", color: "warning" },
    { icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 10h12M8 13h8" /></svg>
    ), title: "لوحة للشركات", description: "إدارة الوظائف والمتقدمين بسهولة", color: "info" },
    { icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5V9" /></svg>
    ), title: "ملف الباحث", description: "عرض المهارات والسيرة وروابط الملف", color: "secondary" }
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
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">دليل سريع</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">كل ما تحتاجه للتوظيف والتدريب</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">منصة تربط الشركات بالباحثين، تنشر وظائف وبرامج وتسهّل التقديم والمتابعة</p>
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

        
      </div>
    </section>
  );
};

export default Features;