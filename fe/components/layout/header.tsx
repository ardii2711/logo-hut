import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-6xl mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          {/* Logo Placeholder */}
          <div className="h-12 w-12 rounded-lg bg-surface-container flex items-center justify-center text-on-surface font-bold text-sm">
            LOGO
          </div>
          <div className="flex flex-col">
            <span className="text-label-lg text-on-surface tracking-tight leading-tight font-bold uppercase">
              HUT ke-14 Mamuju Tengah
            </span>
            <span className="text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px]">
              Pemerintah Kabupaten Mamuju Tengah
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <a
            href="/login"
            className="inline-flex items-center text-label-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high hover:text-on-surface px-space-md py-2.5 rounded-lg transition-colors shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>Portal Panitia</span>
          </a>
        </div>
      </div>
    </header>
  );
}
