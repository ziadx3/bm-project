"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboardPage() {
  const { user, role, loading } = useAuth();
  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      window.location.href = "/login";
    }
  }, [user, role, loading]);

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
      <p className="mt-2 text-gray-600">مؤشرات وإدارة المحتوى والمستخدمين.</p>
      <Stats />
    </div>
  );
}

function Stats() {
  const [counts, setCounts] = useState<{ companies: number; jobs: number; programs: number }>({ companies: 0, jobs: 0, programs: 0 })
  useEffect(() => {
    (async () => {
      const companies = await getDocs(collection(db, 'companies'))
      const jobs = await getDocs(collection(db, 'jobs'))
      const programs = await getDocs(collection(db, 'trainingPrograms'))
      setCounts({ companies: companies.size, jobs: jobs.size, programs: programs.size })
    })()
  }, [])
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl border bg-white">عدد الشركات: {counts.companies}</div>
      <div className="p-4 rounded-xl border bg-white">عدد الوظائف: {counts.jobs}</div>
      <div className="p-4 rounded-xl border bg-white">عدد البرامج: {counts.programs}</div>
    </div>
  )
}
