"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/login.schema";
import { InputStitch } from "@/components/ui/input-stitch";
import api from "@/lib/api";
import type { LoginResponse, ErrorResponse } from "@/types";
import { AxiosError } from "axios";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const response = await api.post<LoginResponse>("/auth/login", data);

      // Save token
      localStorage.setItem("token", response.data.data.accessToken);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        setServerError(errorData.error || "Email atau password salah");
      } else {
        setServerError("Terjadi kesalahan, coba lagi");
      }
    }
  };

  return (
    <>
      <Header />
      <main className="w-full pt-20 bg-surface">
        {/* Ambient Background */}
        <div className="relative w-full flex items-center justify-center py-8 md:py-12 lg:py-16 px-margin md:px-margin-md lg:px-margin-lg overflow-hidden">
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-surface-variant/30 blur-3xl pointer-events-none"></div>

          {/* 2-Column Grid */}
          <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
            {/* LEFT: Informasi Portal */}
            <div className="lg:col-span-6 hidden md:flex flex-col justify-center text-left py-space-md lg:pr-space-md">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-secondary-container/30 border border-secondary-container/40 text-secondary w-fit mb-space-md">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-label-mono text-[11px] font-semibold tracking-wider uppercase">Portal Resmi Panitia & Juri</span>
              </div>

              {/* Logo + Title */}
              <div className="flex items-center gap-space-md mb-space-md">
                <div className="w-20 h-20 p-2 rounded-2xl bg-surface-container-lowest shadow-md border border-surface-container-high flex items-center justify-center shrink-0">
                  <Image src="/logo.png" width={20} height={20} alt="Logo Mamuju Tengah" className="h-full w-auto object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-label-mono text-label-mono text-secondary uppercase tracking-wider text-[11px]">
                    Pemerintah Kabupaten Mamuju Tengah
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Dinas Pariwisata, Pemuda dan Olahraga</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-headline-md text-headline-md lg:text-headline-lg text-on-surface tracking-tight leading-tight mb-space-sm">
                Sayembara Desain Logo Peringatan HUT ke-14 Kabupaten Mamuju Tengah
              </h1>

              {/* Subheadline */}
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                Bumi Lalla Tassisara - Wadah kurasi, penilaian blind-review dewan juri, dan verifikasi berkas karya sayembara resmi.
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <div className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface-variant text-label-mono text-[11px]">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Sistem Verifikasi Terpadu</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface-variant text-label-mono text-[11px]">
                  <Lock className="w-4 h-4 text-secondary" />
                  <span>Kerahasiaan Karya Terjaga</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Login Form Card */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto lg:ml-auto">
              <div className="bg-surface-container-lowest rounded-xl shadow-xl p-space-lg sm:p-space-xl border border-surface-container-high relative overflow-hidden">
                {/* Gradient Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-secondary via-secondary-fixed-dim to-on-surface"></div>

                {/* Header */}
                <div className="flex flex-col text-left mb-space-lg">
                  <span className="font-label-mono text-label-mono text-secondary uppercase tracking-wider text-[11px] mb-1">
                    Autentikasi Pengguna
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Masuk Portal</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Silakan masukkan akun panitia untuk melanjutkan.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-space-md">
                  {/* Email Field */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="email" className="block font-label-lg text-label-lg text-on-surface ">
                      Alamat Email Panitia <span className="text-error">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 text-on-surface-variant w-5 h-5 pointer-events-none" />
                      <InputStitch id="email" type="email" autoComplete="username" placeholder="nama@instansi.go.id" className="pl-10" {...register("email")} />
                    </div>
                    {errors.email && <p className="text-body-sm text-error">{errors.email.message}</p>}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="password" className="block font-label-lg text-label-lg text-on-surface">
                      Kata Sandi <span className="text-error">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 text-on-surface-variant w-5 h-5 pointer-events-none" />
                      <InputStitch
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-body-sm text-error">{errors.password.message}</p>}
                  </div>

                  {/* Server Error Feedback */}
                  {serverError && (
                    <div className="p-space-sm rounded-lg font-body-sm text-body-sm bg-error-container text-on-error-container flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 cursor-pointer rounded-lg bg-primary-container hover:bg-on-surface/95 text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-md transition-all transform active:scale-[0.99] mt-space-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                        <span>Memverifikasi...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Dasbor Panitia</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Link Kembali */}
                <div className="mt-space-lg pt-space-md border-t border-surface-container-high text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                    <span>Kembali ke Beranda Sayembara</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
