export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest mt-margin-md md:mt-margin-lg shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-margin-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md py-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="text-body-sm text-on-surface-variant">
              © 2026 Pemerintah Kabupaten Mamuju Tengah. Seluruh Hak Cipta Dilindungi.
            </span>
          </div>
          <div className="flex items-start gap-space-md">
            <span className="text-label-mono text-secondary tracking-wider font-semibold uppercase">
              Bumi Lalla Tassisara
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
