"use client";

import { Hourglass, BadgeCheck } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";

export default function HeroSection() {
  const { days, hours, minutes, status, loading } = useCountdown();

  return (
    <section className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg pt-space-xl pb-margin">
      <div className="flex flex-col items-start max-w-5xl">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-sm mb-space-md">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[10px] sm:text-label-mono text-on-surface font-semibold tracking-wide uppercase">
            {status === "open" ? (
              <>
                <span className="hidden sm:inline">PENGUMPULAN DIBUKA • 1 – 15 OKT 2026</span>
                <span className="sm:hidden">DIBUKA • 1–15 OKT 2026</span>
              </>
            ) : (
              <span>PENGUMPULAN DITUTUP</span>
            )}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-headline-lg-mobile md:text-display-hero text-on-surface tracking-tight font-extrabold leading-tight mb-space-md">
          Sayembara Desain Logo Resmi Hari Jadi ke-14 Kabupaten Mamuju Tengah
        </h1>

        {/* Subheadline */}
        <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-3xl mb-space-lg">
          Dinas Pariwisata, Pemuda & Olahraga bersama Dinas Kominfostatisper mengundang seluruh putra-putri Mamuju Tengah menuangkan kreasi dan identitas Bumi
          Lalla Tassisara.
        </p>

        {/* Countdown & Quick Info */}
        <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-sm mb-space-lg text-sm md:text-label-lg text-on-surface-variant">
          {/* Countdown */}
          <div className="flex items-center gap-space-xs">
            <Hourglass className="w-4 h-4 text-secondary" />
            <span>
              {loading ? (
                <span className="font-semibold text-on-surface">Memuat...</span>
              ) : status === "closed" ? (
                <span className="font-semibold text-error">Pendaftaran ditutup</span>
              ) : (
                <>
                  <span className="font-semibold text-on-surface">
                    {days} hari {hours} jam {minutes} menit lagi
                  </span>
                  <span className="hidden sm:inline"> • Pengumpulan sampai 23:59 WITA</span>
                </>
              )}
            </span>
          </div>

          <span className="hidden md:block text-outline">•</span>

          {/* Requirement */}
          <div className="flex items-center gap-space-xs">
            <BadgeCheck className="w-4 h-4 text-secondary" />
            <span className="text-xs sm:text-sm md:text-label-lg">Khusus KTP Mamuju Tengah</span>
          </div>
        </div>
      </div>
    </section>
  );
}
