"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock3 } from "lucide-react";

import api from "@/lib/api";
import SubmissionsTable from "@/components/admin/submissions-table";

import type { Submission, PaginationMeta } from "@/types";

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // Fetch submissions on mount and when searchQuery changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await api.get("/admin/submissions", {
          params: {
            page: 1,
            limit: 50,
            search: searchQuery || undefined,
          },
        });

        const { submissions: data, pagination: paginationData } = response.data.data;

        setSubmissions(data);
        setPagination(paginationData);
        setTotalCount(paginationData.total);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const fetchSubmissions = useCallback(async (page: number, search: string) => {
    setIsLoading(true);

    try {
      const response = await api.get("/admin/submissions", {
        params: {
          page,
          limit: 50,
          search: search || undefined,
        },
      });

      const { submissions: data, pagination: paginationData } = response.data.data;

      setSubmissions(data);
      setPagination(paginationData);
      setTotalCount(paginationData.total);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePageChange = (page: number) => {
    fetchSubmissions(page, searchQuery);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-background py-space-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-xl px-margin md:px-margin-md lg:px-margin-lg">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest px-space-lg py-space-lg shadow-sm md:px-space-xl">
          {/* Decorative background */}
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-32
              h-72
              w-72
              rounded-full
              bg-secondary-container/20
              blur-3xl
            "
          />

          <div className="relative z-10 flex flex-col gap-space-md">
            {/* Status */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <span
                className="
                  inline-flex
                  items-center
                  gap-space-xs
                  rounded-full
                  bg-secondary/10
                  px-space-sm
                  py-1
                  font-label-md
                  text-label-md
                  text-secondary
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Periode Pengumpulan Aktif
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-space-xs">
              <h1
                className="
                  font-headline-md
                  text-headline-md
                  tracking-tight
                  text-on-surface
                  md:font-headline-lg
                  md:text-headline-lg
                "
              >
                Daftar Pengumpulan Karya Logo HUT ke-14
              </h1>

              <p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
                Pantau seluruh pengumpulan berkas dan karya desain sayembara logo Hari Jadi ke-14 Kabupaten Mamuju Tengah.
              </p>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
              <Clock3 className="size-4 shrink-0" />

              <span>
                Pengumpulan sampai <span className="font-medium text-on-surface">15 Oktober 2026</span>
              </span>
            </div>
          </div>
        </section>

        {/* Submissions */}
        <SubmissionsTable
          submissions={submissions}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
