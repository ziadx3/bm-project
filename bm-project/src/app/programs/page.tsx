"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../providers/AuthProvider";
import { callableRegisterToProgram } from "@/lib/functions";

type Program = {
  id: string
  title: string
  description: string
  skills: string[]
  startDate?: string | null
  endDate?: string | null
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const { role } = useAuth()

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'trainingPrograms'))
      const list: Program[] = []
      snap.forEach(doc => {
        const d = doc.data() as any
        list.push({
          id: d.id,
          title: d.title,
          description: d.description,
          skills: d.skills || [],
          startDate: d.startDate || null,
          endDate: d.endDate || null,
        })
      })
      setPrograms(list)
      setLoading(false)
    })()
  }, [])

  const register = async (id: string) => {
    await callableRegisterToProgram({ programId: id })
    alert('تم التسجيل في البرنامج بنجاح')
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold">البرامج التدريبية</h1>
      <p className="mt-2 text-gray-600">سجّل في البرامج التدريبية المتاحة.</p>
      {loading ? (
        <p className="mt-6 text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="p-4 rounded-xl border bg-white">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-gray-700">{p.description}</p>
              <div className="mt-2 text-sm text-gray-500">المهارات: {p.skills?.join(', ')}</div>
              <div className="mt-4">
                {role === 'jobSeeker' ? (
                  <button onClick={() => register(p.id)} className="px-4 py-2 bg-secondary text-white rounded-lg">التسجيل في البرنامج</button>
                ) : (
                  <Link href="/login" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">سجّل كـ باحث للتسجيل</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/seeker" className="px-4 py-2 bg-secondary text-white rounded-lg">لوحة الباحث</Link>
        <Link href="/dashboard/company" className="px-4 py-2 bg-primary text-white rounded-lg">لوحة الشركة</Link>
      </div>
    </div>
  );
}
