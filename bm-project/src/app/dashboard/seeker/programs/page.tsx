"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { callableRegisterToProgram } from "@/lib/functions";

type Program = { id: string; title: string; description: string; skills: string[]; startDate?: string | null; endDate?: string | null }

export default function SeekerProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'trainingPrograms'))
      const list: Program[] = []
      snap.forEach(doc => {
        const d = doc.data() as any
        list.push({ id: d.id, title: d.title, description: d.description, skills: d.skills || [], startDate: d.startDate || null, endDate: d.endDate || null })
      })
      setPrograms(list)
      setLoading(false)
    })()
  }, [])

  const register = async (id: string) => {
    await callableRegisterToProgram({ programId: id })
    alert('تم التسجيل في البرنامج بنجاح')
  }

  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <h1 className="text-3xl font-bold">البرامج التدريبية</h1>
        <p className="mt-2 text-gray-600">سجّل في البرامج التدريبية المناسبة.</p>
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(p => (
              <div key={p.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                <p className="mt-3 text-gray-700 leading-7">{p.description}</p>
                <div className="mt-3 text-sm text-gray-600">المهارات: {p.skills?.join(', ')}</div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => register(p.id)} className="px-4 py-2 bg-secondary text-white rounded-lg">التسجيل في البرنامج</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}
