"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CompanyProfilePage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", company: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid
      if (!uid) return
      const snap = await getDoc(doc(db, 'users', uid))
      const data = snap.data() as any
      setForm({ firstName: data?.firstName || "", lastName: data?.lastName || "", phone: data?.phone || "", company: data?.company || "" })
      setLoading(false)
    })()
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const uid = auth.currentUser?.uid
    if (uid) {
      await updateDoc(doc(db, 'users', uid), { firstName: form.firstName, lastName: form.lastName, phone: form.phone, company: form.company })
      alert('تم تحديث البيانات')
    }
    setSaving(false)
  }

  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <h1 className="text-3xl font-bold">بيانات الشركة</h1>
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <form onSubmit={save} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <input className="border p-3 rounded" placeholder="الاسم الأول" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            <input className="border p-3 rounded" placeholder="الاسم الأخير" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            <input className="border p-3 rounded" placeholder="اسم الشركة" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <input className="border p-3 rounded md:col-span-2" placeholder="رقم الجوال" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <button disabled={saving} className="px-4 py-2 bg-primary text-white rounded md:col-span-2">{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          </form>
        )}
      </div>
    </RequireRole>
  )
}
