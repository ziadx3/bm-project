"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { callableCreateJob } from "@/lib/functions";

export default function NewJobPage() {
  const { user, role, loading } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", skills: "", location: "", type: "", salaryRange: "" });
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
      await callableCreateJob({
        title: form.title,
        description: form.description,
        skills,
        location: form.location || undefined,
        type: form.type || undefined,
        salaryRange: form.salaryRange || undefined,
        companyId: null,
      });
      alert("تم نشر الوظيفة بنجاح");
      window.location.href = "/jobs";
    } catch (e: any) {
      alert(e?.message || "حدث خطأ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold">نشر وظيفة</h1>
      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-3 rounded" placeholder="العنوان" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="border p-3 rounded" placeholder="الموقع" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input className="border p-3 rounded" placeholder="نوع الوظيفة" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
        <input className="border p-3 rounded" placeholder="نطاق الراتب" value={form.salaryRange} onChange={e => setForm({ ...form, salaryRange: e.target.value })} />
        <textarea className="border p-3 rounded md:col-span-2" placeholder="الوصف" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="border p-3 rounded md:col-span-2" placeholder="المهارات (افصلهم بفاصلة)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
        <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded md:col-span-2">{submitting ? "جاري النشر..." : "نشر"}</button>
      </form>
    </div>
  );
}