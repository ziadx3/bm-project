'use client';

import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال النموذج
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // إعادة تعيين حالة النجاح بعد 3 ثوان
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "اتصل بنا",
      details: ["+966 50 123 4567", "+966 11 234 5678"],
      color: "text-primary bg-primary/10"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "راسلنا",
      details: ["info@businessmanager.com", "support@businessmanager.com"],
      color: "text-secondary bg-secondary/10"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "زورنا",
      details: ["الرياض، المملكة العربية السعودية", "حي الملك فهد، طريق الملك عبدالعزيز"],
      color: "text-green-600 bg-green-100"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "ساعات العمل",
      details: ["الأحد - الخميس: 9:00 ص - 6:00 م", "الجمعة - السبت: مغلق"],
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const subjects = [
    "استفسار عام",
    "طلب عرض سعر",
    "الدعم الفني",
    "شراكة تجارية",
    "شكوى أو اقتراح",
    "أخرى"
  ];

  return (
    <section id="contact" className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            📞 تواصل معنا
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            تواصل معنا
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              نحن هنا لمساعدتك
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            لديك سؤال أو تحتاج مساعدة؟ فريقنا المتخصص جاهز للرد على استفساراتك وتقديم أفضل الحلول المبتكرة لأعمالك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* معلومات الاتصال */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
              <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">معلومات الاتصال</h3>
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group flex items-start hover:bg-gray-50/50 p-4 rounded-2xl transition-all duration-300">
                    <div className={`flex-shrink-0 w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-primary transition-colors duration-300">{info.title}</h4>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600 mb-2 text-lg leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
             </div>

             {/* خريطة وهمية */}
             <div className="mt-10">
               <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl h-72 flex items-center justify-center shadow-inner border border-gray-200/50 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                 <div className="relative text-center">
                   <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                   </div>
                   <p className="text-gray-600 font-semibold text-lg">📍 خريطة الموقع</p>
                   <p className="text-gray-500 text-sm mt-2">الرياض، المملكة العربية السعودية</p>
                 </div>
               </div>
             </div>
           </div>

          {/* نموذج الاتصال */}
          <div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
              <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">أرسل لنا رسالة</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-700 font-medium">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-3 group-focus-within:text-primary transition-colors duration-300">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-3 group-focus-within:text-primary transition-colors duration-300">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="company" className="block text-lg font-semibold text-gray-800 mb-3 group-focus-within:text-primary transition-colors duration-300">
                    اسم الشركة
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                    placeholder="أدخل اسم شركتك"
                  />
                </div>
                <div className="group">
                  <label htmlFor="phone" className="block text-lg font-semibold text-gray-800 mb-3 group-focus-within:text-primary transition-colors duration-300">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="subject" className="block text-lg font-semibold text-gray-800 mb-3 group-focus-within:text-primary transition-colors duration-300">
                  موضوع الرسالة *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg bg-gray-50/50 hover:bg-white"
                >
                  <option value="">اختر موضوع الرسالة</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-lg font-semibold text-gray-800 mb-3 group-focus-within:text-primary transition-colors duration-300">
                  الرسالة *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none text-lg bg-gray-50/50 hover:bg-white"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 px-8 rounded-2xl text-xl font-bold transition-all duration-300 shadow-lg ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark transform hover:scale-105 hover:shadow-xl'
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال الرسالة'
                )}
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;