"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Copy, Check, Hash, MessageSquare, Download, ShieldCheck, ExternalLink } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
    <>
      <Header />
      <main className="w-full pt-16 sm:pt-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-8 sm:py-12 md:py-16">
          {/* Hero Section - Full Width */}
          <div className="text-center mb-8 sm:mb-10">
            {/* Animated Success Icon */}
            <div className="relative flex items-center justify-center mb-4 sm:mb-6">
              <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container/40 animate-ping opacity-75"></div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" strokeWidth={2.5} />
              </div>
            </div>

            {/* Security Badge */}
            <Badge className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-surface-container-low text-secondary mb-3 sm:mb-4 shadow-sm border-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-label-mono uppercase tracking-wider text-on-surface font-semibold">
                Pengiriman Berhasil • Berkas Terenkripsi di Storage Aman
              </span>
            </Badge>

            {/* Headline */}
            <h1 className="text-headline-lg-mobile sm:text-headline-lg text-on-surface mb-3 tracking-tight px-4">
              Karya Desain Logo Anda Berhasil Dikirim!
            </h1>

            {/* Description */}
            <p className="text-body-md sm:text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed px-4">
              Terima kasih telah berpartisipasi menyemarakkan Peringatan Hari Jadi ke-14 Kabupaten Mamuju Tengah. Berkas dan dokumen Anda telah tersimpan secara resmi di sistem panitia Disporapar & Kominfo.
            </p>
          </div>

          {/* Two Column Grid: Konfirmasi (Left) + WhatsApp CTA (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* LEFT: Confirmation Card */}
            <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-5 sm:p-6 overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-title-md text-on-surface font-bold mb-4 sm:mb-5">Detail Konfirmasi</h2>

                {/* Submission Code Card */}
                <div className="w-full p-4 sm:p-5 rounded-lg bg-surface-container-low shadow-sm mb-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm shrink-0">
                      <Hash className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-label-mono uppercase tracking-wider text-on-surface-variant text-[10px] sm:text-[11px] block mb-1">
                        Kode Registrasi Unik
                      </span>
                      <span className="text-xl sm:text-headline-md font-bold tracking-widest text-on-surface select-all block break-all">
                        {code}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors text-label-lg shadow-sm relative"
                  >
                    {copied ? (
                      <>
                        <Check className="w-[18px] h-[18px] text-secondary" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-[18px] h-[18px] text-secondary" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-body-sm text-on-surface-variant flex items-start gap-2 mb-5">
                  <span className="text-[16px] shrink-0">ℹ️</span>
                  <span>Simpan kode submission ini sebagai bukti resmi. Notifikasi telah dikirim via WhatsApp & Email terdaftar.</span>
                </p>

                {/* Download PDF Button */}
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-lg bg-primary text-on-primary text-label-lg font-semibold hover:opacity-90 transition-all shadow-md opacity-50 cursor-not-allowed"
                  title="Fitur akan segera tersedia"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Unduh Bukti Pengiriman (PDF / Slip)</span>
                </button>
              </div>
            </div>

            {/* RIGHT: WhatsApp CTA Card */}
            <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-5 sm:p-6 overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-secondary-container/20 rounded-bl-full pointer-events-none"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shadow-sm">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <Badge className="text-label-mono uppercase tracking-wider text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold border-0">
                    Khusus Peserta
                  </Badge>
                </div>

                {/* Title & Description */}
                <h2 className="text-base sm:text-title-md text-on-surface font-bold mb-2">
                  Grup WhatsApp Resmi Koordinasi Sayembara
                </h2>
                <p className="text-body-sm sm:text-body-md text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
                  Dapatkan informasi berkala terkait jadwal kurasi, pengumuman 5 besar finalis, sesi klarifikasi narasi filosofi karya, serta pembaruan teknis langsung dari Tim Panitia.
                </p>

                {/* Benefits Checklist */}
                <div className="space-y-2 mb-5 sm:mb-6">
                  <div className="flex items-start gap-2.5 text-body-sm text-on-surface">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary shrink-0 mt-0.5" />
                    <span>Update real-time kurasi dewan juri</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-body-sm text-on-surface">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary shrink-0 mt-0.5" />
                    <span>Klarifikasi hak cipta & orisinalitas</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-body-sm text-on-surface">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary shrink-0 mt-0.5" />
                    <span>Pengumuman pemenang & seremonial HUT</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://chat.whatsapp.com/LGLSJxiKNj5KJdwgre2Myq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-lg bg-secondary text-on-secondary text-sm sm:text-label-lg font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Gabung Grup WhatsApp Sayembara</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Subtext */}
                <p className="mt-3 text-body-sm text-on-surface-variant text-center">
                  Tautan diverifikasi aman • Hanya untuk peserta sah
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
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
