"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import RequireRole from "../../components/RequireRole";
import DashboardNavbar from "../../components/DashboardNavbar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { callableAdminSetUserRole, callableAdminSetUserDisabled, callableAdminDeleteUser } from "@/lib/functions";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AdminDashboardPage() {
  return (
    <RequireRole allowed={["admin"]}>
      <DashboardNavbar />
      <div className="min-h-screen px-6 py-10 bg-white">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-primary/10 via-white to-secondary/10">
          <div className="p-8 md:p-10 flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">لوحة الإدارة</h1>
              <p className="mt-2 text-gray-600 md:text-lg">إحصائيات النظام وإدارة المستخدمين والمحتوى</p>
            </div>
            <Image src="/identity/primary-logo.png" alt="Logo" width={120} height={48} className="hidden md:block opacity-80" />
          </div>
        </div>
        <Stats />
        <Actions />
        <UsersBasic />
      </div>
    </RequireRole>
  );
}

function Stats() {
  const [counts, setCounts] = useState<{ companies: number; jobs: number; programs: number; users: number; jobApps: number; progRegs: number; openJobs: number; openPrograms: number }>({ companies: 0, jobs: 0, programs: 0, users: 0, jobApps: 0, progRegs: 0, openJobs: 0, openPrograms: 0 })
  useEffect(() => {
    (async () => {
      const companies = await getDocs(collection(db, 'companies'))
      const jobs = await getDocs(collection(db, 'jobs'))
      const programs = await getDocs(collection(db, 'trainingPrograms'))
      const users = await getDocs(collection(db, 'users'))
      const jobApps = await getDocs(collection(db, 'jobApplications'))
      const progRegs = await getDocs(collection(db, 'programRegistrations'))
      const openJobs = await getDocs(query(collection(db, 'jobs'), where('status', '==', 'open')))
      const openPrograms = await getDocs(query(collection(db, 'trainingPrograms'), where('status', '==', 'open')))
      setCounts({ companies: companies.size, jobs: jobs.size, programs: programs.size, users: users.size, jobApps: jobApps.size, progRegs: progRegs.size, openJobs: openJobs.size, openPrograms: openPrograms.size })
    })()
  }, [])
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <StatCard title="الشركات" value={counts.companies} color="secondary" />
      <StatCard title="الوظائف" value={counts.jobs} color="primary" />
      <StatCard title="البرامج" value={counts.programs} color="primary" />
      <StatCard title="المستخدمون" value={counts.users} color="gray" />
      <StatCard title="طلبات الوظائف" value={counts.jobApps} color="secondary" />
      <StatCard title="تسجيلات البرامج" value={counts.progRegs} color="secondary" />
      <StatCard title="وظائف مفتوحة" value={counts.openJobs} color="green" />
      <StatCard title="برامج مفتوحة" value={counts.openPrograms} color="green" />
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: 'primary' | 'secondary' | 'gray' | 'green' }) {
  const palette: Record<string, string> = {
    primary: 'from-primary/10 to-primary/0 border-primary/20',
    secondary: 'from-secondary/10 to-secondary/0 border-secondary/20',
    gray: 'from-gray-100 to-white border-gray-200',
    green: 'from-green-100 to-white border-green-200',
  }
  return (
    <div className={`p-6 rounded-2xl border bg-gradient-to-r ${palette[color]} shadow-sm`}> 
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-gray-900">{value}</div>
    </div>
  )
}

function UsersBasic() {
  const [users, setUsers] = useState<Array<{ uid: string; email?: string; role?: string; firstName?: string; lastName?: string }>>([])
  const [loading, setLoading] = useState(true)
  const { notify } = useAuth()
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'users'))
      const list: Array<{ uid: string; email?: string; role?: string; firstName?: string; lastName?: string }> = []
      snap.forEach(u => {
        const d = u.data() as any
        list.push({ uid: d.uid || u.id, email: d.email, role: d.role, firstName: d.firstName, lastName: d.lastName })
      })
      setUsers(list)
      setLoading(false)
    })()
  }, [])
  return (
    <div className="mt-10" id="users">
      <h2 className="text-2xl font-bold">المستخدمون</h2>
      {loading ? (
        <p className="mt-4 text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">المعرف</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">البريد</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">الاسم</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">الدور</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">تعطيل</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">حذف</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.uid} className="border-t">
                  <td className="px-4 py-3 text-gray-900 text-sm">{u.uid}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{u.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{[u.firstName, u.lastName].filter(Boolean).join(' ') || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    <select value={u.role || ''} onChange={async e => {
                      const r = (e.target.value || '') as 'admin' | 'company' | 'jobSeeker'
                      try {
                        await callableAdminSetUserRole({ targetUid: u.uid, role: r })
                        setUsers(users.map(x => x.uid === u.uid ? { ...x, role: r } : x))
                        notify('تم تحديث الدور', 'success')
                      } catch (err: any) {
                        notify(err?.message || 'تعذّر تحديث الدور', 'error')
                      }
                    }} className="border rounded px-2 py-1">
                      <option value="">-</option>
                      <option value="jobSeeker">باحث</option>
                      <option value="company">شركة</option>
                      <option value="admin">أدمن</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    <button onClick={async () => {
                      try {
                        await callableAdminSetUserDisabled({ targetUid: u.uid, disabled: true })
                        notify('تم تعطيل المستخدم', 'success')
                      } catch (err: any) {
                        notify(err?.message || 'تعذّر التعطيل', 'error')
                      }
                    }} className="px-3 py-1 bg-gray-100 text-gray-900 rounded border border-gray-200 hover:bg-gray-200">تعطيل</button>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">
                    <button onClick={async () => {
                      try {
                        await callableAdminDeleteUser({ targetUid: u.uid })
                        setUsers(users.filter(x => x.uid !== u.uid))
                        notify('تم حذف المستخدم', 'success')
                      } catch (err: any) {
                        notify(err?.message || 'تعذّر الحذف', 'error')
                      }
                    }} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
function Actions() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900">إجراءات سريعة</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="#users" className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50">
          <div className="text-lg font-bold text-gray-900">إدارة المستخدمين</div>
          <div className="mt-1 text-sm text-gray-600">عرض قائمة المستخدمين وأدوارهم</div>
        </a>
        <a href="/dashboard/admin/jobs" className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50">
          <div className="text-lg font-bold text-gray-900">استعراض الوظائف</div>
          <div className="mt-1 text-sm text-gray-600">عرض وظائف الشركات وحالاتها</div>
        </a>
        <a href="/dashboard/admin/programs" className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50">
          <div className="text-lg font-bold text-gray-900">استعراض البرامج</div>
          <div className="mt-1 text-sm text-gray-600">عرض البرامج التدريبية وحالاتها</div>
        </a>
      </div>
    </div>
  )
}