"use client";

import { useState } from "react";
import { Download, FileText, User, Image as ImageIconLucide, File } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import type { SubmissionDetail } from "@/types";

interface SubmissionDetailProps {
  submission: SubmissionDetail;
}

export default function SubmissionDetailComponent({ submission }: SubmissionDetailProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "files" | "docs">("preview");
  const files = submission?.files || {};

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = parseISO(dateString);

      if (!isValid(date)) {
        const fallbackDate = new Date(dateString);
        if (!isValid(fallbackDate)) return dateString;
        return format(fallbackDate, "dd MMMM yyyy, HH:mm", { locale: id }) + " WITA";
      }

      return format(date, "dd MMMM yyyy, HH:mm", { locale: id }) + " WITA";
    } catch {
      return dateString || "-";
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Download gagal: HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();

      const contentDisposition = response.headers.get("content-disposition") || "";

      const dispositionMatch = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)|filename="?([^";]+)"?/i);

      let originalFilename = "";

      try {
        originalFilename = decodeURIComponent((dispositionMatch?.[1] || dispositionMatch?.[2] || "").trim().replace(/^"|"$/g, ""));
      } catch {
        originalFilename = (dispositionMatch?.[1] || dispositionMatch?.[2] || "").trim();
      }

      let extension = originalFilename.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase();

      if (!extension) {
        try {
          const pathname = new URL(url).pathname;

          extension = pathname.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase();
        } catch {
          // URL tidak dapat diproses.
        }
      }

      if (!extension) {
        const mimeExtensions: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/svg+xml": "svg",
          "application/pdf": "pdf",
          "application/postscript": "eps",
          "application/illustrator": "ai",
          "application/x-coreldraw": "cdr",
        };

        extension = mimeExtensions[contentType];
      }

      const baseFilename = filename.replace(/\.[^.]+$/, "");

      const finalFilename = extension ? `${baseFilename}.${extension}` : baseFilename;

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = blobUrl;
      a.download = finalFilename;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-col gap-space-md lg:gap-space-lg">
      {/* Header Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm">
        <div className="flex items-center gap-space-sm flex-wrap mb-space-xs">
          <span className="px-space-sm py-0.5 rounded bg-secondary/10 text-secondary font-label-mono text-label-mono tracking-widest uppercase border border-secondary/20">
            {submission.submissionCode}
          </span>
        </div>

        <h1 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface tracking-tight leading-tight mb-space-xs">
          {submission.title}
        </h1>

        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Dikirim pada: {formatDateTime(submission.createdAt)}</span>
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-space-lg">
        {/* Left Column - Tabs & Content */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-outline-variant">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-space-md cursor-pointer py-space-sm font-label-lg text-label-lg border-b-2 transition-colors ${
                activeTab === "preview" ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Preview Logo
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={`px-space-md cursor-pointer py-space-sm font-label-lg text-label-lg border-b-2 transition-colors ${
                activeTab === "files" ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              File Logo
            </button>

            <button
              onClick={() => setActiveTab("docs")}
              className={`px-space-md cursor-pointer py-space-sm font-label-lg text-label-lg border-b-2 transition-colors ${
                activeTab === "docs" ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Dokumen
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm min-h-[400px]">
            {activeTab === "preview" && (
              <div className="flex flex-col gap-space-md h-full">
                <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                  <ImageIconLucide className="w-5 h-5 text-secondary" />
                  Pratinjau Logo
                </h3>

                <div className="flex-1 rounded-lg bg-surface-container-low/60 border border-outline-variant/30 flex items-center justify-center p-space-lg min-h-[320px]">
                  {files.logoPng ? (
                    <Image
                      src={files.logoPng}
                      alt={submission.title || "Logo Preview"}
                      width={600}
                      height={600}
                      className="max-w-full max-h-full object-contain"
                      priority
                      loading="lazy"
                    />
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">Pratinjau logo tidak tersedia</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="flex flex-col gap-space-sm">
                <h3 className="font-title-md text-title-md text-on-surface mb-space-xs">File Logo</h3>

                <button
                  onClick={() => handleDownload(submission.files.logoVector, `${submission.submissionCode}-vector`)}
                  className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <File className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <p className="font-label-lg text-label-lg text-on-surface">File Vektor Logo</p>
                      <p className="text-body-sm text-on-surface-variant">AI/EPS/CDR/PDF</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-secondary" />
                </button>

                <a
                  href={submission.files.logoPng}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <ImageIconLucide className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <p className="font-label-lg text-label-lg text-on-surface">Logo PNG Transparan</p>
                      <p className="text-body-sm text-on-surface-variant">Format PNG</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-secondary" />
                </a>

                <button
                  onClick={() => handleDownload(submission.files.logoJpeg, `${submission.submissionCode}-jpeg`)}
                  className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <ImageIconLucide className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <p className="font-label-lg text-label-lg text-on-surface">Logo JPEG High-Res</p>
                      <p className="text-body-sm text-on-surface-variant">Format JPEG</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-secondary" />
                </button>
              </div>
            )}

            {activeTab === "docs" && (
              <div className="flex flex-col gap-space-sm">
                <h3 className="font-title-md text-title-md text-on-surface mb-space-xs">Dokumen Pendukung</h3>

                <button
                  onClick={() => handleDownload(submission.files.filosofiPdf, `${submission.submissionCode}-filosofi`)}
                  className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <p className="font-label-lg text-label-lg text-on-surface">Filosofi Logo</p>
                      <p className="text-body-sm text-on-surface-variant">Format PDF</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-secondary" />
                </button>

                <button
                  onClick={() => handleDownload(submission.files.suratPernyataan, `${submission.submissionCode}-surat`)}
                  className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <p className="font-label-lg text-label-lg text-on-surface">Surat Pernyataan Keaslian</p>
                      <p className="text-body-sm text-on-surface-variant">Bermaterai Rp10.000</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-secondary" />
                </button>

                <button
                  onClick={() => handleDownload(submission.files.ktp, `${submission.submissionCode}-ktp`)}
                  className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-space-sm">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div className="text-left">
                      <p className="font-label-lg text-label-lg text-on-surface">Fotocopy KTP</p>
                      <p className="text-body-sm text-on-surface-variant">KTP Mamuju Tengah</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-secondary" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Info Peserta */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm">
            <div className="flex items-center gap-space-xs pb-space-md border-b border-outline-variant/30 mb-space-md">
              <User className="text-secondary w-5 h-5" />
              <h2 className="font-title-md text-title-md text-on-surface">Informasi Peserta</h2>
            </div>

            <div className="grid grid-cols-1 gap-space-sm">
              <div className="p-space-sm px-space-md rounded-lg bg-surface-container-low">
                <span className="font-label-mono text-label-mono text-on-surface-variant block uppercase text-xs">Nama Lengkap</span>
                <span className="font-title-md text-title-md text-on-surface mt-0.5 block">{submission.name}</span>
              </div>

              <div className="p-space-sm px-space-md rounded-lg bg-surface-container-low">
                <span className="font-label-mono text-label-mono text-on-surface-variant block uppercase text-xs">Alamat Email</span>
                <span className="font-body-sm text-body-sm text-on-surface mt-0.5 block truncate">{submission.email}</span>
              </div>

              <div className="p-space-sm px-space-md rounded-lg bg-surface-container-low">
                <span className="font-label-mono text-label-mono text-on-surface-variant block uppercase text-xs">Nomor WhatsApp</span>
                <span className="font-body-sm text-body-sm text-on-surface mt-0.5 block">{submission.whatsapp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
