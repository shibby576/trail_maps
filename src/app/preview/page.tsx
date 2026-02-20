"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Share2, Loader2 } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { PosterPreview } from "@/components/poster-preview";
import { renderPosterToBlob } from "@/lib/render-poster";
import { generateSampleTrail } from "@/lib/gpx-parser";
import { POSTER_SIZES } from "@/lib/constants";
import type { PosterConfig, TrailGeoJSON, TrailBounds } from "@/lib/types";

export default function PreviewPage() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(0);
  const [trailGeoJSON, setTrailGeoJSON] = useState<TrailGeoJSON | null>(null);
  const [trailBounds, setTrailBounds] = useState<TrailBounds | null>(null);
  const [config, setConfig] = useState<PosterConfig | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config?.title} Trail Map`,
          text: "Check out my custom trail map poster!",
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    }
  };

  const handlePurchase = async () => {
    if (!config || !trailGeoJSON || !trailBounds) return;

    setIsOrdering(true);
    setOrderError(null);

    try {
      const size = POSTER_SIZES[selectedSize];

      // 1. Render high-res poster via Mapbox + Canvas hybrid
      const blob = await renderPosterToBlob(
        config,
        trailGeoJSON,
        trailBounds,
        size.printWidth,
        size.printHeight
      );

      // 2. Upload to Vercel Blob
      const { url: imageUrl } = await upload(
        `posters/${Date.now()}.png`,
        blob,
        {
          access: "public",
          handleUploadUrl: "/api/upload",
        }
      );

      // 3. Create Stripe Checkout Session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sizeKey: size.key, imageUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }

      const { url } = await res.json();

      // 4. Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error("Order error:", err);
      setOrderError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setIsOrdering(false);
    }
  };

  if (!config || !trailGeoJSON || !trailBounds) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/customize")}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-gray-900">Preview</h1>
          <button
            onClick={handleShare}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Poster Preview */}
        <div className="bg-white p-6">
          <div className="max-w-md mx-auto">
            <PosterPreview
              config={config}
              trailGeoJSON={trailGeoJSON}
              trailBounds={trailBounds}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-8 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Premium Quality Print
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <p>Museum-quality poster on thick, durable matte paper</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <p>Printed with professional-grade pigment inks</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <p>Ships within 3-5 business days</p>
              </div>
            </div>
          </div>

          {/* Size Options */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Available Sizes
            </h3>
            <div className="space-y-3">
              {POSTER_SIZES.map((size, index) => (
                <button
                  key={size.key}
                  onClick={() => setSelectedSize(index)}
                  disabled={isOrdering}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                    selectedSize === index
                      ? "border-2 border-emerald-600 bg-emerald-50"
                      : "border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{size.label}</div>
                    <div className="text-sm text-gray-600">{size.subtitle}</div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      selectedSize === index
                        ? "text-emerald-600"
                        : "text-gray-900"
                    }`}
                  >
                    ${size.priceDisplay}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
        <div className="max-w-2xl mx-auto space-y-3">
          {orderError && (
            <p className="text-center text-sm text-red-600">{orderError}</p>
          )}
          <Button
            onClick={handlePurchase}
            disabled={isOrdering}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg"
          >
            {isOrdering ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Preparing your order...
              </>
            ) : (
              `Order Print - $${POSTER_SIZES[selectedSize].priceDisplay}`
            )}
          </Button>
          <p className="text-center text-xs text-gray-500">
            Free shipping on orders over $50
          </p>
        </div>
      </div>
    </div>
  );
}
