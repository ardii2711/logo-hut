import { Award, ExternalLink } from "lucide-react";

export default function SidebarSection() {
  return (
    <div className="flex flex-col gap-space-lg">
      {/* Tahapan Seleksi */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-space-sm mb-space-md">
          <span className="text-title-md text-on-surface font-bold">Tahapan Seleksi</span>
          <span className="text-label-mono text-secondary font-semibold">ALUR RESMI</span>
        </div>
        <div className="flex flex-col gap-space-md">
          {/* Step 1 - Active */}
          <div className="flex items-start gap-space-md">
            <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-label-mono font-bold shrink-0">
              1
            </div>
            <div>
              <span className="text-label-lg text-on-surface font-semibold block leading-tight">
                Pendaftaran
              </span>
              <span className="text-body-sm text-on-surface-variant">
                29 September – 15 Oktober 2026
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-space-md">
            <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-label-mono font-bold shrink-0">
              2
            </div>
            <div>
              <span className="text-label-lg text-on-surface font-semibold block leading-tight">
                Pengiriman Karya Logo
              </span>
              <span className="text-body-sm text-on-surface-variant">
                1 – 15 Oktober 2026
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-space-md">
            <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-label-mono font-bold shrink-0">
              3
            </div>
            <div>
              <span className="text-label-lg text-on-surface font-semibold block leading-tight">
                Penjurian / Penilaian
              </span>
              <span className="text-body-sm text-on-surface-variant">
                16 - 19 Oktober 2026
              </span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-space-md">
            <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center text-label-mono font-bold shrink-0">
              4
            </div>
            <div>
              <span className="text-label-lg text-on-surface font-semibold block leading-tight">
                Pengumuman Pemenang
              </span>
              <span className="text-body-sm text-on-surface-variant">
                19 Oktober 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Hadiah */}
      <div className="bg-linear-to-br from-surface-container-high to-surface-container-lowest p-space-lg rounded-xl shadow-sm">
        <div className="flex items-center gap-space-sm mb-space-sm">
          <Award className="w-6 h-6 text-on-tertiary-container" />
          <span className="text-label-mono uppercase text-on-surface font-bold tracking-wider">
            Apresiasi & Penghargaan
          </span>
        </div>
        <p className="text-headline-sm text-on-surface font-black">
          Total Hadiah 5 Juta Rupiah
        </p>
        <p className="text-body-sm text-on-surface-variant mt-1 mb-space-md">
          Juara Utama mendapatkan Piagam Penghargaan Resmi Bupati Mamuju Tengah serta hak pengenaan logo pada kegiatan dan publikasi HUT Mateng ke-14.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
        <span className="text-title-md text-on-surface font-bold block mb-space-md">
          Pertanyaan Umum (FAQ)
        </span>
        <div className="flex flex-col gap-space-md">
          <div>
            <span className="text-label-lg text-on-surface font-medium block">
              Apakah ada biaya pendaftaran?
            </span>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Sama sekali tidak dipungut biaya (Gratis 100%).
            </p>
          </div>
          <div>
            <span className="text-label-lg text-on-surface font-medium block">
              Boleh mengirim lebih dari 1 desain?
            </span>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Setiap peserta terdaftar dengan NIK KTP hanya berhak mengumpulkan 1 karya terbaik.
            </p>
          </div>
          <div>
            <span className="text-label-lg text-on-surface font-medium block">
              Kapan file vektor master diminta?
            </span>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              File master (AI / CDR / EPS) hanya diminta panitia kepada pemenang.
            </p>
          </div>
        </div>

        {/* Helpdesk */}
        <div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant">
          <span className="text-body-sm">Ada kendala teknis?</span>
          <a
            href="https://wa.me/6281244846160"
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-lg text-secondary hover:underline flex items-center gap-1"
          >
            <span>Hubungi Panitia</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
