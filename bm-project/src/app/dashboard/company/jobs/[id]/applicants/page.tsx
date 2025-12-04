"use client";
import RequireRole from "../../../../../components/RequireRole";
import DashboardNavbar from "../../../../../components/DashboardNavbar";
import CompanyHeader from "../../../components/Header";
import { useEffect, useState, use as useUnwrap } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { callableUpdateApplicationStatus } from "@/lib/functions";

type Applicant = {
  id: string;
  seekerUid: string;
  status: string;
  createdAt?: any;
  seekerFirstName?: string;
  seekerLastName?: string;
  seekerEmail?: string;
  seekerPhone?: string;
  seekerHeadline?: string;
  seekerSkills?: string[];
  seekerEducation?: string | null;
  seekerBio?: string | null;
  seekerPortfolioUrl?: string | null;
  seekerResumeUrl?: string | null;
  seekerLocation?: string | null;
}
type UserInfo = { firstName?: string; lastName?: string; email?: string; phone?: string; headline?: string; skills?: string[] }

export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: jobId } = useUnwrap(params)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [users, setUsers] = useState<Record<string, UserInfo>>({})
  const [loading, setLoading] = useState(true)
  const [jobTitle, setJobTitle] = useState<string>("")
  const [jobStatus, setJobStatus] = useState<string>("open")
  const { notify } = useAuth()

  useEffect(() => {
    (async () => {
      const jobSnap = await getDoc(doc(db, 'jobs', jobId))
      const jd = jobSnap.data() as any
      setJobTitle(jd?.title || '')
      setJobStatus(jd?.status || 'open')
      const q = query(collection(db, 'jobApplications'), where('jobId', '==', jobId))
      const snap = await getDocs(q)
      const list: Applicant[] = []
      const userIds: string[] = []
      snap.forEach(d => {
        const a = d.data() as any
        list.push({
          id: a.id,
          seekerUid: a.seekerUid,
          status: a.status || 'pending',
          createdAt: a.createdAt,
          seekerFirstName: a.seekerFirstName || '',
          seekerLastName: a.seekerLastName || '',
          seekerEmail: a.seekerEmail || '',
          seekerPhone: a.seekerPhone || '',
          seekerHeadline: a.seekerHeadline || '',
          seekerSkills: Array.isArray(a.seekerSkills) ? a.seekerSkills : [],
          seekerEducation: a.seekerEducation || null,
          seekerBio: a.seekerBio || null,
          seekerPortfolioUrl: a.seekerPortfolioUrl || null,
          seekerResumeUrl: a.seekerResumeUrl || null,
          seekerLocation: a.seekerLocation || null,
        })
        userIds.push(a.seekerUid)
      })
      setApplicants(list)
      setLoading(false)
    })()
  }, [jobId])

  const changeStatus = async (applicationId: string, status: 'accepted' | 'rejected' | 'pending') => {
    try {
      await callableUpdateApplicationStatus({ applicationId, status })
      setApplicants(applicants.map(a => a.id === applicationId ? { ...a, status } : a))
      notify('تم تحديث حالة الطلب', 'success')
    } catch (e: any) {
      const msg = e?.message || 'تعذّر تحديث الحالة'
      notify(msg, 'error')
    }
  }

  const toggleJobStatus = async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const next = jobStatus === 'open' ? 'closed' : 'open'
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status: next })
      setJobStatus(next)
      notify(next === 'closed' ? 'تم إغلاق الوظيفة' : 'تم فتح الوظيفة', 'success')
    } catch (e: any) {
      const msg = e?.message || 'تعذّر تعديل حالة الوظيفة'
      notify(msg, 'error')
    }
  }

  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <CompanyHeader title={`المتقدمون: ${jobTitle || ''}`} subtitle="راجع المتقدمين وعدّل حالة طلباتهم" />
        <div className="mt-6 flex gap-3">
          <button onClick={toggleJobStatus} className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-900">
            {jobStatus === 'open' ? 'إغلاق الوظيفة' : 'فتح الوظيفة'}
          </button>
        </div>
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {applicants.map(a => (
              <div key={a.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{a.seekerFirstName} {a.seekerLastName}</h3>
                  {a.seekerHeadline && <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">{a.seekerHeadline}</span>}
                </div>
                <div className="mt-2 text-sm text-gray-600">البريد: {a.seekerEmail || '-'}</div>
                <div className="mt-1 text-sm text-gray-600">الجوال: {a.seekerPhone || '-'}</div>
                <div className="mt-1 text-sm text-gray-600">الموقع: {a.seekerLocation || '-'}</div>
                <div className="mt-2 text-sm text-gray-600">المهارات: {(a.seekerSkills || []).join(', ') || '-'}</div>
                {a.seekerEducation && <div className="mt-1 text-sm text-gray-600">التعليم: {a.seekerEducation}</div>}
                <div className="mt-2 flex gap-3">
                  {a.seekerPortfolioUrl && <a href={a.seekerPortfolioUrl} target="_blank" rel="noreferrer" className="text-primary text-sm underline">ملف الأعمال</a>}
                  {a.seekerResumeUrl && <a href={a.seekerResumeUrl} target="_blank" rel="noreferrer" className="text-primary text-sm underline">السيرة الذاتية</a>}
                </div>
                <div className="mt-5 flex gap-3 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${a.status === 'accepted' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{a.status === 'pending' ? 'قيد المراجعة' : a.status === 'accepted' ? 'مقبول' : 'مرفوض'}</span>
                  <button onClick={() => changeStatus(a.id, 'accepted')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">قبول</button>
                  <button onClick={() => changeStatus(a.id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">رفض</button>
                  <button onClick={() => changeStatus(a.id, 'pending')} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-200">إرجاع للمراجعة</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}