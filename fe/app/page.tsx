"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import LandscapeBanner from "@/components/home/landscape-banner";
import SubmissionFormStitch from "@/components/forms/submission-form";
import SidebarSection from "@/components/home/sidebar-section";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while checking auth or redirecting
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-space-md">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full pt-16 sm:pt-20 bg-surface min-h-screen">
        {/* Decorative ambient background */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-80 -left-20 w-80 h-80 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

          {/* Hero Section */}
          <HeroSection />

          {/* Landscape Banner */}
          <LandscapeBanner />

          {/* Form + Sidebar Grid */}
          <section className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-margin-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
              {/* Left: Form (8 cols desktop) */}
              <div className="lg:col-span-8">
                <SubmissionFormStitch />
              </div>

              {/* Right: Sidebar (4 cols desktop) */}
              <div className="lg:col-span-4">
                <SidebarSection />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
