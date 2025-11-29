"use client";
import RequireRole from "../../components/RequireRole";
import Link from "next/link";

export default function CompanyDashboardPage() {
  return (
    <RequireRole allowed={["company"]}>
      <div className="min-h-screen px-6 py-10">
        <h1 className="text-3xl font-bold">لوحة الشركة</h1>
        <p className="mt-2 text-gray-600">إدارة الوظائف والبرامج التدريبية واستعراض الطلبات.</p>
        <div className="mt-6 flex gap-4">
          <Link href="/jobs/new" className="px-4 py-2 bg-primary text-white rounded-lg">نشر وظيفة</Link>
          <Link href="/programs/new" className="px-4 py-2 bg-secondary text-white rounded-lg">إنشاء برنامج تدريبي</Link>
        </div>
      </div>
    </RequireRole>
  );
}
