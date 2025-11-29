"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { callableCreateProgram } from "@/lib/functions";

export default function NewProgramPage() {
  const { user, role, loading } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", skills: "", startDate: "", endDate: "", capacity: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || role !== "company")) {
      window.location.href = "/login";
    }
  }, [user, role, loading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
      await callableCreateProgram({
        title: form.title,
        description: form.description,
        skills,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        companyId: null,
      });
      alert("تم إنشاء البرنامج بنجاح");
      window.location.href = "/programs";
    } catch (e: any) {
      alert(e?.message || "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold">إنشاء برنامج تدريبي</h1>
      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-3 rounded" placeholder="العنوان" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="border p-3 rounded" placeholder="الطاقة الاستيعابية" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
        <input className="border p-3 rounded" placeholder="تاريخ البدء (YYYY-MM-DD)" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
        <input className="border p-3 rounded" placeholder="تاريخ الانتهاء (YYYY-MM-DD)" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
        <textarea className="border p-3 rounded md:col-span-2" placeholder="الوصف" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="border p-3 rounded md:col-span-2" placeholder="المهارات (افصلهم بفاصلة)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
        <button disabled={submitting} className="px-4 py-2 bg-secondary text-white rounded md:col-span-2">{submitting ? "جاري الإنشاء..." : "إنشاء"}</button>
      </form>
    </div>
  );
}