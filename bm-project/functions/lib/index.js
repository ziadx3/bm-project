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
exports.updateRegistrationStatus = exports.updateApplicationStatus = exports.registerToProgram = exports.applyToJob = exports.createProgram = exports.createJob = void 0;
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
    const appRef = db.collection('jobApplications').doc();
    await appRef.set({ id: appRef.id, jobId: payload.jobId, seekerUid: uid, status: 'pending', createdAt: firestore_1.FieldValue.serverTimestamp(), ownerUid: jobSnap.data()?.ownerUid || null });
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
    const regRef = db.collection('programRegistrations').doc();
    await regRef.set({ id: regRef.id, programId: payload.programId, seekerUid: uid, status: 'pending', createdAt: firestore_1.FieldValue.serverTimestamp(), ownerUid: programSnap.data()?.ownerUid || null });
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
    return { ok: true };
});
