import { Hourglass, BadgeCheck, Palette, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="max-w-[1240px] mx-auto px-margin md:px-margin-md lg:px-margin-lg pt-space-xl pb-margin">
      <div className="flex flex-col items-start max-w-4xl">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-sm mb-space-md">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-label-mono text-on-surface font-semibold tracking-wide uppercase">
            PENGUMPULAN DIBUKA • 29 SEP – 15 OKT 2026
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-headline-lg-mobile md:text-display-hero text-on-surface tracking-tight font-extrabold leading-tight mb-space-md">
          Sayembara Desain Logo Resmi Hari Jadi ke-14 Kabupaten Mamuju Tengah
        </h1>

        {/* Subheadline */}
        <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-3xl mb-space-lg">
          Dinas Pariwisata, Pemuda & Olahraga bersama Dinas Kominfostatisper mengundang seluruh putra-putri Mamuju Tengah menuangkan kreasi dan identitas Bumi Lalla Tassisara.
        </p>

        {/* Countdown & Quick Info */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch mb-space-lg">
          {/* Countdown Box */}
          <div className="md:col-span-5 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <Hourglass className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-mono text-on-surface-variant uppercase">
                  Sisa Waktu Pengumpulan
                </span>
                <span className="text-headline-sm text-on-surface font-bold">
                  15 Hari Lagi
                </span>
              </div>
            </div>
            <span className="text-label-md bg-surface-container-high text-on-surface px-space-sm py-1 rounded">
              23:59 WITA
            </span>
          </div>

          {/* Requirement Chips */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-3 rounded-xl shadow-sm">
              <BadgeCheck className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="text-label-lg text-on-surface">Khusus KTP Mamuju Tengah</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-3 rounded-xl shadow-sm">
              <Palette className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="text-label-lg text-on-surface">1 Peserta = 1 Karya</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-3 rounded-xl shadow-sm">
              <Award className="w-5 h-5 text-on-tertiary-container flex-shrink-0" />
              <span className="text-label-lg text-on-surface">Total Hadiah & Piagam</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
