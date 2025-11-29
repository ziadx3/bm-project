'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../providers/AuthProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { user, role, logout } = useAuth();
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/identity/primary-logo.png" 
                alt="Business Manager Logo" 
                width={180} 
                height={60} 
                className="h-22 w-auto"
                priority
              />
            </Link>
          </div>

          {/* القائمة الرئيسية - سطح المكتب */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-reverse space-x-8">
              <Link href="#home" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                الرئيسية
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                الميزات
              </Link>
              <Link href="#clients" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                عملاؤنا
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                اتصل بنا
              </Link>
            </div>
          </div>

          {/* أزرار حسب حالة المستخدم */}
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            {user ? (
              <>
                {role === 'company' && (
                  <Link href="/dashboard/company" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">لوحة الشركة</Link>
                )}
                {role === 'jobSeeker' && (
                  <Link href="/dashboard/seeker" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">لوحة الباحث</Link>
                )}
                {role === 'admin' && (
                  <Link href="/dashboard/admin" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">لوحة الإدارة</Link>
                )}
                <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg text-sm font-medium transition-colors">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors">تسجيل الدخول</Link>
                <Link href="/signup" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">إنشاء حساب</Link>
              </>
            )}
          </div>

          {/* زر القائمة للهاتف المحمول */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* القائمة المنسدلة للهاتف المحمول */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link href="#home" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              الرئيسية
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              الميزات
            </Link>
            <Link href="#clients" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              عملاؤنا
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              اتصل بنا
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 space-y-2 flex-col">
                {user ? (
                  <>
                    {role === 'company' && (
                      <Link href="/dashboard/company" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-center">لوحة الشركة</Link>
                    )}
                    {role === 'jobSeeker' && (
                      <Link href="/dashboard/seeker" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-center">لوحة الباحث</Link>
                    )}
                    {role === 'admin' && (
                      <Link href="/dashboard/admin" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-center">لوحة الإدارة</Link>
                    )}
                    <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 text-gray-800 block px-3 py-2 rounded-lg text-base font-medium w-full text-center">تسجيل الخروج</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-center">تسجيل الدخول</Link>
                    <Link href="/signup" className="bg-primary hover:bg-primary-dark text-white block px-3 py-2 rounded-lg text-base font-medium w-full text-center">إنشاء حساب</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;