"use client";
import RequireRole from "../../../../components/RequireRole";
import DashboardNavbar from "../../../../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { callableCreateJob } from "@/lib/functions";

export default function CompanyNewJobPage() {
  const [form, setForm] = useState({ title: "", description: "", skills: "", location: "", type: "full-time", salaryRange: "4000-8000" });
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useAuth()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
      await callableCreateJob({
        title: form.title,
        description: form.description,
        skills,
        location: form.location || undefined,
        type: form.type || undefined,
        salaryRange: form.salaryRange || undefined,
        companyId: null,
      });
      notify("تم نشر الوظيفة بنجاح", 'success');
    } catch (e: any) {
      notify(e?.message || "حدث خطأ", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <h1 className="text-3xl font-bold">نشر وظيفة</h1>
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
            <input required className="border p-3 rounded w-full" placeholder="مثال: مطوّر واجهات أمامية" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الموقع</label>
            <input className="border p-3 rounded w-full" placeholder="مثال: الرياض، عن بُعد" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع الوظيفة</label>
            <select className="border p-3 rounded w-full" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="full-time">دوام كامل</option>
              <option value="part-time">دوام جزئي</option>
              <option value="contract">عقد مؤقت</option>
              <option value="internship">تدريب</option>
              <option value="remote">عن بُعد</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نطاق الراتب</label>
            <select className="border p-3 rounded w-full" value={form.salaryRange} onChange={e => setForm({ ...form, salaryRange: e.target.value })}>
              <option value="<4000">أقل من 4000</option>
              <option value="4000-8000">4000 - 8000</option>
              <option value="8000-12000">8000 - 12000</option>
              <option value=">12000">أكثر من 12000</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
            <textarea required className="border p-3 rounded w-full" rows={6} placeholder="صف المسؤوليات والمتطلبات بشكل واضح" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">المهارات</label>
            <input className="border p-3 rounded w-full" placeholder="مثال: React, TypeScript, CSS" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            <div className="mt-1 text-xs text-gray-500">افصل المهارات بفاصلة</div>
          </div>
          <button disabled={submitting} className="px-4 py-3 bg-primary text-white rounded md:col-span-2 font-bold">{submitting ? "جاري النشر..." : "نشر"}</button>
        </form>
      </div>
    </RequireRole>
  );
}