"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Send, Hash } from "lucide-react";
import { SubmissionFormData, submissionSchema } from "@/lib/validations/submission.schema";
import { InputStitch } from "@/components/ui/input-stitch";
import { TextareaStitch } from "@/components/ui/textarea-stitch";
import FileDropzone from "@/components/shared/file-dropzone";
import PanelCard from "@/components/shared/panel-card";
import api from "@/lib/api";
import type { SubmissionCreateResponse, ErrorResponse } from "@/types";
import { AxiosError } from "axios";

export default function SubmissionFormStitch() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

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
  const logoFile = watch("logo_file");
  const description = watch("description") || "";

  // Update character count
  useEffect(() => {
    setCharCount(description.length);
  }, [description]);

  const onSubmit = async (data: SubmissionFormData) => {
    setServerError(null);

    try {
      // Build FormData
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("whatsapp", data.whatsapp);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("ktp_file", data.ktp_file[0]);
      formData.append("logo_file", data.logo_file[0]);

      // Submit to API
      const response = await api.post<SubmissionCreateResponse>(
        "/submissions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Redirect to success page
      router.push(`/success?code=${response.data.data.submissionCode}`);
    } catch (error) {
      // Handle errors
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        setServerError(errorData.error);
      } else if (error instanceof AxiosError && error.request) {
        setServerError("Koneksi gagal, periksa internet Anda");
      } else {
        setServerError("Terjadi kesalahan, coba lagi");
      }

      // Scroll to error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-space-lg">
      {/* Server Error Alert */}
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
          {/* Nama Lengkap */}
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

          {/* WhatsApp */}
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

          {/* Email */}
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

          {/* KTP Upload */}
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

      {/* PANEL 2: Karya Logo & Narasi */}
      <PanelCard
        stepNumber={2}
        title="Karya Logo & Narasi Filosofi"
        description="Unggah aset visual beresolusi tinggi beserta argumentasi konseptual"
        stepLabel="Langkah 2/3"
      >
        <div className="flex flex-col gap-space-md">
          {/* Judul Karya */}
          <div className="flex flex-col gap-1.5">
            <label className="text-label-lg text-on-surface" htmlFor="title">
              Judul / Tema Spesifik Karya Logo <span className="text-error">*</span>
            </label>
            <InputStitch
              id="title"
              placeholder="Contoh: Harmoni Lalla Tassisara Menuju Mamuju Tengah Gemilang"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-body-sm text-error">{errors.title.message}</p>
            )}
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-label-lg text-on-surface">
                Upload Berkas Logo Final <span className="text-error">*</span>
              </span>
              <span className="text-label-mono text-secondary">
                Disarankan Background Transparan
              </span>
            </div>
            <FileDropzone
              label=""
              accept=".png,.jpg,.jpeg"
              maxSizeMB={10}
              value={logoFile}
              onChange={(files) => setValue("logo_file", files as FileList | null)}
              error={errors.logo_file?.message?.toString()}
              disabled={isSubmitting}
              icon="upload"
              description="Format: PNG atau JPEG Resolusi Tinggi (Maks. 10 MB)"
            />
          </div>

          {/* Deskripsi & Filosofi */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-label-lg text-on-surface" htmlFor="description">
                Deskripsi & Narasi Filosofi Logo <span className="text-error">*</span>
              </label>
              <span className={`text-label-mono ${charCount > 2000 ? 'text-error' : 'text-on-surface-variant'}`}>
                {charCount} / 2000 Karakter
              </span>
            </div>
            <TextareaStitch
              id="description"
              rows={6}
              placeholder="Jelaskan makna, filosofi, elemen visual, dan warna yang digunakan serta pesan yang ingin disampaikan melalui logo."
              {...register("description")}
              onChange={(e) => {
                register("description").onChange(e);
                setCharCount(e.target.value.length);
              }}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-body-sm text-error">{errors.description.message}</p>
            )}
          </div>
        </div>
      </PanelCard>

      {/* PANEL 3: Pernyataan & Finalisasi */}
      <PanelCard
        stepNumber={3}
        title="Pernyataan & Finalisasi Pengiriman"
        description="Validasi hukum orisinalitas hak cipta desain"
        stepLabel="Langkah 3/3"
      >
        {/* Checkbox Pernyataan */}
        <div className="p-space-md bg-surface-container-low rounded-lg mb-space-lg flex items-start gap-space-sm">
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
            Saya menyatakan dengan sesungguhnya bahwa karya desain logo yang diajukan adalah murni hasil karya orisinal pribadi, belum pernah dipublikasikan, serta bebas dari segala bentuk plagiasi atau klaim hak cipta pihak manapun.
          </label>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <Hash className="w-4 h-4 text-secondary" />
            <span className="text-label-mono text-[11px]">
              Kode pendaftaran (cth: MATENG-XXXXXX) otomatis terbit
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
