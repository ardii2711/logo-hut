"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import SubmissionDetailComponent from "@/components/admin/submission-detail";
import type { SubmissionDetail } from "@/types";

import { AxiosError } from "axios";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/admin/submissions/${id}`);
        setSubmission(response.data.data);
      } catch (err) {
        console.error("Failed to fetch submission detail:", err);
        
        if (err instanceof AxiosError && err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError("Gagal memuat detail submission. Silakan coba lagi.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissionDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-space-md md:py-space-xl">
        <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-space-md">
              <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-body-sm text-body-sm md:font-body-md md:text-body-md text-on-surface-variant">
                Memuat detail submission...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-background py-space-md md:py-space-xl">
        <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-space-xs text-secondary hover:text-secondary/80 font-label-md text-label-md mb-space-md md:mb-space-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>

          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-space-md">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-error" />
            </div>
            <div className="text-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                Gagal Memuat Data
              </h2>
              <p className="font-body-sm text-body-sm md:font-body-md md:text-body-md text-on-surface-variant max-w-md">
                {error || "Submission tidak ditemukan."}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-space-md px-space-lg py-space-sm rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors font-label-md text-label-md"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-space-md md:py-space-xl">
      <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-md md:gap-space-lg">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-space-xs text-secondary hover:text-secondary/80 font-label-md text-label-md transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </button>

        {/* Detail Component */}
        <SubmissionDetailComponent submission={submission} />
      </div>
    </div>
  );
}
