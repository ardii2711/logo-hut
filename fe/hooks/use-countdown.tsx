"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { DeadlineResponse } from "@/types";

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: "open" | "closed";
  loading: boolean;
  error: string | null;
}

export function useCountdown(): CountdownData {
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: "open",
    loading: true,
    error: null,
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let deadline: Date;

    // Fetch deadline dari API
    const fetchDeadline = async () => {
      try {
        const response = await api.get<DeadlineResponse>("/config/deadline");
        deadline = new Date(response.data.deadline);
        setCountdown((prev) => ({
          ...prev,
          status: response.data.status,
          loading: false,
        }));

        // Start countdown
        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
      } catch (err) {
        console.error("Error fetching deadline:", err);
        // Fallback ke static deadline
        deadline = new Date("2026-10-15T23:59:59+08:00");
        setCountdown((prev) => ({
          ...prev,
          loading: false,
          error: "Gagal memuat deadline",
        }));
        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
      }
    };

    const updateCountdown = () => {
      if (!deadline) return;

      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown((prev) => ({
          ...prev,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          status: "closed",
        }));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown((prev) => ({
        ...prev,
        days,
        hours,
        minutes,
        seconds,
      }));
    };

    fetchDeadline();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return countdown;
}
