"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function DashboardNavbar() {
  const { role, logout } = useAuth();
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Array<{ id: string; title: string; body: string; type: string }>>([])
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const q = query(collection(db, 'notifications'), where('userUid', '==', uid), where('read', '==', false), orderBy('createdAt', 'desc'), limit(10))
    const unsub = onSnapshot(q, (snap) => {
      const arr: Array<{ id: string; title: string; body: string; type: string }> = []
      snap.forEach(d => { const n = d.data() as any; arr.push({ id: n.id, title: n.title || '', body: n.body || '', type: n.type || 'info' }) })
      setItems(arr)
    })
    return () => unsub()
  }, [auth.currentUser?.uid])
  const markRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true })
  }
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/identity/primary-logo.png" alt="Logo" width={160} height={54} className="h-16 w-auto" priority />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            <div className="relative">
              <button onClick={() => setOpen(v => !v)} className="relative p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-800" />
                {items.length > 0 && <span className="absolute -top-1 -left-1 bg-red-600 text-white text-xs rounded-full px-1">{items.length}</span>}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100 font-bold text-gray-900">الإشعارات</div>
                  <div className="max-h-80 overflow-auto">
                    {items.length === 0 ? (
                      <div className="p-4 text-sm text-gray-600">لا توجد إشعارات جديدة</div>
                    ) : (
                      items.map(n => (
                        <button key={n.id} onClick={() => markRead(n.id)} className="w-full text-right p-3 hover:bg-gray-50 border-b border-gray-100">
                          <div className="text-sm font-bold text-gray-900">{n.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{n.body}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {role === "jobSeeker" && (
              <>
                <Link href="/dashboard/seeker" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">الرئيسية</Link>
                <Link href="/dashboard/seeker/jobs" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">الوظائف</Link>
                <Link href="/dashboard/seeker/programs" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">البرامج التدريبية</Link>
                <Link href="/dashboard/seeker/applications" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">تقديماتي</Link>
                <Link href="/dashboard/seeker/profile" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">تحديث البيانات</Link>
              </>
            )}
            {role === "company" && (
              <>
                <Link href="/dashboard/company" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">الرئيسية</Link>
                <Link href="/dashboard/company/jobs/new" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">نشر وظيفة</Link>
                <Link href="/dashboard/company/programs/new" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">إنشاء برنامج</Link>
                <Link href="/dashboard/company/jobs" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">إدارة الوظائف</Link>
                <Link href="/dashboard/company/profile" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">تحديث البيانات</Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link href="/dashboard/admin" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">لوحة الإدارة</Link>
                <Link href="/dashboard/admin#users" className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">المستخدمون</Link>
              </>
            )}
            <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg text-sm font-medium">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </nav>
  )
}