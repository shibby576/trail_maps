"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PosterPreview } from "@/components/poster-preview";
import { generateSampleTrail } from "@/lib/gpx-parser";
import type { PosterConfig, TrailGeoJSON, TrailBounds } from "@/lib/types";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [trailGeoJSON, setTrailGeoJSON] = useState<TrailGeoJSON | null>(null);
  const [trailBounds, setTrailBounds] = useState<TrailBounds | null>(null);
  const [config, setConfig] = useState<PosterConfig | null>(null);

  useEffect(() => {
    const savedConfig = sessionStorage.getItem("posterConfig");
    const savedGeoJSON = sessionStorage.getItem("trailGeoJSON");
    const savedBounds = sessionStorage.getItem("trailBounds");

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    if (savedGeoJSON && savedBounds) {
      setTrailGeoJSON(JSON.parse(savedGeoJSON));
      setTrailBounds(JSON.parse(savedBounds));
    } else {
      const sample = generateSampleTrail();
      setTrailGeoJSON(sample.geojson);
      setTrailBounds(sample.bounds);
    }
  }, []);

  const handleReset = () => {
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your custom trail map poster is being printed and will ship within
              3-5 business days.
            </p>
          </div>

          {/* Poster Preview (only if session data still available) */}
          {config && trailGeoJSON && trailBounds && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="max-w-[200px] mx-auto">
                <PosterPreview
                  config={config}
                  trailGeoJSON={trailGeoJSON}
                  trailBounds={trailBounds}
                />
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 text-left space-y-3">
            {sessionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment reference</span>
                <span className="font-mono font-medium text-gray-900 text-xs truncate ml-4 max-w-[180px]">
                  {sessionId}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>
                Stripe will send a receipt to your email. Printful will email
                tracking info once your poster ships.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleReset}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
            >
              Create Another Poster
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
