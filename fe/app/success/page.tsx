"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Submission Berhasil!
        </h1>
        {code && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-4">
            <p className="text-sm text-slate-600 mb-2">Kode Submission Anda:</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{code}</p>
          </div>
        )}
        <p className="text-slate-600">
          Success Page - Coming Soon (Full Implementation di FE-2)
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
