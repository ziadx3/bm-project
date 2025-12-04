"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import CompanyHeader from "../components/Header";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

type Program = { id: string; title: string; description: string; skills: string[]; status: string }

export default function CompanyProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid
      if (!uid) return
      const q = query(collection(db, 'trainingPrograms'), where('ownerUid', '==', uid))
      const snap = await getDocs(q)
      const list: Program[] = []
      snap.forEach(docu => {
        const d = docu.data() as any
        list.push({ id: d.id, title: d.title, description: d.description, skills: d.skills || [], status: d.status || 'open' })
      })
      setPrograms(list)
      setLoading(false)
    })()
  }, [])

  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <CompanyHeader title="إدارة البرامج" subtitle="استعرض برامج شركتك التدريبية" />
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(p => (
              <div key={p.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                <p className="mt-3 text-gray-700 leading-7">{p.description}</p>
                <div className="mt-3 text-sm text-gray-600">المهارات: {p.skills?.join(', ')}</div>
                <div className="mt-3 text-sm">
                  <span className={`text-xs px-3 py-1 rounded-full ${p.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{p.status === 'open' ? 'مفتوح' : 'مغلق'}</span>
                </div>
                <div className="mt-5 flex gap-3">
                  <a href={`/dashboard/company/programs/${p.id}/registrations`} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200">عرض المسجلين</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}