"use client";
import RequireRole from "../../components/RequireRole";
import DashboardNavbar from "../../components/DashboardNavbar";
import Link from "next/link";
import SeekerHeader from "./components/Header";
import { Briefcase, GraduationCap, User } from "lucide-react";

export default function SeekerDashboardPage() {
  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <SeekerHeader title="لوحة الباحث عن عمل" subtitle="استعرض الفرص والتدريب وطوّر ملفك الشخصي" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-gray-900">الوظائف</h3>
            </div>
            <p className="mt-2 text-gray-700">استعرض الوظائف المناسبة لقدراتك وقدّم عليها مباشرة.</p>
            <Link href="/dashboard/seeker/jobs" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg">استعراض الوظائف</Link>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-bold text-gray-900">البرامج التدريبية</h3>
            </div>
            <p className="mt-2 text-gray-700">نمِ مهاراتك وسجّل في البرامج التدريبية المتاحة.</p>
            <Link href="/dashboard/seeker/programs" className="mt-4 inline-block px-4 py-2 bg-secondary text-white rounded-lg">استعراض البرامج</Link>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-gray-800" />
              <h3 className="text-xl font-bold text-gray-900">بياناتي</h3>
            </div>
            <p className="mt-2 text-gray-700">حدّث بيانات حسابك لتحسين فرصك.</p>
            <Link href="/dashboard/seeker/profile" className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200">تحديث البيانات</Link>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}