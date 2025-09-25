'use client';

import { useState } from 'react';

const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "المبتدئ",
      description: "مثالي للشركات الناشئة والفرق الصغيرة",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "حتى 5 مستخدمين",
        "10 مشاريع",
        "تخزين 10 جيجا",
        "دعم عبر البريد الإلكتروني",
        "تقارير أساسية",
        "تطبيق محمول"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "المحترف",
      description: "الأفضل للشركات المتنامية والفرق المتوسطة",
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        "حتى 25 مستخدم",
        "مشاريع غير محدودة",
        "تخزين 100 جيجا",
        "دعم أولوية 24/7",
        "تقارير متقدمة",
        "أتمتة المهام",
        "تكامل مع التطبيقات",
        "نسخ احتياطي يومي"
      ],
      popular: true,
      color: "border-primary"
    },
    {
      name: "المؤسسي",
      description: "للشركات الكبيرة والمؤسسات",
      monthlyPrice: 149,
      annualPrice: 1490,
      features: [
        "مستخدمين غير محدود",
        "مشاريع غير محدودة",
        "تخزين غير محدود",
        "مدير حساب مخصص",
        "تحليلات مخصصة",
        "أمان متقدم",
        "تدريب مخصص",
        "SLA مضمون",
        "تكامل مخصص"
      ],
      popular: false,
      color: "border-secondary"
    }
  ];

  return (
    <section id="plans" className="py-24 bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-20 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
            💎 خطط مرنة ومناسبة
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            خطط تناسب جميع
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              احتياجات أعمالك
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            اختر الخطة المناسبة لك واستمتع بجميع الميزات مع إمكانية الترقية في أي وقت. جميع الخطط تشمل دعم فني مجاني
          </p>

          {/* مفتاح التبديل بين الشهري والسنوي */}
          <div className="flex items-center justify-center mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-100/50">
              <div className="flex items-center space-x-reverse space-x-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    !isAnnual 
                      ? 'bg-primary text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  شهري
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 relative ${
                    isAnnual 
                      ? 'bg-primary text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  سنوي
                  {isAnnual && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      وفر 20%
                    </span>
                  )}
                </button>
              </div>
            </div>
            {!isAnnual && (
              <div className="mr-4 text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                💡 اختر السنوي ووفر 20%
              </div>
            )}
          </div>
        </div>

        {/* شبكة الخطط */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 ${plan.color} ${plan.popular ? 'transform scale-105 ring-4 ring-primary/20' : ''} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}
            >
              {/* تأثير الخلفية المتدرجة */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-primary/5 to-secondary/5' 
                  : 'bg-gradient-to-br from-gray-50/50 to-white/50'
              }`}></div>
              
              {/* شارة الأكثر شعبية */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    ⭐ الأكثر شعبية
                  </span>
                </div>
              )}

              <div className="relative p-10">
                {/* اسم الخطة */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">{plan.name}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{plan.description}</p>
                </div>

                {/* السعر */}
                <div className="text-center mb-10">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 mr-2 text-xl">
                      /{isAnnual ? 'سنة' : 'شهر'}
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full inline-block">
                      ${Math.round(plan.annualPrice / 12)}/شهر عند الدفع سنوياً
                    </p>
                  )}
                </div>

                {/* زر الاشتراك */}
                <button
                  className={`w-full py-5 px-8 rounded-2xl text-lg font-bold transition-all duration-300 mb-10 shadow-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white transform hover:scale-105 hover:shadow-xl'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {plan.popular ? '🚀 ابدأ الآن' : '✨ اختر هذه الخطة'}
                </button>

                {/* قائمة الميزات */}
                <div className="space-y-5">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center group/feature">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center ml-4 flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg group-hover/feature:text-gray-900 transition-colors duration-300">{feature}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* قسم الأسئلة الشائعة */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            أسئلة شائعة حول الخطط
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-right">
              <h4 className="font-semibold text-gray-900 mb-2">هل يمكنني تغيير خطتي لاحقاً؟</h4>
              <p className="text-gray-600">نعم، يمكنك الترقية أو التراجع في أي وقت دون أي رسوم إضافية.</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-gray-900 mb-2">هل هناك فترة تجريبية مجانية؟</h4>
              <p className="text-gray-600">نعم، نوفر فترة تجريبية مجانية لمدة 14 يوم لجميع الخطط.</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-gray-900 mb-2">ما هي طرق الدفع المتاحة؟</h4>
              <p className="text-gray-600">نقبل جميع البطاقات الائتمانية الرئيسية والتحويل البنكي.</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-gray-900 mb-2">هل يمكنني إلغاء اشتراكي في أي وقت؟</h4>
              <p className="text-gray-600">نعم، يمكنك إلغاء اشتراكك في أي وقت دون أي التزامات طويلة المدى.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;