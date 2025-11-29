import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const functions = getFunctions(undefined, 'us-central1')

export async function callableCreateJob(payload: {
  title: string
  description: string
  skills: string[]
  location?: string
  type?: string
  salaryRange?: string
  companyId?: string | null
}) {
  if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كـ شركة')
  const fn = httpsCallable(functions, 'createJob')
  try {
    const res = await fn(payload)
    return res.data as { id: string }
  } catch {
    const id = crypto.randomUUID()
    await setDoc(doc(db, 'jobs', id), {
      id,
      ownerUid: auth.currentUser.uid,
      companyId: payload.companyId || null,
      title: payload.title,
      description: payload.description,
      skills: payload.skills || [],
      location: payload.location || null,
      type: payload.type || null,
      salaryRange: payload.salaryRange || null,
      status: 'open',
      createdAt: serverTimestamp(),
    })
    return { id }
  }
}

export async function callableCreateProgram(payload: {
  title: string
  description: string
  skills: string[]
  startDate?: string
  endDate?: string
  capacity?: number
  companyId?: string | null
}) {
  if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كـ شركة')
  const fn = httpsCallable(functions, 'createProgram')
  try {
    const res = await fn(payload)
    return res.data as { id: string }
  } catch {
    const id = crypto.randomUUID()
    await setDoc(doc(db, 'trainingPrograms', id), {
      id,
      ownerUid: auth.currentUser.uid,
      companyId: payload.companyId || null,
      title: payload.title,
      description: payload.description,
      skills: payload.skills || [],
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      capacity: payload.capacity || null,
      createdAt: serverTimestamp(),
    })
    return { id }
  }
}

export async function callableApplyToJob(payload: { jobId: string }) {
  if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كـ باحث')
  const fn = httpsCallable(functions, 'applyToJob')
  try {
    const res = await fn(payload)
    return res.data as { id: string }
  } catch {
    const jobSnap = await getDoc(doc(db, 'jobs', payload.jobId))
    if (!jobSnap.exists()) throw new Error('الوظيفة غير موجودة')
    const id = crypto.randomUUID()
    await setDoc(doc(db, 'jobApplications', id), {
      id,
      jobId: payload.jobId,
      seekerUid: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      ownerUid: jobSnap.data()?.ownerUid || null,
    })
    return { id }
  }
}

export async function callableRegisterToProgram(payload: { programId: string }) {
  if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كـ باحث')
  const fn = httpsCallable(functions, 'registerToProgram')
  try {
    const res = await fn(payload)
    return res.data as { id: string }
  } catch {
    const progSnap = await getDoc(doc(db, 'trainingPrograms', payload.programId))
    if (!progSnap.exists()) throw new Error('البرنامج غير موجود')
    const id = crypto.randomUUID()
    await setDoc(doc(db, 'programRegistrations', id), {
      id,
      programId: payload.programId,
      seekerUid: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      ownerUid: progSnap.data()?.ownerUid || null,
    })
    return { id }
  }
}

export async function callableUpdateApplicationStatus(payload: { applicationId: string; status: 'pending' | 'accepted' | 'rejected' }) {
  if (!auth.currentUser) throw new Error('غير مصرح')
  const fn = httpsCallable(functions, 'updateApplicationStatus')
  const res = await fn(payload)
  return res.data as { ok: boolean }
}

export async function callableUpdateRegistrationStatus(payload: { registrationId: string; status: 'pending' | 'accepted' | 'rejected' }) {
  if (!auth.currentUser) throw new Error('غير مصرح')
  const fn = httpsCallable(functions, 'updateRegistrationStatus')
  const res = await fn(payload)
  return res.data as { ok: boolean }
}