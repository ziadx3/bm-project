"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../providers/AuthProvider";
import { callableApplyToJob } from "@/lib/functions";

type Job = {
  id: string
  title: string
  description: string
  skills: string[]
  location?: string | null
  type?: string | null
  salaryRange?: string | null
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { role } = useAuth()

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'jobs'))
      const list: Job[] = []
      snap.forEach(doc => {
        const d = doc.data() as any
        list.push({
          id: d.id,
          title: d.title,
          description: d.description,
          skills: d.skills || [],
          location: d.location || null,
          type: d.type || null,
          salaryRange: d.salaryRange || null,
        })
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
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold">الوظائف</h1>
      <p className="mt-2 text-gray-600">تصفح الوظائف المتاحة وقدّم على المناسب منها.</p>
      {loading ? (
        <p className="mt-6 text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 rounded-xl border bg-white">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="mt-2 text-gray-700">{job.description}</p>
              <div className="mt-2 text-sm text-gray-500">المهارات: {job.skills?.join(', ')}</div>
              <div className="mt-4">
                {role === 'jobSeeker' ? (
                  <button onClick={() => apply(job.id)} className="px-4 py-2 bg-primary text-white rounded-lg">تقديم على الوظيفة</button>
                ) : (
                  <Link href="/login" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">سجّل كـ باحث للتقديم</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex gap-3">
        {role === 'jobSeeker' && (
          <Link href="/dashboard/seeker" className="px-4 py-2 bg-primary text-white rounded-lg">لوحة الباحث</Link>
        )}
        {role === 'company' && (
          <Link href="/dashboard/company" className="px-4 py-2 bg-secondary text-white rounded-lg">لوحة الشركة</Link>
        )}
        {!role && (
          <>
            <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-lg">سجّل الدخول</Link>
            <Link href="/signup" className="px-4 py-2 bg-secondary text-white rounded-lg">إنشاء حساب</Link>
          </>
        )}
      </div>
    </div>
  );
}