"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Copy, Check, Hash, MessageSquare, Download, ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";
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
        <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-12 md:py-16">
          {/* Hero Confirmation Card */}
          <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-10 md:p-12 mb-8 overflow-hidden max-w-3xl mx-auto">
            {/* Ambient celebration glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-surface-container-high/40 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Animated Success Icon */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-20 h-20 rounded-full bg-secondary-container/40 animate-ping opacity-75"></div>
                <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-secondary" strokeWidth={2.5} />
                </div>
              </div>

              {/* Security Badge */}
              <Badge className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low text-secondary mb-4 shadow-sm border-0">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-label-mono uppercase tracking-wider text-[11px] text-on-surface font-semibold">
                  Pengiriman Berhasil • Berkas Terenkripsi di Storage Aman
                </span>
              </Badge>

              {/* Headline */}
              <h1 className="text-headline-lg text-on-surface mb-3 tracking-tight">
                Karya Desain Logo Anda Berhasil Dikirim!
              </h1>

              {/* Description */}
              <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
                Terima kasih telah berpartisipasi menyemarakkan Peringatan Hari Jadi ke-14 Kabupaten Mamuju Tengah. Berkas dan dokumen Anda telah tersimpan secara resmi di sistem panitia Disporapar & Kominfo.
              </p>

              {/* Submission Code Card */}
              <div className="w-full p-6 rounded-xl bg-surface-container-low shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-label-mono uppercase tracking-wider text-on-surface-variant text-[11px] block">
                      Kode Registrasi Unik
                    </span>
                    <span className="text-headline-md font-bold tracking-widest text-on-surface select-all">
                      {code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto relative">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors text-label-lg shadow-sm"
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
                  {copied && (
                    <div className="hidden sm:block absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-inverse-surface text-inverse-on-surface text-label-mono text-[10px] whitespace-nowrap shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                      Tersalin!
                    </div>
                  )}
                </div>
              </div>

              {/* Info Text */}
              <p className="mt-3 text-body-sm text-on-surface-variant flex items-center gap-1.5 text-center">
                <span className="text-[16px]">ℹ️</span>
                Simpan kode submission ini sebagai bukti resmi. Notifikasi telah dikirim via WhatsApp & Email terdaftar.
              </p>
            </div>
          </div>

          {/* WhatsApp CTA Card */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-8 overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shadow-sm">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <Badge className="text-label-mono uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold border-0">
                    Khusus Peserta
                  </Badge>
                </div>

                {/* Title & Description */}
                <h2 className="text-title-md text-on-surface font-bold mb-2">
                  Grup WhatsApp Resmi Koordinasi Sayembara
                </h2>
                <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  Dapatkan informasi berkala terkait jadwal kurasi, pengumuman 5 besar finalis, sesi klarifikasi narasi filosofi karya, serta pembaruan teknis langsung dari Tim Panitia Disporapar & Kominfostatisper Kabupaten Mamuju Tengah.
                </p>

                {/* Benefits Checklist */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2.5 text-body-sm text-on-surface">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary flex-shrink-0" />
                    <span>Update real-time kurasi dewan juri</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-body-sm text-on-surface">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary flex-shrink-0" />
                    <span>Klarifikasi hak cipta & orisinalitas</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-body-sm text-on-surface">
                    <CheckCircle2 className="w-[18px] h-[18px] text-secondary flex-shrink-0" />
                    <span>Pengumuman pemenang & seremonial HUT</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://chat.whatsapp.com/LGLSJxiKNj5KJdwgre2Myq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-secondary text-on-secondary text-label-lg font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Gabung Grup WhatsApp Sayembara (WITA)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Subtext */}
                <p className="mt-3 text-body-sm text-on-surface-variant text-center">
                  Tautan diverifikasi aman • Hanya untuk peserta sah
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
            <button
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-on-primary text-label-lg hover:opacity-90 transition-all shadow-sm opacity-50 cursor-not-allowed"
              title="Fitur akan segera tersedia"
            >
              <Download className="w-5 h-5" />
              <span>Unduh Bukti Pengiriman (PDF / Slip)</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-label-lg hover:bg-surface-container-high transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Beranda Sayembara</span>
            </button>
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
