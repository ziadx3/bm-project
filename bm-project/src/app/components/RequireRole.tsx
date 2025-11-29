"use client";
import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

export default function RequireRole({ allowed, children }: { allowed: Array<"company" | "jobSeeker" | "admin">; children: ReactNode }) {
  const { user, role, loading, refreshRole } = useAuth();
  const router = useRouter();
  const effectiveRole = useMemo(() => {
    if (role) return role as any
    if (typeof window !== 'undefined') {
      const r = window.localStorage.getItem('bm_role') as any
      return r || null
    }
    return null
  }, [role])

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (effectiveRole && !allowed.includes(effectiveRole)) {
        const dest = effectiveRole === "company" ? "/dashboard/company" : effectiveRole === "jobSeeker" ? "/dashboard/seeker" : "/dashboard/admin";
        router.push(dest);
      } else if (!effectiveRole) {
        refreshRole().catch(() => {})
      }
    }
  }, [user, effectiveRole, loading, router, allowed, refreshRole]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  if (!effectiveRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  if (!allowed.includes(effectiveRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  return <>{children}</>;
}