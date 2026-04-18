"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PosterPreview } from "@/components/poster-preview";
import { renderPosterToBlob } from "@/lib/render-poster";
import { parseGPXString, generateSampleTrail } from "@/lib/gpx-parser";
import type { PosterConfig, TrailGeoJSON, TrailBounds } from "@/lib/types";
import { TRAIL_COLORS, POSTER_DESIGN, MAP_STYLES } from "@/lib/constants";

export default function CustomizePage() {
  const router = useRouter();
  const [trailGeoJSON, setTrailGeoJSON] = useState<TrailGeoJSON | null>(null);
  const [trailBounds, setTrailBounds] = useState<TrailBounds | null>(null);
  const [config, setConfig] = useState<PosterConfig>({
    title: "",
    date: "2026-01-01",
    location: "Location",
    distance: "",
    elevation: "",
    trailColor: POSTER_DESIGN.trail.defaultColor,
    mapStyle: "outdoors",
    zoomOffset: 0,
  });

  useEffect(() => {
    const gpxContent = sessionStorage.getItem("gpxContent");
    const gpxFileName = sessionStorage.getItem("gpxFileName");

    let parsed;
    if (gpxContent) {
      parsed = parseGPXString(gpxContent);
    } else {
      parsed = generateSampleTrail();
    }

    setTrailGeoJSON(parsed.geojson);
    setTrailBounds(parsed.bounds);

    // Auto-populate from GPX stats
    setConfig((prev) => ({
      ...prev,
      distance: String(parsed.stats.distanceMiles),
      elevation: parsed.stats.elevationGainFt > 0
        ? String(parsed.stats.elevationGainFt.toLocaleString())
        : "",
      title: gpxFileName
        ? gpxFileName.replace(".gpx", "").replace(/[-_]/g, " ").trim()
        : prev.title,
      date: parsed.date ?? prev.date,
    }));
  }, []);

  const [isRendering, setIsRendering] = useState(false);

  const handleTestRender = async () => {
    if (!trailGeoJSON || !trailBounds) return;
    setIsRendering(true);
    try {
      // Render at 18x24" print resolution (3600x4800)
      const blob = await renderPosterToBlob(
        config,
        trailGeoJSON,
        trailBounds,
        3600,
        4800
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "test-print-18x24.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Test render failed:", err);
    }
    setIsRendering(false);
  };

  const handleNext = () => {
    sessionStorage.removeItem("posterImageUrl_preview");
    sessionStorage.setItem("posterConfig", JSON.stringify(config));
    sessionStorage.setItem("trailGeoJSON", JSON.stringify(trailGeoJSON));
    sessionStorage.setItem("trailBounds", JSON.stringify(trailBounds));
    router.push("/preview");
  };

  if (!trailGeoJSON || !trailBounds) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading trail data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-gray-900">Customize</h1>
          <Button
            onClick={handleNext}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Next
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Preview */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="max-w-sm mx-auto">
            <PosterPreview
              config={config}
              trailGeoJSON={trailGeoJSON}
              trailBounds={trailBounds}
            />
          </div>
        </div>

        {/* Zoom controls */}
        <div className="px-6 pt-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">Zoom</span>
              {config.zoomOffset !== 0 && (
                <button
                  onClick={() => setConfig({ ...config, zoomOffset: 0 })}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfig({ ...config, zoomOffset: Math.max(config.zoomOffset - 0.5, -3) })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg leading-none"
              >
                −
              </button>
              <span className="text-xs text-gray-500 w-10 text-center tabular-nums">
                {config.zoomOffset === 0 ? "Auto" : config.zoomOffset > 0 ? `+${config.zoomOffset}` : config.zoomOffset}
              </span>
              <button
                onClick={() => setConfig({ ...config, zoomOffset: Math.min(config.zoomOffset + 0.5, 3) })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Preview quality notice */}
        <div className="px-6 pt-4 max-w-sm mx-auto">
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-3">
            <span className="text-amber-500 text-base leading-none mt-0.5">⚠</span>
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">This is a low-resolution preview.</span> Tap{" "}
              <span className="font-bold">Next</span> to see the full print-quality version before ordering.
            </p>
          </div>
        </div>

        {/* Debug: test render (hidden in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="px-6 pt-2 max-w-sm mx-auto">
            <Button
              onClick={handleTestRender}
              disabled={isRendering}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                  Rendering test print...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 mr-1.5" />
                  Download Test Print (dev only)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Map Style */}
          <div className="space-y-3">
            <Label>Map Style</Label>
            <div className="grid grid-cols-3 gap-3">
              {MAP_STYLES.map((style) => {
                const isSelected = config.mapStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setConfig({ ...config, mapStyle: style.id })}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                      isSelected
                        ? "border-gray-900 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    {/* Color swatch strip */}
                    <div className="flex h-10">
                      {style.swatches.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {/* Label */}
                    <div className="px-2 py-2 bg-white">
                      <p className="text-xs font-semibold text-gray-900 leading-tight">
                        {style.name}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                        {style.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trail Color */}
          <div className="space-y-3">
            <Label>Trail Color</Label>
            <div className="flex gap-3 flex-wrap">
              {TRAIL_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setConfig({ ...config, trailColor: color.hex })
                  }
                  className="relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color.hex,
                    borderColor:
                      config.trailColor === color.hex
                        ? "#1a1a1a"
                        : color.hex === "#ffffff"
                        ? "#e5e5e5"
                        : "transparent",
                  }}
                  title={color.name}
                >
                  {config.trailColor === color.hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className="w-5 h-5"
                        style={{
                          color:
                            color.hex === "#ffffff" || color.hex === "#d4a035"
                              ? "#1a1a1a"
                              : "#ffffff",
                        }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trail Name</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) =>
                  setConfig({ ...config, title: e.target.value })
                }
                placeholder="Mount Whitney Summit"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={config.date}
                onChange={(e) =>
                  setConfig({ ...config, date: e.target.value })
                }
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={config.location}
                onChange={(e) =>
                  setConfig({ ...config, location: e.target.value })
                }
                placeholder="California, USA"
                className="text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (mi)</Label>
                <Input
                  id="distance"
                  value={config.distance}
                  onChange={(e) =>
                    setConfig({ ...config, distance: e.target.value })
                  }
                  placeholder="12.5"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elevation">Elevation (ft)</Label>
                <Input
                  id="elevation"
                  value={config.elevation}
                  onChange={(e) =>
                    setConfig({ ...config, elevation: e.target.value })
                  }
                  placeholder="4,850"
                  className="text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
