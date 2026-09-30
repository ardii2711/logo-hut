"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token di localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handlePortalClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Jika sudah login, redirect ke dashboard
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 sm:h-20 max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-space-md">
          {/* Logo */}
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />

          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-xl text-on-surface tracking-tight leading-tight font-bold uppercase">HUT ke-14 Mamuju Tengah</span>
          </div>
        </Link>

        <div className="flex items-center">
          <a
            href="/login"
            onClick={handlePortalClick}
            className="inline-flex items-center text-label-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high hover:text-on-surface px-2 sm:px-space-md py-2 sm:py-2.5 rounded-lg transition-colors shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span className="hidden sm:inline">Portal Panitia</span>
            <span className="sm:hidden text-xs">Panitia</span>
          </a>
        </div>
      </div>
    </header>
  );
}
