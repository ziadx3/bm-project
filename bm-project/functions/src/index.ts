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
  const appRef = db.collection('jobApplications').doc()
  await appRef.set({ id: appRef.id, jobId: payload.jobId, seekerUid: uid, status: 'pending', createdAt: FieldValue.serverTimestamp(), ownerUid: jobSnap.data()?.ownerUid || null })
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
  const regRef = db.collection('programRegistrations').doc()
  await regRef.set({ id: regRef.id, programId: payload.programId, seekerUid: uid, status: 'pending', createdAt: FieldValue.serverTimestamp(), ownerUid: programSnap.data()?.ownerUid || null })
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
  return { ok: true }
})