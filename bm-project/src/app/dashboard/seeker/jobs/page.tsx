"use client";
import RequireRole from "../../../components/RequireRole";
import DashboardNavbar from "../../../components/DashboardNavbar";
import SeekerHeader from "../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { callableApplyToJob } from "@/lib/functions";

type Job = { id: string; title: string; description: string; skills: string[]; status?: string; location?: string | null; type?: string | null; salaryRange?: string | null }

export default function SeekerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const { notify } = useAuth()

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'jobs'))
      const list: Job[] = []
      snap.forEach(doc => {
        const d = doc.data() as any
        list.push({ id: d.id, title: d.title, description: d.description, skills: d.skills || [], status: d.status || 'open', location: d.location || null, type: d.type || null, salaryRange: d.salaryRange || null })
      })
      setJobs(list)
      setLoading(false)
    })()
  }, [])

  const apply = async (id: string) => {
    try {
      await callableApplyToJob({ jobId: id })
      notify('تم تقديم الطلب بنجاح', 'success')
    } catch (e: any) {
      const msg = e?.message || 'تعذّر تقديم الطلب'
      notify(msg, 'error')
    }
  }

  const uniqueSkills = Array.from(new Set(jobs.flatMap(j => j.skills || []))).slice(0, 12)
  const uniqueTypes = Array.from(new Set(jobs.map(j => j.type).filter(Boolean))) as string[]
  const filtered = jobs.filter(j => {
    const matchesQuery = query ? (j.title?.toLowerCase().includes(query.toLowerCase()) || j.description?.toLowerCase().includes(query.toLowerCase())) : true
    const matchesType = selectedType ? j.type === selectedType : true
    const matchesSkill = selectedSkill ? (j.skills || []).includes(selectedSkill) : true
    const isOpen = (j.status || 'open') === 'open'
    return matchesQuery && matchesType && matchesSkill && isOpen
  })

  return (
    <RequireRole allowed={["jobSeeker"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <SeekerHeader title="الوظائف" subtitle="استعرض الفرص المناسبة لك وقدّم عليها فورًا" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بعنوان الوظيفة أو الوصف" className="w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              <select value={selectedType || ''} onChange={e => setSelectedType(e.target.value || null)} className="border-2 rounded-xl px-3 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="">نوع الوظيفة</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t!}>{t}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {uniqueSkills.map(s => (
                <button key={s} onClick={() => setSelectedSkill(selectedSkill === s ? null : s)} className={`px-3 py-1 rounded-full border ${selectedSkill === s ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}`}>{s}</button>
              ))}
              {selectedSkill && (
                <button onClick={() => setSelectedSkill(null)} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">مسح</button>
              )}
            </div>
          </div>
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
            {filtered.map(job => (
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