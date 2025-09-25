'use client';

const OurClients = () => {
  const clients = [
    {
      name: "تك سوليوشنز",
      logo: "TS",
      industry: "تقنية المعلومات",
      testimonial: "منصة رائعة ساعدتنا على تنظيم مشاريعنا وزيادة الإنتاجية بنسبة 40%",
      author: "أحمد محمد",
      position: "مدير العمليات",
      color: "bg-primary"
    },
    {
      name: "الشركة العربية للتجارة",
      logo: "عت",
      industry: "التجارة الإلكترونية",
      testimonial: "أدوات إدارة الفريق والتقارير المتقدمة غيرت طريقة عملنا تماماً",
      author: "فاطمة أحمد",
      position: "المدير التنفيذي",
      color: "bg-secondary"
    },
    {
      name: "مجموعة الابتكار",
      logo: "ما",
      industry: "الاستشارات",
      testimonial: "الدعم الفني ممتاز والمنصة سهلة الاستخدام حتى للمبتدئين",
      author: "خالد سالم",
      position: "مدير المشاريع",
      color: "bg-green-500"
    },
    {
      name: "شركة المستقبل للتطوير",
      logo: "مت",
      industry: "التطوير العقاري",
      testimonial: "وفرنا الكثير من الوقت والمال بفضل أدوات الأتمتة الذكية",
      author: "سارة علي",
      position: "مديرة العمليات",
      color: "bg-purple-500"
    },
    {
      name: "مؤسسة الرؤية",
      logo: "مر",
      industry: "التعليم",
      testimonial: "التقارير التفصيلية ساعدتنا على اتخاذ قرارات أفضل لنمو أعمالنا",
      author: "محمد حسن",
      position: "المدير العام",
      color: "bg-blue-500"
    },
    {
      name: "شركة الإبداع الرقمي",
      logo: "إر",
      industry: "التسويق الرقمي",
      testimonial: "منصة شاملة تلبي جميع احتياجاتنا في إدارة العملاء والمشاريع",
      author: "نور الدين",
      position: "مدير التسويق",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { number: "500+", label: "شركة تثق بنا" },
    { number: "10K+", label: "مستخدم نشط" },
    { number: "98%", label: "معدل الرضا" },
    { number: "24/7", label: "دعم فني" }
  ];

  return (
    <section id="clients" className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            🤝 شهادات العملاء
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            عملاؤنا
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              يثقون بنا
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            انضم إلى مئات الشركات الناجحة التي اختارت منصتنا لإدارة أعمالها وتحقيق أهدافها بكفاءة وفعالية
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold text-lg">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* شبكة العملاء */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/30 hover:border-primary/20 relative overflow-hidden"
            >
              {/* تأثير الخلفية عند التمرير */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* معلومات الشركة */}
              <div className="relative flex items-center mb-8">
                <div className={`w-16 h-16 ${client.color} text-white rounded-2xl flex items-center justify-center font-bold text-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {client.logo}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors duration-300">{client.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{client.industry}</p>
                </div>
              </div>

              {/* التقييم */}
              <div className="relative mb-8">
                <div className="flex text-yellow-400 mb-4 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 mx-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20" style={{animationDelay: `${i * 100}ms`}}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="relative">
                  <svg className="absolute top-0 right-0 w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                  <p className="text-gray-700 leading-relaxed text-lg italic mb-6 pr-10">
                    "{client.testimonial}"
                  </p>
                </div>
              </div>

              {/* معلومات المؤلف */}
              <div className="relative border-t border-gray-200/50 pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-bold text-lg">{client.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{client.author}</p>
                    <p className="text-sm text-gray-500 font-medium">{client.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* قسم الشعارات */}
        <div className="text-center mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            شركات رائدة تثق بنا
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {clients.map((client, index) => (
              <div key={index} className="group flex items-center justify-center">
                <div className={`w-20 h-20 ${client.color} text-white rounded-3xl flex items-center justify-center font-bold text-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 opacity-70 hover:opacity-100`}>
                  {client.logo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* دعوة للعمل */}
        <div className="text-center">
          <div className="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-4xl p-16 shadow-2xl border border-white/50 overflow-hidden">
            {/* خلفية زخرفية */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-6 py-3 rounded-full text-sm font-bold mb-8">
                🚀 ابدأ رحلتك معنا
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                انضم إلى عملائنا الناجحين
              </h3>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                ابدأ رحلتك معنا اليوم واكتشف كيف يمكن لمنصتنا أن تحول طريقة إدارة أعمالك وتحقق أهدافك بكفاءة عالية
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  🎯 ابدأ التجربة المجانية
                </button>
                <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  💬 تحدث مع مستشار
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurClients;