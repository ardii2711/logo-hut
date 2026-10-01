"use client";

import { Download, FileText, User, BookOpen, Image as ImageIconLucide } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import type { SubmissionDetail } from "@/types";

interface SubmissionDetailProps {
  submission: SubmissionDetail;
}

export default function SubmissionDetailComponent({ submission }: SubmissionDetailProps) {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy, HH:mm", { locale: id }) + " WITA";
    } catch {
      return dateString;
    }
  };

  const handleDownloadLogo = async () => {
    if (!submission.logoFileUrl) return;

    try {
      const response = await fetch(submission.logoFileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logo-${submission.submissionCode}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      // Fallback: open in new tab
      window.open(submission.logoFileUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-space-md lg:gap-space-lg">
      {/* Header Card - Kode + Judul + Download */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg lg:p-space-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-secondary/10 text-secondary font-label-mono text-label-mono tracking-widest uppercase border border-secondary/20">
              {submission.submissionCode}
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface tracking-tight leading-tight">
            {submission.title}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 pt-0.5">
            <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dikirim pada: {formatDateTime(submission.createdAt)}</span>
          </p>
        </div>
        <div className="shrink-0">
          {submission.logoFileUrl ? (
            <button
              onClick={handleDownloadLogo}
              className="inline-flex items-center justify-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg shadow-sm hover:bg-secondary/90 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Unduh Berkas Logo</span>
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-surface-container-low text-on-surface-variant cursor-not-allowed font-label-lg text-label-lg shadow-sm opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>File Tidak Tersedia</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-space-lg xl:gap-space-xl">
        {/* Left Column - Preview Logo */}
        <div className="lg:col-span-6 flex flex-col gap-space-md lg:gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg lg:p-space-xl shadow-sm flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/30 mb-space-md">
              <div className="flex items-center gap-space-xs">
                <ImageIconLucide className="text-secondary w-5 h-5 md:w-6 md:h-6" />
                <h2 className="font-title-md text-title-md text-on-surface">Pratinjau Logo</h2>
              </div>
            </div>

            {/* Logo Preview Container */}
            {submission.logoFileUrl ? (
              <div className="w-full flex-1 min-h-80 md:min-h-95 rounded-lg bg-surface-container-low/60 border border-outline-variant/30 flex items-center justify-center p-space-md md:p-space-lg">
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={submission.logoFileUrl}
                    alt={submission.title}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full object-contain"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="w-full flex-1 min-h-80 md:min-h-95 rounded-lg bg-surface-container-low/60 border border-outline-variant/30 flex items-center justify-center p-space-lg">
                <div className="text-center">
                  <ImageIconLucide className="w-16 h-16 text-outline-variant mx-auto mb-2 opacity-50" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">File logo tidak tersedia</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="lg:col-span-6 flex flex-col gap-space-md lg:gap-space-lg">
          {/* Informasi Peserta */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg lg:p-space-xl shadow-sm">
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/30 mb-space-md">
              <div className="flex items-center gap-space-xs">
                <User className="text-secondary w-5 h-5 md:w-6 md:h-6" />
                <h2 className="font-title-md text-title-md text-on-surface">Informasi Peserta</h2>
              </div>
              {submission.ktpFileUrl ? (
                <a
                  href={submission.ktpFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
                >
                  <FileText className="w-4 h-4 text-secondary" />
                  <span>Lihat Foto KTP Peserta</span>
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant cursor-not-allowed font-label-md text-label-md opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>KTP Tidak Tersedia</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <div className="md:col-span-2 p-space-sm px-space-md rounded-lg bg-surface-container-low">
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

          {/* Deskripsi & Filosofi Logo */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg lg:p-space-xl shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-space-xs pb-space-md border-b border-outline-variant/30 mb-space-md">
              <BookOpen className="text-secondary w-5 h-5 md:w-6 md:h-6" />
              <h2 className="font-title-md text-title-md text-on-surface">Deskripsi & Filosofi Logo</h2>
            </div>

            <div className="space-y-space-sm text-on-surface font-body-md text-body-md leading-relaxed flex-1">
              <div className="p-space-md rounded-lg bg-surface-container-low border-l-4 border-secondary">
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">{submission.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
