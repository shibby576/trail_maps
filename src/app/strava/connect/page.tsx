"use client";

import { useEffect } from "react";
import { Logo } from "@/components/logo";

export default function StravaConnectPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/api/strava/auth";
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo className="w-10 h-10" />
          <span className="text-2xl font-semibold text-gray-900">TrailPlot</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Connecting to Strava</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            You&apos;ll be taken to Strava to securely log in and grant access to your activities. You&apos;ll be back here in moments.
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#FC4C02] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400">
          We only read your activity routes — we never post or modify anything on Strava.
        </p>
      </div>
    </div>
  );
}
