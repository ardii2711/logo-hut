"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Send, Hash } from "lucide-react";
import { SubmissionFormData, submissionSchema } from "@/lib/validations/submission.schema";
import { InputStitch } from "@/components/ui/input-stitch";
import FileDropzone from "@/components/shared/file-dropzone";
import PanelCard from "@/components/shared/panel-card";
import api from "@/lib/api";
import type { SubmissionCreateResponse, ErrorResponse } from "@/types";
import { AxiosError } from "axios";

export default function SubmissionFormStitch() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const ktpFile = watch("ktp_file");
  const logoVectorFile = watch("logo_vector_file");
  const logoPngFile = watch("logo_png_file");
  const logoJpegFile = watch("logo_jpeg_file");
  const filosofiPdfFile = watch("filosofi_pdf_file");
  const suratPernyataanFile = watch("surat_pernyataan_file");

  const onSubmit = async (data: SubmissionFormData) => {
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("whatsapp", data.whatsapp);
      formData.append("title", data.title);
      formData.append("ktp_file", data.ktp_file[0]);
      formData.append("logo_vector_file", data.logo_vector_file[0]);
      formData.append("logo_png_file", data.logo_png_file[0]);
      formData.append("logo_jpeg_file", data.logo_jpeg_file[0]);
      formData.append("filosofi_pdf_file", data.filosofi_pdf_file[0]);
      formData.append("surat_pernyataan_file", data.surat_pernyataan_file[0]);

      const response = await api.post<SubmissionCreateResponse>(
        "/submissions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      router.push(`/success?code=${response.data.data.submissionCode}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        setServerError(errorData.error);
      } else if (error instanceof AxiosError && error.request) {
        setServerError("Koneksi gagal, periksa internet Anda");
      } else {
        setServerError("Terjadi kesalahan, coba lagi");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-space-lg">
      {serverError && (
        <div className="p-space-md bg-error-container border border-error rounded-lg">
          <p className="text-body-sm text-error font-semibold">{serverError}</p>
        </div>
      )}

      {/* PANEL 1: Identitas Peserta */}
      <PanelCard
        stepNumber={1}
        title="Identitas Peserta"
        description="Verifikasi keaslian identitas domisili Mamuju Tengah"
        stepLabel="Langkah 1/3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-label-lg text-on-surface" htmlFor="name">
              Nama Lengkap (Sesuai KTP) <span className="text-error">*</span>
            </label>
            <InputStitch
              id="name"
              placeholder="Contoh: Ahmad Fauzi Pratama"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-body-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-label-lg text-on-surface" htmlFor="whatsapp">
              Nomor WhatsApp Aktif <span className="text-error">*</span>
            </label>
            <InputStitch
              id="whatsapp"
              type="tel"
              placeholder="081234567890"
              {...register("whatsapp")}
              disabled={isSubmitting}
            />
            {errors.whatsapp && (
              <p className="text-body-sm text-error">{errors.whatsapp.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-label-lg text-on-surface" htmlFor="email">
              Alamat Email Aktif <span className="text-error">*</span>
            </label>
            <InputStitch
              id="email"
              type="email"
              placeholder="peserta@gmail.com"
              {...register("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-body-sm text-error">{errors.email.message}</p>
            )}
          </div>

          <div className="md:col-span-2 mt-space-xs">
            <FileDropzone
              label="Upload Dokumen KTP Mamuju Tengah"
              accept=".jpg,.jpeg,.png,.pdf"
              maxSizeMB={5}
              value={ktpFile}
              onChange={(files) => setValue("ktp_file", files as FileList | null)}
              error={errors.ktp_file?.message?.toString()}
              disabled={isSubmitting}
              icon="id-card"
              description="Format: JPG, PNG, atau PDF (Maksimal 5 MB)"
            />
          </div>
        </div>
      </PanelCard>

      {/* PANEL 2: File Logo */}
      <PanelCard
        stepNumber={2}
        title="File Logo"
        description="Unggah file logo dalam berbagai format sesuai persyaratan"
        stepLabel="Langkah 2/3"
      >
        <div className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-label-lg text-on-surface" htmlFor="title">
              Judul Karya Logo <span className="text-error">*</span>
            </label>
            <InputStitch
              id="title"
              placeholder="Contoh: Harmoni Agropolitan Mamuju Tengah"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-body-sm text-error">{errors.title.message}</p>
            )}
          </div>

          <FileDropzone
            label="File Vektor Logo (AI/CDR/EPS/PDF)"
            accept=".ai,.cdr,.eps,.pdf"
            maxSizeMB={45}
            value={logoVectorFile}
            onChange={(files) => setValue("logo_vector_file", files as FileList | null)}
            error={errors.logo_vector_file?.message?.toString()}
            disabled={isSubmitting}
            icon="upload"
            description="File editable asli. Format: AI, CDR, EPS, atau PDF vektor (Maks. 45 MB)"
          />

          <FileDropzone
            label="Logo PNG Transparan"
            accept=".png"
            maxSizeMB={10}
            value={logoPngFile}
            onChange={(files) => setValue("logo_png_file", files as FileList | null)}
            error={errors.logo_png_file?.message?.toString()}
            disabled={isSubmitting}
            icon="upload"
            description="Format: PNG dengan background transparan (Maks. 10 MB)"
          />

          <FileDropzone
            label="Logo JPEG High-Res"
            accept=".jpg,.jpeg"
            maxSizeMB={10}
            value={logoJpegFile}
            onChange={(files) => setValue("logo_jpeg_file", files as FileList | null)}
            error={errors.logo_jpeg_file?.message?.toString()}
            disabled={isSubmitting}
            icon="upload"
            description="Format: JPEG resolusi tinggi (Maks. 10 MB)"
          />
        </div>
      </PanelCard>

      {/* PANEL 3: Dokumen Pendukung */}
      <PanelCard
        stepNumber={3}
        title="Dokumen Pendukung"
        description="Upload filosofi logo dan surat pernyataan keaslian"
        stepLabel="Langkah 3/3"
      >
        <div className="flex flex-col gap-space-md">
          <FileDropzone
            label="Filosofi Logo (PDF)"
            accept=".pdf"
            maxSizeMB={5}
            value={filosofiPdfFile}
            onChange={(files) => setValue("filosofi_pdf_file", files as FileList | null)}
            error={errors.filosofi_pdf_file?.message?.toString()}
            disabled={isSubmitting}
            icon="upload"
            description="Deskripsi makna, elemen, dan filosofi warna. Format PDF, maksimal 300 kata (Maks. 5 MB)"
          />

          <FileDropzone
            label="Surat Pernyataan Keaslian (Bermaterai Rp10.000)"
            accept=".jpg,.jpeg,.png,.pdf"
            maxSizeMB={5}
            value={suratPernyataanFile}
            onChange={(files) => setValue("surat_pernyataan_file", files as FileList | null)}
            error={errors.surat_pernyataan_file?.message?.toString()}
            disabled={isSubmitting}
            icon="upload"
            description="Scan atau foto surat pernyataan bermaterai. Format: JPG, PNG, atau PDF (Maks. 5 MB)"
          />

          <div className="p-space-md bg-surface-container-low rounded-lg flex items-start gap-space-sm">
            <input
              type="checkbox"
              id="pernyataanHak"
              required
              disabled={isSubmitting}
              className="mt-1 w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
            />
            <label
              htmlFor="pernyataanHak"
              className="text-body-sm text-on-surface cursor-pointer select-none"
            >
              Saya menyatakan bahwa karya logo yang diajukan adalah murni hasil karya orisinal, belum pernah dipublikasikan, serta bebas dari plagiasi atau klaim hak cipta pihak manapun.
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-lg">
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <Hash className="w-4 h-4 text-secondary" />
            <span className="text-label-mono text-[11px]">
              Kode pendaftaran (MATENG-XXXXXX) otomatis terbit
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer sm:w-auto inline-flex items-center justify-center gap-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg px-space-xl py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                <span>Memproses Berkas...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Karya Sekarang</span>
              </>
            )}
          </button>
        </div>
      </PanelCard>
    </form>
  );
}
