import * as admin from 'firebase-admin'
import { onCall } from 'firebase-functions/v2/https'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = getFirestore()

async function getUserRole(uid: string) {
  const snap = await db.collection('users').doc(uid).get()
  const data = snap.data() as { role?: string } | undefined
  return data?.role || null
}

async function createNotification(userUid: string, type: string, title: string, body: string, meta?: Record<string, any>) {
  const ref = db.collection('notifications').doc()
  await ref.set({
    id: ref.id,
    userUid,
    type,
    title,
    body,
    meta: meta || null,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  })
}

export const createJob = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'company') throw new Error('permission-denied')
  const payload = request.data as { title: string; description: string; skills: string[]; location?: string; type?: string; salaryRange?: string; companyId?: string }
  const docRef = db.collection('jobs').doc()
  await docRef.set({
    id: docRef.id,
    ownerUid: uid,
    companyId: payload.companyId || null,
    title: payload.title,
    description: payload.description,
    skills: payload.skills || [],
    location: payload.location || null,
    type: payload.type || null,
    salaryRange: payload.salaryRange || null,
    status: 'open',
    createdAt: FieldValue.serverTimestamp(),
  })
  return { id: docRef.id }
})

export const createProgram = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'company') throw new Error('permission-denied')
  const payload = request.data as { title: string; description: string; skills: string[]; startDate?: string; endDate?: string; capacity?: number; companyId?: string }
  const docRef = db.collection('trainingPrograms').doc()
  await docRef.set({
    id: docRef.id,
    ownerUid: uid,
    companyId: payload.companyId || null,
    title: payload.title,
    description: payload.description,
    skills: payload.skills || [],
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    capacity: payload.capacity || null,
    status: 'open',
    createdAt: FieldValue.serverTimestamp(),
  })
  return { id: docRef.id }
})

export const applyToJob = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'jobSeeker') throw new Error('permission-denied')
  const payload = request.data as { jobId: string }
  const jobSnap = await db.collection('jobs').doc(payload.jobId).get()
  if (!jobSnap.exists) throw new Error('not-found')
  const dupQ = await db.collection('jobApplications')
    .where('jobId', '==', payload.jobId)
    .where('seekerUid', '==', uid)
    .limit(1)
    .get()
  if (!dupQ.empty) throw new Error('already-applied')
  const userSnap = await db.collection('users').doc(uid).get()
  const u = userSnap.data() as any || {}
  const appRef = db.collection('jobApplications').doc()
  await appRef.set({ id: appRef.id, jobId: payload.jobId, seekerUid: uid, status: 'pending', createdAt: FieldValue.serverTimestamp(), ownerUid: jobSnap.data()?.ownerUid || null,
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
  const ownerUid = jobSnap.data()?.ownerUid as string | undefined
  if (ownerUid) {
    await createNotification(ownerUid, 'job_application', 'طلب تقديم جديد', `${u.firstName || ''} ${u.lastName || ''} قدّم على وظيفة ${jobSnap.data()?.title || ''}`, { jobId: payload.jobId, applicationId: appRef.id, seekerUid: uid })
  }
  return { id: appRef.id }
})

export const registerToProgram = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'jobSeeker') throw new Error('permission-denied')
  const payload = request.data as { programId: string }
  const programSnap = await db.collection('trainingPrograms').doc(payload.programId).get()
  if (!programSnap.exists) throw new Error('not-found')
  const dupQ = await db.collection('programRegistrations')
    .where('programId', '==', payload.programId)
    .where('seekerUid', '==', uid)
    .limit(1)
    .get()
  if (!dupQ.empty) throw new Error('already-registered')
  const userSnapR = await db.collection('users').doc(uid).get()
  const ur = userSnapR.data() as any || {}
  const regRef = db.collection('programRegistrations').doc()
  await regRef.set({ id: regRef.id, programId: payload.programId, seekerUid: uid, status: 'pending', createdAt: FieldValue.serverTimestamp(), ownerUid: programSnap.data()?.ownerUid || null,
    seekerFirstName: ur.firstName || null,
    seekerLastName: ur.lastName || null,
    seekerEmail: ur.email || null,
    seekerPhone: ur.phone || null,
    seekerHeadline: ur.headline || null,
    seekerSkills: Array.isArray(ur.skills) ? ur.skills : [],
    seekerEducation: ur.education || null,
    seekerBio: ur.bio || null,
    seekerPortfolioUrl: ur.portfolioUrl || null,
    seekerResumeUrl: ur.resumeUrl || null,
    seekerLocation: ur.location || null,
  })
  const ownerUid = programSnap.data()?.ownerUid as string | undefined
  if (ownerUid) {
    await createNotification(ownerUid, 'program_registration', 'تسجيل جديد في برنامج', `${ur.firstName || ''} ${ur.lastName || ''} سجّل في برنامج ${programSnap.data()?.title || ''}`, { programId: payload.programId, registrationId: regRef.id, seekerUid: uid })
  }
  return { id: regRef.id }
})

