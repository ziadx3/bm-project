"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

type Role = "company" | "jobSeeker" | "admin";

type AuthState = {
  user: User | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, role: Role, extra?: Record<string, unknown>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(() => {
    if (typeof window !== 'undefined') {
      const r = window.localStorage.getItem('bm_role') as Role | null
      return r || null
    }
    return null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {})
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await fetchRole(u.uid);
      } else {
        setRole(null);
        if (typeof window !== 'undefined') window.localStorage.removeItem('bm_role')
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const fetchRole = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.data() as { role?: Role } | undefined;
      const r = (data?.role ?? null) as Role | null
      setRole(r);
      if (typeof window !== 'undefined') {
        if (r) window.localStorage.setItem('bm_role', r)
      }
    } catch (e) {
      setRole(null);
    }
  };

  const refreshRole = async () => {
    if (user?.uid) await fetchRole(user.uid);
  };

  const signup = async (
    email: string,
    password: string,
    r: Role,
    extra: Record<string, unknown> = {}
  ) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        role: r,
        createdAt: serverTimestamp(),
        ...extra,
      });
      await fetchRole(uid);
      notify('تم إنشاء الحساب بنجاح', 'success')
    } catch (e: any) {
      const code = e?.code || "";
      if (code === "auth/configuration-not-found") {
        setError("تعذّر إعداد المصادقة. تأكد من مفاتيح Firebase وتمكين موفر البريد وكلمة المرور.");
      } else if (code === "auth/invalid-api-key") {
        setError("مفتاح Firebase غير صحيح.");
      } else {
        setError(e?.message || "حدث خطأ أثناء إنشاء الحساب");
      }
      notify(e?.message || 'تعذّر إنشاء الحساب', 'error')
      throw e;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notify('تم تسجيل الدخول بنجاح', 'success')
    } catch (e: any) {
      notify(e?.message || 'تعذّر تسجيل الدخول', 'error')
      throw e
    }
  };

  const logout = async () => {
    await signOut(auth);
    setRole(null);
    if (typeof window !== 'undefined') window.localStorage.removeItem('bm_role')
    notify('تم تسجيل الخروج', 'info')
  };

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }

  const value = useMemo<AuthState>(() => ({
    user,
    role,
    loading,
    error,
    signup,
    login,
    logout,
    refreshRole,
    notify,
  }), [user, role, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {notifications.map(n => (
          <div key={n.id} className={`px-4 py-3 rounded-lg border shadow-sm ${n.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : n.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>{n.message}</div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}