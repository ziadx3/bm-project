"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import SeekerHeader from "../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { callableRegisterToProgram } from "@/lib/functions";

type Program = { id: string; title: string; description: string; skills: string[]; status?: string; startDate?: string | null; endDate?: string | null }

export default function SeekerProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const { notify } = useAuth()

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'trainingPrograms'))
      const list: Program[] = []
      snap.forEach(doc => {
        const d = doc.data() as any
        list.push({ id: d.id, title: d.title, description: d.description, skills: d.skills || [], status: d.status || 'open', startDate: d.startDate || null, endDate: d.endDate || null })
      })
      setPrograms(list)
      setLoading(false)
    })()
  }, [])

  const register = async (id: string) => {
    try {
      await callableRegisterToProgram({ programId: id })
      notify('تم التسجيل في البرنامج بنجاح', 'success')
    } catch (e: any) {
      const msg = e?.message || 'تعذّر التسجيل في البرنامج'
      notify(msg, 'error')
    }
  }
  const filtered = programs.filter(p => {
    const matchesQuery = query ? (p.title?.toLowerCase().includes(query.toLowerCase()) || p.description?.toLowerCase().includes(query.toLowerCase())) : true
    const isOpen = (p.status || 'open') === 'open'
    return matchesQuery && isOpen
  })

  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <SeekerHeader title="البرامج التدريبية" subtitle="طوّر مهاراتك وسجّل في البرامج المناسبة لك" />
        <div className="mt-6">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بعنوان البرنامج أو الوصف" className="w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        {loading ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-white animate-pulse">
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                <div className="mt-3 h-4 w-full bg-gray-200 rounded" />
                <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded" />
                <div className="mt-5 h-10 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(p => (
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