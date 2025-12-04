"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import SeekerHeader from "../components/Header";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

type JobApp = { id: string; jobId: string; status: string; createdAt?: any }
type ProgReg = { id: string; programId: string; status: string; createdAt?: any }

export default function SeekerApplicationsPage() {
  const [jobApps, setJobApps] = useState<JobApp[]>([])
  const [progRegs, setProgRegs] = useState<ProgReg[]>([])
  const [jobs, setJobs] = useState<Record<string, { title: string }>>({})
  const [programs, setPrograms] = useState<Record<string, { title: string }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid
      if (!uid) return
      const jq = query(collection(db, 'jobApplications'), where('seekerUid', '==', uid))
      const pq = query(collection(db, 'programRegistrations'), where('seekerUid', '==', uid))
      const jSnap = await getDocs(jq)
      const pSnap = await getDocs(pq)
      const jList: JobApp[] = []
      const pList: ProgReg[] = []
      const jobIds: string[] = []
      const progIds: string[] = []
      jSnap.forEach(d => { const a = d.data() as any; jList.push({ id: a.id, jobId: a.jobId, status: a.status || 'pending', createdAt: a.createdAt }); jobIds.push(a.jobId) })
      pSnap.forEach(d => { const r = d.data() as any; pList.push({ id: r.id, programId: r.programId, status: r.status || 'pending', createdAt: r.createdAt }); progIds.push(r.programId) })
      const jobMap: Record<string, { title: string }> = {}
      for (const id of Array.from(new Set(jobIds))) { const s = await getDoc(doc(db, 'jobs', id)); jobMap[id] = { title: (s.data() as any)?.title || '-' } }
      const progMap: Record<string, { title: string }> = {}
      for (const id of Array.from(new Set(progIds))) { const s = await getDoc(doc(db, 'trainingPrograms', id)); progMap[id] = { title: (s.data() as any)?.title || '-' } }
      setJobApps(jList); setProgRegs(pList); setJobs(jobMap); setPrograms(progMap); setLoading(false)
    })()
  }, [])

  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <SeekerHeader title="تقديماتي" subtitle="اطّلع على حالات طلباتك وتسجيلاتك" />
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">طلبات الوظائف</h3>
              <div className="mt-4 space-y-3">
                {jobApps.map(a => (
                  <div key={a.id} className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <div className="text-gray-900 font-semibold">{jobs[a.jobId]?.title || '-'}</div>
                      <div className="text-sm text-gray-600">حالة الطلب: <span className={`px-2 py-0.5 rounded-full text-xs ${a.status === 'accepted' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{a.status === 'pending' ? 'قيد المراجعة' : a.status === 'accepted' ? 'مقبول' : 'مرفوض'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">تسجيلات البرامج</h3>
              <div className="mt-4 space-y-3">
                {progRegs.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <div className="text-gray-900 font-semibold">{programs[r.programId]?.title || '-'}</div>
                      <div className="text-sm text-gray-600">حالة التسجيل: <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === 'accepted' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.status === 'pending' ? 'قيد المراجعة' : r.status === 'accepted' ? 'مقبول' : 'مرفوض'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireRole>
  )
}