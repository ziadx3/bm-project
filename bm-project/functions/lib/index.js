"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteUser = exports.adminSetUserDisabled = exports.adminSetUserRole = exports.updateRegistrationStatus = exports.updateApplicationStatus = exports.registerToProgram = exports.applyToJob = exports.createProgram = exports.createJob = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = (0, firestore_1.getFirestore)();
async function getUserRole(uid) {
    const snap = await db.collection('users').doc(uid).get();
    const data = snap.data();
    return data?.role || null;
}
async function createNotification(userUid, type, title, body, meta) {
    const ref = db.collection('notifications').doc();
    await ref.set({
        id: ref.id,
        userUid,
        type,
        title,
        body,
        meta: meta || null,
        read: false,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
}
exports.createJob = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'company')
        throw new Error('permission-denied');
    const payload = request.data;
    const docRef = db.collection('jobs').doc();
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { id: docRef.id };
});
exports.createProgram = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'company')
        throw new Error('permission-denied');
    const payload = request.data;
    const docRef = db.collection('trainingPrograms').doc();
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { id: docRef.id };
});
exports.applyToJob = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'jobSeeker')
        throw new Error('permission-denied');
    const payload = request.data;
    const jobSnap = await db.collection('jobs').doc(payload.jobId).get();
    if (!jobSnap.exists)
        throw new Error('not-found');
    const dupQ = await db.collection('jobApplications')
        .where('jobId', '==', payload.jobId)
        .where('seekerUid', '==', uid)
        .limit(1)
        .get();
    if (!dupQ.empty)
        throw new Error('already-applied');
    const userSnap = await db.collection('users').doc(uid).get();
    const u = userSnap.data() || {};
    const appRef = db.collection('jobApplications').doc();
    await appRef.set({ id: appRef.id, jobId: payload.jobId, seekerUid: uid, status: 'pending', createdAt: firestore_1.FieldValue.serverTimestamp(), ownerUid: jobSnap.data()?.ownerUid || null,
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
    });
    const ownerUid = jobSnap.data()?.ownerUid;
    if (ownerUid) {
        await createNotification(ownerUid, 'job_application', 'طلب تقديم جديد', `${u.firstName || ''} ${u.lastName || ''} قدّم على وظيفة ${jobSnap.data()?.title || ''}`, { jobId: payload.jobId, applicationId: appRef.id, seekerUid: uid });
    }
    return { id: appRef.id };
});
exports.registerToProgram = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'jobSeeker')
        throw new Error('permission-denied');
    const payload = request.data;
    const programSnap = await db.collection('trainingPrograms').doc(payload.programId).get();
    if (!programSnap.exists)
        throw new Error('not-found');
    const dupQ = await db.collection('programRegistrations')
        .where('programId', '==', payload.programId)
        .where('seekerUid', '==', uid)
        .limit(1)
        .get();
    if (!dupQ.empty)
        throw new Error('already-registered');
    const userSnapR = await db.collection('users').doc(uid).get();
    const ur = userSnapR.data() || {};
    const regRef = db.collection('programRegistrations').doc();
    await regRef.set({ id: regRef.id, programId: payload.programId, seekerUid: uid, status: 'pending', createdAt: firestore_1.FieldValue.serverTimestamp(), ownerUid: programSnap.data()?.ownerUid || null,
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
    });
    const ownerUid = programSnap.data()?.ownerUid;
    if (ownerUid) {
        await createNotification(ownerUid, 'program_registration', 'تسجيل جديد في برنامج', `${ur.firstName || ''} ${ur.lastName || ''} سجّل في برنامج ${programSnap.data()?.title || ''}`, { programId: payload.programId, registrationId: regRef.id, seekerUid: uid });
    }
    return { id: regRef.id };
});
exports.updateApplicationStatus = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'company' && role !== 'admin')
        throw new Error('permission-denied');
    const payload = request.data;
    const appRef = db.collection('jobApplications').doc(payload.applicationId);
    const snap = await appRef.get();
    if (!snap.exists)
        throw new Error('not-found');
    const data = snap.data();
    if (data.ownerUid !== uid && role !== 'admin')
        throw new Error('permission-denied');
    await appRef.update({ status: payload.status });
    const seekerUid = data.seekerUid;
    const jobTitle = (await db.collection('jobs').doc(data.jobId).get()).data()?.title || '';
    if (seekerUid) {
        const title = payload.status === 'accepted' ? 'تم قبول طلبك' : payload.status === 'rejected' ? 'تم رفض طلبك' : 'تم إرجاع طلبك للمراجعة';
        const body = `حالة طلب وظيفة ${jobTitle}: ${payload.status}`;
        await createNotification(seekerUid, 'application_status', title, body, { applicationId: payload.applicationId, jobId: data.jobId, status: payload.status });
    }
    return { ok: true };
});
exports.updateRegistrationStatus = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'company' && role !== 'admin')
        throw new Error('permission-denied');
    const payload = request.data;
    const regRef = db.collection('programRegistrations').doc(payload.registrationId);
    const snap = await regRef.get();
    if (!snap.exists)
        throw new Error('not-found');
    const data = snap.data();
    if (data.ownerUid !== uid && role !== 'admin')
        throw new Error('permission-denied');
    await regRef.update({ status: payload.status });
    const seekerUid = data.seekerUid;
    const programTitle = (await db.collection('trainingPrograms').doc(data.programId).get()).data()?.title || '';
    if (seekerUid) {
        const title = payload.status === 'accepted' ? 'تم قبول تسجيلك' : payload.status === 'rejected' ? 'تم رفض تسجيلك' : 'تم إرجاع تسجيلك للمراجعة';
        const body = `حالة تسجيل برنامج ${programTitle}: ${payload.status}`;
        await createNotification(seekerUid, 'registration_status', title, body, { registrationId: payload.registrationId, programId: data.programId, status: payload.status });
    }
    return { ok: true };
});
exports.adminSetUserRole = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'admin')
        throw new Error('permission-denied');
    const payload = request.data;
    await db.collection('users').doc(payload.targetUid).update({ role: payload.role });
    return { ok: true };
});
exports.adminSetUserDisabled = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'admin')
        throw new Error('permission-denied');
    const payload = request.data;
    await admin.auth().updateUser(payload.targetUid, { disabled: payload.disabled });
    await db.collection('users').doc(payload.targetUid).update({ disabled: payload.disabled });
    return { ok: true };
});
exports.adminDeleteUser = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid || '';
    if (!uid)
        throw new Error('unauthenticated');
    const role = await getUserRole(uid);
    if (role !== 'admin')
        throw new Error('permission-denied');
    const payload = request.data;
    await admin.auth().deleteUser(payload.targetUid);
    await db.collection('users').doc(payload.targetUid).delete();
    return { ok: true };
});
