"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useDebounce } from "@/hooks/use-debounce";
import type { Submission, PaginationMeta } from "@/types";

interface SubmissionsTableProps {
  submissions: Submission[];
  isLoading: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  totalCount: number;
}

export default function SubmissionsTable({ submissions, isLoading, pagination, onPageChange, onSearch, totalCount }: SubmissionsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm", { locale: id }) + " WITA";
    } catch {
      return "";
    }
  };

  return (
    <section className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      {/* Search Bar + Total Count */}
      <div className="p-space-md md:p-space-lg bg-surface-container-lowest">
        <div className="flex items-center gap-space-md">
          <div className="relative flex-1">
            <Search className="absolute left-space-md top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode registrasi, nama peserta, atau judul..."
              className="w-full h-11 pl-11 pr-space-md bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006a61] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="w-full overflow-x-auto hidden md:block">
        <table className="w-full text-left min-w-4xl">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
              <th className="py-space-md px-space-md pl-space-lg text-center w-16">No</th>
              <th className="py-space-md px-space-md w-44">Kode Registrasi</th>
              <th className="py-space-md px-space-md">Peserta</th>
              <th className="py-space-md px-space-md">Judul / Konsep Desain</th>
              <th className="py-space-md px-space-md w-36">Waktu Kirim</th>
              <th className="py-space-md px-space-md pr-space-lg w-36 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-surface-container-low">
                  <td className="py-space-md px-space-md pl-space-lg text-center">
                    <div className="w-8 h-4 bg-surface-container-low rounded animate-pulse mx-auto"></div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="w-32 h-6 bg-surface-container-low rounded animate-pulse"></div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="w-40 h-5 bg-surface-container-low rounded animate-pulse"></div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="w-3/4 h-5 bg-surface-container-low rounded animate-pulse"></div>
                      <div className="w-full h-4 bg-surface-container-low rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-surface-container-low rounded animate-pulse"></div>
                      <div className="w-20 h-3 bg-surface-container-low rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md pr-space-lg text-right">
                    <div className="w-24 h-8 bg-surface-container-low rounded animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-space-xl text-center">
                  <div className="flex flex-col items-center gap-space-sm">
                    <Search className="w-12 h-12 text-outline-variant opacity-50" />
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                      {searchQuery ? "Tidak ada hasil yang ditemukan" : "Belum ada karya yang dikumpulkan"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              submissions.map((submission, index) => {
                const rowNumber = (pagination.page - 1) * pagination.limit + index + 1;
                return (
                  <tr
                    key={submission.id}
                    onClick={() => handleRowClick(submission.id)}
                    className="group hover:bg-surface-container-low/70 transition-colors cursor-pointer border-b border-surface-container-low/50"
                  >
                    <td className="py-space-md px-space-md pl-space-lg text-center font-label-mono text-label-mono text-outline">
                      {String(rowNumber).padStart(2, "0")}
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="inline-flex items-center gap-space-xs font-label-mono text-label-mono text-on-surface bg-surface-container-high px-space-sm py-1 rounded">
                        {submission.submissionCode}
                      </span>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="font-title-md text-title-md text-on-surface">{submission.name}</span>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="font-body-md text-body-md text-on-surface line-clamp-2">{submission.title}</span>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface">{formatDate(submission.createdAt)}</span>
                        <span className="font-label-mono text-label-mono text-outline">{formatTime(submission.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md pr-space-lg text-right">
                      <button className="inline-flex items-center justify-end gap-1 px-space-md py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white cursor-pointer transition-colors font-label-md text-label-md">
                        Lihat Detail
                        <span className="text-lg leading-none">→</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Card Layout - Mobile */}
      <div className="md:hidden divide-y divide-surface-container-low">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-space-md space-y-space-sm">
              <div className="w-32 h-6 bg-surface-container-low rounded animate-pulse"></div>
              <div className="w-40 h-5 bg-surface-container-low rounded animate-pulse"></div>
              <div className="w-full h-4 bg-surface-container-low rounded animate-pulse"></div>
              <div className="flex justify-between">
                <div className="w-24 h-4 bg-surface-container-low rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-surface-container-low rounded animate-pulse"></div>
              </div>
            </div>
          ))
        ) : submissions.length === 0 ? (
          <div className="py-space-xl text-center">
            <div className="flex flex-col items-center gap-space-sm">
              <Search className="w-12 h-12 text-outline-variant opacity-50" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                {searchQuery ? "Tidak ada hasil yang ditemukan" : "Belum ada karya yang dikumpulkan"}
              </p>
            </div>
          </div>
        ) : (
          submissions.map((submission, index) => {
            const rowNumber = (pagination.page - 1) * pagination.limit + index + 1;
            return (
              <div
                key={submission.id}
                onClick={() => handleRowClick(submission.id)}
                className="p-space-md space-y-space-sm hover:bg-surface-container-low/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <span className="inline-flex items-center gap-space-xs font-label-mono text-label-mono text-on-surface bg-surface-container-high px-space-sm py-1 rounded">
                    {submission.submissionCode}
                  </span>
                  <span className="font-label-mono text-label-mono text-outline">#{String(rowNumber).padStart(2, "0")}</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-on-surface">{submission.name}</p>
                  <p className="text-sm text-on-surface mt-1 line-clamp-2">{submission.title}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface">{formatDate(submission.createdAt)}</span>
                    <span className="font-label-mono text-label-mono text-outline text-xs">{formatTime(submission.createdAt)}</span>
                  </div>
                  <button className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold">
                    Lihat
                    <span className="text-base leading-none">→</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-space-md md:px-space-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Menampilkan <strong className="text-on-surface font-semibold">{submissions.length}</strong> dari{" "}
          <strong className="text-on-surface font-semibold">{totalCount}</strong> total berkas karya masuk
        </span>
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || isLoading}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-space-sm font-label-mono text-label-mono text-secondary">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || isLoading}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
