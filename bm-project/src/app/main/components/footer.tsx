"use client";

import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/identity/primary-logo.png"
              alt="Logo"
              width={140}
              height={56}
              className="h-10 w-auto brightness-0 invert"
            />
            <span className="text-gray-300">
              منصة تربط الشركات بالباحثين عن عمل وتسهّل التقديم على الوظائف والبرامج التدريبية
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              تسجيل الدخول
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-primary rounded-lg hover:opacity-90">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400">
          © {currentYear} Business Manager
        </div>
      </div>
    </footer>
  );
};

export default Footer;