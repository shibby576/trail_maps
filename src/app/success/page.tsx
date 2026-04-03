"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [posterImageUrl, setPosterImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const imageUrl = sessionStorage.getItem("posterImageUrl");
    if (imageUrl) {
      setPosterImageUrl(imageUrl);
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
              Your custom trail map poster is being printed. You&apos;ll receive
              an email with tracking info once it ships.
            </p>
          </div>

          {/* Poster Preview */}
          {posterImageUrl && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="max-w-[200px] mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterImageUrl}
                  alt="Your trail map poster"
                  className="w-full rounded shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              A receipt has been sent to your email. You&apos;ll also receive
              tracking info once your poster ships.
            </p>
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
