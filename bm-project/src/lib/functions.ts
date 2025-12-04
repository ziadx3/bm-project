import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore'

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
      status: 'open',
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
    const dupQ = await getDocs(query(collection(db, 'jobApplications'), where('jobId', '==', payload.jobId), where('seekerUid', '==', auth.currentUser.uid), limit(1)))
    if (!dupQ.empty) throw new Error('لقد قدمت مسبقًا على هذه الوظيفة')
    const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
    const u = userSnap.data() as any || {}
    const id = crypto.randomUUID()
    await setDoc(doc(db, 'jobApplications', id), {
      id,
      jobId: payload.jobId,
      seekerUid: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      ownerUid: jobSnap.data()?.ownerUid || null,
      seekerFirstName: u.firstName || null,
      seekerLastName: u.lastName || null,
      seekerEmail: u.email || null,
      seekerPhone: u.phone || null,
      seekerHeadline: u.headline || null,
      seekerSkills: Array.isArray(u.skills) ? u.skills : [],
      seekerEducation: u.education || null,
      seekerBio: u.bio || null,
      seekerPortfolioUrl: u.portfolioUrl || null,
      seekerResumeUrl: u.resumeUrl || null,
      seekerLocation: u.location || null,
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
    const dupQ = await getDocs(query(collection(db, 'programRegistrations'), where('programId', '==', payload.programId), where('seekerUid', '==', auth.currentUser.uid), limit(1)))
    if (!dupQ.empty) throw new Error('لقد سجّلت مسبقًا في هذا البرنامج')
    const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
    const u = userSnap.data() as any || {}
    const id = crypto.randomUUID()
    await setDoc(doc(db, 'programRegistrations', id), {
      id,
      programId: payload.programId,
      seekerUid: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      ownerUid: progSnap.data()?.ownerUid || null,
      seekerFirstName: u.firstName || null,
      seekerLastName: u.lastName || null,
      seekerEmail: u.email || null,
      seekerPhone: u.phone || null,
      seekerHeadline: u.headline || null,
      seekerSkills: Array.isArray(u.skills) ? u.skills : [],
      seekerEducation: u.education || null,
      seekerBio: u.bio || null,
      seekerPortfolioUrl: u.portfolioUrl || null,
      seekerResumeUrl: u.resumeUrl || null,
      seekerLocation: u.location || null,
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

export async function callableAdminSetUserRole(payload: { targetUid: string; role: 'admin' | 'company' | 'jobSeeker' }) {
  if (!auth.currentUser) throw new Error('غير مصرح')
  const fn = httpsCallable(functions, 'adminSetUserRole')
  const res = await fn(payload)
  return res.data as { ok: boolean }
}

export async function callableAdminSetUserDisabled(payload: { targetUid: string; disabled: boolean }) {
  if (!auth.currentUser) throw new Error('غير مصرح')
  const fn = httpsCallable(functions, 'adminSetUserDisabled')
  const res = await fn(payload)
  return res.data as { ok: boolean }
}

export async function callableAdminDeleteUser(payload: { targetUid: string }) {
  if (!auth.currentUser) throw new Error('غير مصرح')
  const fn = httpsCallable(functions, 'adminDeleteUser')
  const res = await fn(payload)
  return res.data as { ok: boolean }
}