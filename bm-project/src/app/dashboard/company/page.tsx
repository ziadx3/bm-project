"use client";
import RequireRole from "../../components/RequireRole";
import DashboardNavbar from "../../components/DashboardNavbar";
import Link from "next/link";
import CompanyHeader from "./components/Header";

export default function CompanyDashboardPage() {
  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <CompanyHeader title="لوحة الشركة" subtitle="انشر الوظائف وأدر برامجك التدريبية وراجع الطلبات" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">نشر وظيفة</h3>
            <p className="mt-2 text-gray-700">أضف وظيفة جديدة وحدّد المهارات والمتطلبات.</p>
            <Link href="/dashboard/company/jobs/new" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg">نشر وظيفة</Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">إنشاء برنامج تدريبي</h3>
            <p className="mt-2 text-gray-700">قدّم برامج تدريبية لتنمية مهارات الباحثين.</p>
            <Link href="/dashboard/company/programs/new" className="mt-4 inline-block px-4 py-2 bg-secondary text-white rounded-lg">إنشاء برنامج</Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">تحديث البيانات</h3>
            <p className="mt-2 text-gray-700">حدّث بيانات حساب الشركة.</p>
            <Link href="/dashboard/company/profile" className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200">تحديث البيانات</Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900">إدارة الوظائف</h3>
            <p className="mt-2 text-gray-700">عدّل حالة وظائفك وتابعها.</p>
            <Link href="/dashboard/company/jobs" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg">إدارة الوظائف</Link>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">إدارة البرامج</h3>
            <p className="mt-2 text-gray-700">استعرض برامجك التدريبية.</p>
            <Link href="/dashboard/company/programs" className="mt-4 inline-block px-4 py-2 bg-secondary text白 rounded-lg">إدارة البرامج</Link>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}