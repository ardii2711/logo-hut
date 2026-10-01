"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar dari sistem");
    router.push("/login");
  };

  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-space-md">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[0.5rem] sm:text-sm text-secondary font-semibold tracking-wider uppercase">
                HUT ke-14 Mamuju Tengah
              </span>
              <span className="text-[0.6rem] sm:text-base md:text-lg text-on-surface font-bold leading-tight">
                Pemerintah Kabupaten Mamuju Tengah
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-space-sm">
            {isAuthenticated && isDashboard ? (
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="inline-flex items-center text-label-md font-semibold bg-error/10 text-error hover:bg-error hover:text-white px-space-md py-2.5 rounded-lg transition-colors shadow-sm gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center text-label-md font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container-high px-2 sm:px-space-md py-2 sm:py-2.5 rounded-lg transition-colors shadow-sm gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span className="hidden sm:inline">Portal Panitia</span>
                <span className="sm:hidden text-xs">Panitia</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari dashboard admin? Anda perlu
              login kembali untuk mengakses halaman ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-error hover:bg-error/90"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