export const updateApplicationStatus = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'company' && role !== 'admin') throw new Error('permission-denied')
  const payload = request.data as { applicationId: string; status: 'pending' | 'accepted' | 'rejected' }
  const appRef = db.collection('jobApplications').doc(payload.applicationId)
  const snap = await appRef.get()
  if (!snap.exists) throw new Error('not-found')
  const data = snap.data() as any
  if (data.ownerUid !== uid && role !== 'admin') throw new Error('permission-denied')
  await appRef.update({ status: payload.status })
  const seekerUid = data.seekerUid as string | undefined
  const jobTitle = (await db.collection('jobs').doc(data.jobId).get()).data()?.title || ''
  if (seekerUid) {
    const title = payload.status === 'accepted' ? 'تم قبول طلبك' : payload.status === 'rejected' ? 'تم رفض طلبك' : 'تم إرجاع طلبك للمراجعة'
    const body = `حالة طلب وظيفة ${jobTitle}: ${payload.status}`
    await createNotification(seekerUid, 'application_status', title, body, { applicationId: payload.applicationId, jobId: data.jobId, status: payload.status })
  }
  return { ok: true }
})

export const updateRegistrationStatus = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'company' && role !== 'admin') throw new Error('permission-denied')
  const payload = request.data as { registrationId: string; status: 'pending' | 'accepted' | 'rejected' }
  const regRef = db.collection('programRegistrations').doc(payload.registrationId)
  const snap = await regRef.get()
  if (!snap.exists) throw new Error('not-found')
  const data = snap.data() as any
  if (data.ownerUid !== uid && role !== 'admin') throw new Error('permission-denied')
  await regRef.update({ status: payload.status })
  const seekerUid = data.seekerUid as string | undefined
  const programTitle = (await db.collection('trainingPrograms').doc(data.programId).get()).data()?.title || ''
  if (seekerUid) {
    const title = payload.status === 'accepted' ? 'تم قبول تسجيلك' : payload.status === 'rejected' ? 'تم رفض تسجيلك' : 'تم إرجاع تسجيلك للمراجعة'
    const body = `حالة تسجيل برنامج ${programTitle}: ${payload.status}`
    await createNotification(seekerUid, 'registration_status', title, body, { registrationId: payload.registrationId, programId: data.programId, status: payload.status })
  }
  return { ok: true }
})

export const adminSetUserRole = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'admin') throw new Error('permission-denied')
  const payload = request.data as { targetUid: string; role: 'admin' | 'company' | 'jobSeeker' }
  await db.collection('users').doc(payload.targetUid).update({ role: payload.role })
  return { ok: true }
})

export const adminSetUserDisabled = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'admin') throw new Error('permission-denied')
  const payload = request.data as { targetUid: string; disabled: boolean }
  await admin.auth().updateUser(payload.targetUid, { disabled: payload.disabled })
  await db.collection('users').doc(payload.targetUid).update({ disabled: payload.disabled })
  return { ok: true }
})

export const adminDeleteUser = onCall(async (request) => {
  const uid = request.auth?.uid || ''
  if (!uid) throw new Error('unauthenticated')
  const role = await getUserRole(uid)
  if (role !== 'admin') throw new Error('permission-denied')
  const payload = request.data as { targetUid: string }
  await admin.auth().deleteUser(payload.targetUid)
  await db.collection('users').doc(payload.targetUid).delete()
  return { ok: true }
})