"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";

export default function DashboardNavbar() {
  const { role, logout } = useAuth();
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/identity/primary-logo.png" alt="Logo" width={160} height={54} className="h-16 w-auto" priority />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            {role === "jobSeeker" && (
              <>
                <Link href="/dashboard/seeker" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">الرئيسية</Link>
                <Link href="/dashboard/seeker/jobs" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">الوظائف</Link>
                <Link href="/dashboard/seeker/programs" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">البرامج التدريبية</Link>
                <Link href="/dashboard/seeker/profile" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">تحديث البيانات</Link>
              </>
            )}
            {role === "company" && (
              <>
                <Link href="/dashboard/company" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">الرئيسية</Link>
                <Link href="/jobs/new" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">نشر وظيفة</Link>
                <Link href="/programs/new" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">إنشاء برنامج</Link>
                <Link href="/dashboard/company/jobs" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">إدارة الوظائف</Link>
                <Link href="/dashboard/company/profile" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">تحديث البيانات</Link>
              </>
            )}
            {role === "admin" && (
              <Link href="/dashboard/admin" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">لوحة الإدارة</Link>
            )}
            <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg text-sm font-medium">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </nav>
  )
}