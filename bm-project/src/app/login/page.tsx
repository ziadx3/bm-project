'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const { login, role, refreshRole, error, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userType, setUserType] = useState<'jobSeeker' | 'company'>('jobSeeker');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الأخطاء عند الكتابة
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    // التحقق من البريد الإلكتروني
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      const uid = auth.currentUser?.uid;
      let r: 'company' | 'admin' | 'jobSeeker' = 'jobSeeker';
      if (uid) {
        const snap = await getDoc(doc(db, 'users', uid));
        const data = snap.data() as { role?: 'company' | 'admin' | 'jobSeeker' } | undefined;
        r = (data?.role || 'jobSeeker');
      }
      if (r !== userType && r !== 'admin') {
        setAuthError('نوع الحساب المختار لا يطابق دور حسابك. الرجاء اختيار النوع الصحيح.');
        await logout();
        return;
      }
      if (r === 'company') {
        if (typeof window !== 'undefined') window.localStorage.setItem('bm_role', 'company');
        router.push('/dashboard/company');
      } else if (r === 'admin') {
        if (typeof window !== 'undefined') window.localStorage.setItem('bm_role', 'admin');
        router.push('/dashboard/admin');
      } else {
        if (typeof window !== 'undefined') window.localStorage.setItem('bm_role', 'jobSeeker');
        router.push('/dashboard/seeker');
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      const code = error?.code || ''
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found') {
        setAuthError('تهيئة Firebase غير صحيحة. تأكد من مفاتيح .env.local وتمكين Email/Password.');
      } else {
        setAuthError(error?.message || 'تعذّر تسجيل الدخول.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* الشعار والعنوان */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <Image 
              src="/identity/primary-logo.png" 
              alt="Business Manager Logo" 
              width={200} 
              height={80} 
              className="h-20 w-auto mx-auto"
              priority
            />
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            مرحباً بعودتك
          </h2>
          <p className="text-lg text-gray-600">
            سجل دخولك للوصول إلى حسابك
          </p>
        </div>

        {/* رسائل */}
        {authError || error ? (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-right">{authError || error}</div>
        ) : null}
        {/* نموذج تسجيل الدخول */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">نوع الحساب</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('jobSeeker')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    userType === 'jobSeeker' ? 'bg-primary/10 border-primary text-gray-900 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z"/></svg>
                  باحث عن عمل
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    userType === 'company' ? 'bg-secondary/10 border-secondary text-gray-900 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V10z"/></svg>
                  شركة
                </button>
              </div>
            </div>
            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="أدخل بريدك الإلكتروني"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* كلمة المرور */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-4 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* خيارات إضافية */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
                  تذكرني
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 text-lg font-bold rounded-xl text-white bg-primary bg-gradient-to-r from-primary to-secondary shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-white group-hover:text-white/80" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* رابط إنشاء حساب جديد */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">ليس لديك حساب؟</p>
            <Link href="/signup" className="inline-block text-white px-6 py-3 rounded-xl font-bold bg-primary bg-gradient-to-r from-primary to-secondary shadow-md hover:opacity-90 transition-colors">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>

        {/* روابط إضافية */}
        <div className="text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}