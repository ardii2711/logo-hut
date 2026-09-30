"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Copy, Check } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="text-center">
          <p className="text-body-md text-on-surface-variant mb-4">
            Kode submission tidak ditemukan.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-space-lg py-2.5 bg-secondary text-on-secondary rounded-lg text-label-lg hover:bg-on-secondary-container transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-secondary" />
        </div>

        {/* Title */}
        <h1 className="text-headline-md text-on-surface font-bold mb-4">
          Submission Berhasil!
        </h1>

        <p className="text-body-md text-on-surface-variant mb-6">
          Terima kasih telah berpartisipasi dalam Sayembara Logo HUT ke-14 Kabupaten Mamuju Tengah.
        </p>

        {/* Submission Code Card */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant mb-6">
          <p className="text-body-sm text-on-surface-variant mb-2">Kode Submission Anda:</p>
          <p className="text-2xl font-mono font-bold text-secondary mb-4">
            {code}
          </p>
          <button
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-secondary" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-secondary-fixed/20 border border-secondary-fixed-dim/30 rounded-xl p-4 mb-6 text-left">
          <p className="text-body-sm text-on-surface font-semibold">
            Simpan kode ini untuk referensi Anda.
          </p>
          <p className="text-body-sm text-on-surface-variant mt-2">
            Panitia akan menghubungi pemenang melalui email atau WhatsApp yang telah Anda daftarkan.
          </p>
          <p className="text-body-sm text-on-surface-variant mt-2 italic">
            <strong>Catatan:</strong> Setiap peserta hanya berhak mengumpulkan 1 karya terbaik per KTP.
          </p>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full px-space-lg py-3 bg-surface-container-low hover:bg-surface-container text-on-surface text-label-lg rounded-lg transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <p className="text-body-md text-on-surface-variant">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
