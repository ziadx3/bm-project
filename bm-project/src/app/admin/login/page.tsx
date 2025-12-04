'use client';

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function AdminLoginPage() {
  const { login, logout, notify } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('البريد الإلكتروني وكلمة المرور مطلوبة')
      return
    }
    setIsLoading(true)
    try {
      await login(email, password)
      const uid = auth.currentUser?.uid
      let r: 'company' | 'admin' | 'jobSeeker' = 'jobSeeker'
      if (uid) {
        const snap = await getDoc(doc(db, 'users', uid))
        const data = snap.data() as { role?: 'company' | 'admin' | 'jobSeeker' } | undefined
        r = (data?.role || 'jobSeeker')
      }
      if (r !== 'admin') {
        setError('هذا الحساب ليس أدمن')
        notify('الحساب غير مخوّل كأدمن', 'error')
        await logout()
        return
      }
      router.push('/dashboard/admin')
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
      } else if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found') {
        setError('تهيئة Firebase غير صحيحة. تأكد من مفاتيح .env.local وتمكين Email/Password.')
      } else {
        setError(e?.message || 'تعذّر تسجيل الدخول.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8">
            <Image src="/identity/primary-logo.png" alt="Business Manager Logo" width={200} height={80} className="h-20 w-auto mx-auto" priority />
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">تسجيل دخول الأدمن</h2>
          <p className="text-lg text-gray-600">أدخل حساب الأدمن للوصول إلى لوحة الإدارة</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-right">{error}</div>}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <form className="space-y-6" onSubmit={submit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="أدخل بريدك" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="أدخل كلمة المرور" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-3 bg-primary text-white rounded-xl font-bold">{isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</button>
            <div className="text-center text-sm text-gray-600">
              <Link href="/login" className="underline">تسجيل دخول عادي</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}