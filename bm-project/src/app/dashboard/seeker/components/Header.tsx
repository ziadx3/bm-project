"use client";
import Image from "next/image";

export default function SeekerHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-primary/10 via-white to-secondary/10">
      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-600 md:text-lg">{subtitle}</p>
          </div>
          <Image src="/identity/primary-logo.png" alt="Logo" width={120} height={48} className="hidden md:block opacity-80" />
        </div>
      </div>
    </div>
  )
}