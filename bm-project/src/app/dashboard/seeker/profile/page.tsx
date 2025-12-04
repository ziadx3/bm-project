"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SeekerHeader from "../components/Header";

export default function SeekerProfilePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    headline: "",
    experienceYears: "",
    skills: "",
    education: "",
    bio: "",
    portfolioUrl: "",
    resumeUrl: "",
    location: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { notify } = useAuth()

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid
      if (!uid) return
      const snap = await getDoc(doc(db, 'users', uid))
      const data = snap.data() as any
      setForm({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        phone: data?.phone || "",
        headline: data?.headline || "",
        experienceYears: (data?.experienceYears ?? "")?.toString() || "",
        skills: (Array.isArray(data?.skills) ? data.skills.join(", ") : (data?.skills || "")),
        education: data?.education || "",
        bio: data?.bio || "",
        portfolioUrl: data?.portfolioUrl || "",
        resumeUrl: data?.resumeUrl || "",
        location: data?.location || "",
      })
      setLoading(false)
    })()
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const uid = auth.currentUser?.uid
    if (uid) {
      const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean)
      try {
        await updateDoc(doc(db, 'users', uid), {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          headline: form.headline,
          experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
          skills: skillsArr,
          education: form.education,
          bio: form.bio,
          portfolioUrl: form.portfolioUrl,
          resumeUrl: form.resumeUrl,
          location: form.location,
        })
        notify('تم تحديث البيانات', 'success')
      } catch (e: any) {
        notify(e?.message || 'تعذّر التحديث', 'error')
      }
    }
    setSaving(false)
  }

  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <SeekerHeader title="بياناتي" subtitle="أكمل سيرتك الذاتية لزيادة فرصك" />
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <form onSubmit={save} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <input className="border p-3 rounded" placeholder="الاسم الأول" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <input className="border p-3 rounded" placeholder="الاسم الأخير" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            <input className="border p-3 rounded" placeholder="رقم الجوال" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input className="border p-3 rounded" placeholder="المسمّى الوظيفي (مثال: مطوّر واجهات)" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} />
            <input className="border p-3 rounded" placeholder="سنوات الخبرة" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })} />
            <input className="border p-3 rounded md:col-span-2" placeholder="المهارات (افصلهم بفاصلة)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
            <input className="border p-3 rounded md:col-span-2" placeholder="الموقع" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <textarea className="border p-3 rounded md:col-span-2" placeholder="التعليم" value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} />
            <textarea className="border p-3 rounded md:col-span-2" placeholder="نبذة مختصرة" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            <input className="border p-3 rounded" placeholder="رابط الملف الشخصي/أعمالي" value={form.portfolioUrl} onChange={e => setForm({ ...form, portfolioUrl: e.target.value })} />
            <input className="border p-3 rounded" placeholder="رابط السيرة الذاتية (اختياري)" value={form.resumeUrl} onChange={e => setForm({ ...form, resumeUrl: e.target.value })} />
            <button disabled={saving} className="px-4 py-3 bg-primary text-white rounded md:col-span-2 font-bold">{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          </form>
        )}
      </div>
    </RequireRole>
  )
}