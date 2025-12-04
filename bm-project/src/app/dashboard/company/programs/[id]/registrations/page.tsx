"use client";
import RequireRole from "../../../../../components/RequireRole";
import DashboardNavbar from "../../../../../components/DashboardNavbar";
import CompanyHeader from "../../../components/Header";
import { useEffect, useState, use as useUnwrap } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { callableUpdateRegistrationStatus } from "@/lib/functions";

type Registration = {
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

export default function RegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: programId } = useUnwrap(params)
  const [regs, setRegs] = useState<Registration[]>([])
  const [users, setUsers] = useState<Record<string, UserInfo>>({})
  const [loading, setLoading] = useState(true)
  const [programTitle, setProgramTitle] = useState<string>("")
  const { notify } = useAuth()

  useEffect(() => {
    (async () => {
      const progSnap = await getDoc(doc(db, 'trainingPrograms', programId))
      const pd = progSnap.data() as any
      setProgramTitle(pd?.title || '')
      const q = query(collection(db, 'programRegistrations'), where('programId', '==', programId))
      const snap = await getDocs(q)
      const list: Registration[] = []
      const userIds: string[] = []
      snap.forEach(d => {
        const r = d.data() as any
        list.push({
          id: r.id,
          seekerUid: r.seekerUid,
          status: r.status || 'pending',
          createdAt: r.createdAt,
          seekerFirstName: r.seekerFirstName || '',
          seekerLastName: r.seekerLastName || '',
          seekerEmail: r.seekerEmail || '',
          seekerPhone: r.seekerPhone || '',
          seekerHeadline: r.seekerHeadline || '',
          seekerSkills: Array.isArray(r.seekerSkills) ? r.seekerSkills : [],
          seekerEducation: r.seekerEducation || null,
          seekerBio: r.seekerBio || null,
          seekerPortfolioUrl: r.seekerPortfolioUrl || null,
          seekerResumeUrl: r.seekerResumeUrl || null,
          seekerLocation: r.seekerLocation || null,
        })
        userIds.push(r.seekerUid)
      })
      setRegs(list)
      setLoading(false)
    })()
  }, [programId])

  const changeStatus = async (registrationId: string, status: 'accepted' | 'rejected' | 'pending') => {
    try {
      await callableUpdateRegistrationStatus({ registrationId, status })
      setRegs(regs.map(r => r.id === registrationId ? { ...r, status } : r))
      notify('تم تحديث حالة التسجيل', 'success')
    } catch (e: any) {
      const msg = e?.message || 'تعذّر تحديث الحالة'
      notify(msg, 'error')
    }
  }

  return (
    <RequireRole allowed={["company"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <CompanyHeader title={`المسجلون: ${programTitle || ''}`} subtitle="راجع المسجلين وعدّل حالة تسجيلهم" />
        {loading ? (
          <p className="mt-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {regs.map(r => (
              <div key={r.id} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{r.seekerFirstName} {r.seekerLastName}</h3>
                  {r.seekerHeadline && <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">{r.seekerHeadline}</span>}
                </div>
                <div className="mt-2 text-sm text-gray-600">البريد: {r.seekerEmail || '-'}</div>
                <div className="mt-1 text-sm text-gray-600">الجوال: {r.seekerPhone || '-'}</div>
                <div className="mt-1 text-sm text-gray-600">الموقع: {r.seekerLocation || '-'}</div>
                <div className="mt-2 text-sm text-gray-600">المهارات: {(r.seekerSkills || []).join(', ') || '-'}</div>
                {r.seekerEducation && <div className="mt-1 text-sm text-gray-600">التعليم: {r.seekerEducation}</div>}
                <div className="mt-2 flex gap-3">
                  {r.seekerPortfolioUrl && <a href={r.seekerPortfolioUrl} target="_blank" rel="noreferrer" className="text-primary text-sm underline">ملف الأعمال</a>}
                  {r.seekerResumeUrl && <a href={r.seekerResumeUrl} target="_blank" rel="noreferrer" className="text-primary text-sm underline">السيرة الذاتية</a>}
                </div>
                <div className="mt-5 flex gap-3 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${r.status === 'accepted' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.status === 'pending' ? 'قيد المراجعة' : r.status === 'accepted' ? 'مقبول' : 'مرفوض'}</span>
                  <button onClick={() => changeStatus(r.id, 'accepted')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">قبول</button>
                  <button onClick={() => changeStatus(r.id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">رفض</button>
                  <button onClick={() => changeStatus(r.id, 'pending')} className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-200">إرجاع للمراجعة</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  )
}