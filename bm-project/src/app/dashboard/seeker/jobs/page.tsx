"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { callableApplyToJob } from "@/lib/functions";

type Job = { id: string; title: string; description: string; skills: string[]; location?: string | null; type?: string | null; salaryRange?: string | null }

export default function SeekerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'jobs'))
      const list: Job[] = []
      snap.forEach(doc => {
        const d = doc.data() as any
        list.push({ id: d.id, title: d.title, description: d.description, skills: d.skills || [], location: d.location || null, type: d.type || null, salaryRange: d.salaryRange || null })
      })
      setJobs(list)
      setLoading(false)
    })()
  }, [])

  const apply = async (id: string) => {
    await callableApplyToJob({ jobId: id })
    alert('تم تقديم الطلب بنجاح')
  }

  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <h1 className="text-3xl font-bold">الوظائف</h1>
        <p className="mt-2 text-gray-600">استعرض الوظائف المناسبة وقدّم عليها.</p>
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div key={job.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  {job.type && <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">{job.type}</span>}
                </div>
                <p className="mt-3 text-gray-700 leading-7">{job.description}</p>
                <div className="mt-3 text-sm text-gray-600">المهارات: {job.skills?.join(', ')}</div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => apply(job.id)} className="px-4 py-2 bg-primary text-white rounded-lg">تقديم على الوظيفة</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}
