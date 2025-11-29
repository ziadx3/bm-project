"use client";
import RequireRole from "../../components/RequireRole";
import Link from "next/link";

export default function SeekerDashboardPage() {
  return (
    <RequireRole allowed={["jobSeeker"]}>
      <div className="min-h-screen px-6 py-10">
        <h1 className="text-3xl font-bold">لوحة الباحث عن عمل</h1>
        <p className="mt-2 text-gray-600">تصفح الوظائف والبرامج وادارة طلباتك.</p>
        <div className="mt-6 flex gap-4">
          <Link href="/jobs" className="px-4 py-2 bg-primary text-white rounded-lg">استعراض الوظائف</Link>
          <Link href="/programs" className="px-4 py-2 bg-secondary text-white rounded-lg">استعراض البرامج التدريبية</Link>
        </div>
      </div>
    </RequireRole>
  );
}
