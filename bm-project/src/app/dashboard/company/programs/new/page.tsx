"use client";
import RequireRole from "../../../../components/RequireRole";
import DashboardNavbar from "../../../../components/DashboardNavbar";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { callableCreateProgram } from "@/lib/functions";

export default function CompanyNewProgramPage() {
  const [form, setForm] = useState({ title: "", description: "", skills: "", startDate: "", endDate: "", capacity: "" });
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useAuth()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
      if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
        notify("تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء", 'error')
        setSubmitting(false)
        return
      }
      await callableCreateProgram({
        title: form.title,
        description: form.description,
        skills,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        companyId: null,
      });
      notify("تم إنشاء البرنامج بنجاح", 'success');
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
        <h1 className="text-3xl font-bold">إنشاء برنامج تدريبي</h1>
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
            <input required className="border p-3 rounded w-full" placeholder="مثال: برنامج تدريب مطوّري الويب" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الطاقة الاستيعابية</label>
            <input className="border p-3 rounded w-full" type="number" min={1} placeholder="عدد المقاعد" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ البدء</label>
            <input className="border p-3 rounded w-full" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الانتهاء</label>
            <input className="border p-3 rounded w-full" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
            <textarea required className="border p-3 rounded w-full" rows={6} placeholder="صف محتوى البرنامج والمتطلبات" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">المهارات</label>
            <input className="border p-3 rounded w-full" placeholder="مثال: JavaScript, UI/UX" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            <div className="mt-1 text-xs text-gray-500">افصل المهارات بفاصلة</div>
          </div>
          <button disabled={submitting} className="px-4 py-3 bg-secondary text-white rounded md:col-span-2 font-bold">{submitting ? "جاري الإنشاء..." : "إنشاء"}</button>
        </form>
      </div>
    </RequireRole>
  );
}