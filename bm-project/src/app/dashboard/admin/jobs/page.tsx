"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/app/providers/AuthProvider";

type Job = { id: string; title: string; description: string; status: string; ownerUid?: string | null }

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { notify } = useAuth()

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'jobs'))
      const list: Job[] = []
      snap.forEach(d => { const x = d.data() as any; list.push({ id: x.id, title: x.title, description: x.description, status: x.status || 'open', ownerUid: x.ownerUid || null }) })
      setJobs(list)
      setLoading(false)
    })()
  }, [])

  const toggleJobStatus = async (jobId: string, current: string) => {
    const next = current === 'open' ? 'closed' : 'open'
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status: next })
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: next } : j))
      notify(next === 'closed' ? 'تم إغلاق الوظيفة' : 'تم فتح الوظيفة', 'success')
    } catch (e: any) {
      notify(e?.message || 'تعذّر تعديل حالة الوظيفة', 'error')
    }
  }

  const removeJob = async (jobId: string) => {
    try {
      await deleteDoc(doc(db, 'jobs', jobId))
      setJobs(jobs.filter(j => j.id !== jobId))
      notify('تم حذف الوظيفة', 'success')
    } catch (e: any) {
      notify(e?.message || 'تعذّر حذف الوظيفة', 'error')
    }
  }

  return (
    <RequireRole allowed={["admin"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-primary/10 via-white to-secondary/10">
          <div className="p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">إدارة الوظائف (أدمن)</h1>
            <p className="mt-2 text-gray-600 md:text-lg">عرض الوظائف واتخاذ إجراءات إدارية</p>
          </div>
        </div>
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(j => (
              <div key={j.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{j.title}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${j.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{j.status === 'open' ? 'مفتوحة' : 'مغلقة'}</span>
                </div>
                <p className="mt-3 text-gray-700 leading-7 line-clamp-3">{j.description}</p>
                <div className="mt-2 text-xs text-gray-500">مالك: {j.ownerUid || '-'}</div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => toggleJobStatus(j.id, j.status)} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-200">{j.status === 'open' ? 'إغلاق' : 'فتح'}</button>
                  <button onClick={() => removeJob(j.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}