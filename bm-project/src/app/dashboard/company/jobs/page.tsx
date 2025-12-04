"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import CompanyHeader from "../components/Header";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

type Job = { id: string; title: string; description: string; status: string }

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid
      if (!uid) return
      const q = query(collection(db, 'jobs'), where('ownerUid', '==', uid))
      const snap = await getDocs(q)
      const list: Job[] = []
      snap.forEach(docu => {
        const d = docu.data() as any
        list.push({ id: d.id, title: d.title, description: d.description, status: d.status || 'open' })
      })
      setJobs(list)
      setLoading(false)
    })()
  }, [])

  const toggleStatus = async (id: string, current: string) => {
    await updateDoc(doc(db, 'jobs', id), { status: current === 'open' ? 'closed' : 'open' })
    setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } : j))
  }

  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <CompanyHeader title="إدارة الوظائف" subtitle="تابع وظائفك وقم بتبديل حالتها" />
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div key={job.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{job.status === 'open' ? 'مفتوحة' : 'مغلقة'}</span>
                </div>
                <p className="mt-3 text-gray-700 leading-7">{job.description}</p>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => toggleStatus(job.id, job.status)} className="px-4 py-2 bg-primary text-white rounded-lg">تبديل الحالة</button>
                  <a href={`/dashboard/company/jobs/${job.id}/applicants`} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200">عرض المتقدمين</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}