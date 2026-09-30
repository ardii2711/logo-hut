export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest mt-margin-lg shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-margin-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md py-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="h-8 w-8 rounded bg-surface-container flex items-center justify-center text-on-surface/80 font-bold text-xs">
              LOGO
            </div>
            <span className="text-body-sm text-on-surface-variant">
              © 2026 Pemerintah Kabupaten Mamuju Tengah. Seluruh Hak Cipta Dilindungi.
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="text-label-mono text-secondary tracking-wider font-semibold uppercase">
              Bumi Lalla Tassisara
            </span>
            <span className="text-on-surface-variant/40 hidden sm:inline">•</span>
            <span className="text-body-sm text-on-surface-variant">
              Helpdesk: +62 821-9876-1414
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
