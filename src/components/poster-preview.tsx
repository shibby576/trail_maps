"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { PosterConfig, TrailGeoJSON, TrailBounds } from "@/lib/types";
import { MAPBOX_TOKEN, POSTER_DESIGN } from "@/lib/constants";

interface PosterPreviewProps {
  config: PosterConfig;
  trailGeoJSON: TrailGeoJSON;
  trailBounds: TrailBounds;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PosterPreview({
  config,
  trailGeoJSON,
  trailBounds,
}: PosterPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          "mapbox-dem": {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          },
          "mapbox-terrain": {
            type: "vector",
            url: "mapbox://mapbox.mapbox-terrain-v2",
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#f5f5f5" },
          },
          {
            id: "hillshade-primary",
            type: "hillshade",
            source: "mapbox-dem",
            paint: {
              "hillshade-exaggeration": POSTER_DESIGN.hillshade.exaggerationPrimary,
              "hillshade-shadow-color": "#2a2a2a",
              "hillshade-highlight-color": "#ffffff",
              "hillshade-accent-color": "#1a1a1a",
              "hillshade-illumination-direction": 315,
            },
          },
          {
            id: "hillshade-secondary",
            type: "hillshade",
            source: "mapbox-dem",
            paint: {
              "hillshade-exaggeration": POSTER_DESIGN.hillshade.exaggerationSecondary,
              "hillshade-shadow-color": "#3a3a3a",
              "hillshade-highlight-color": "#fafafa",
              "hillshade-accent-color": "#2a2a2a",
              "hillshade-illumination-direction": 135,
            },
          },
          {
            id: "contour-line",
            type: "line",
            source: "mapbox-terrain",
            "source-layer": "contour",
            paint: {
              "line-color": "#c0c0c0",
              "line-width": [
                "match",
                ["get", "index"],
                5, 0.8,
                10, 1.0,
                0.4,
              ],
              "line-opacity": 0.4,
            },
          },
        ],
      },
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
    });

    map.on("load", () => {
      // Add trail source
      map.addSource("trail", {
        type: "geojson",
        data: trailGeoJSON,
      });

      // Trail glow
      map.addLayer({
        id: "trail-glow",
        type: "line",
        source: "trail",
        paint: {
          "line-color": config.trailColor,
          "line-width": POSTER_DESIGN.trail.glowWidth,
          "line-opacity": POSTER_DESIGN.trail.glowOpacity,
          "line-blur": 4,
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });

      // Trail line
      map.addLayer({
        id: "trail-line",
        type: "line",
        source: "trail",
        paint: {
          "line-color": config.trailColor,
          "line-width": POSTER_DESIGN.trail.width,
          "line-opacity": POSTER_DESIGN.trail.opacity,
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });

      // Fit bounds
      const padding = POSTER_DESIGN.layout.mapPaddingPx;
      map.fitBounds(
        [
          [trailBounds.minLng, trailBounds.minLat],
          [trailBounds.maxLng, trailBounds.maxLat],
        ],
        { padding, duration: 0 }
      );

      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trailGeoJSON, trailBounds]);

  // Update trail color
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    try {
      map.setPaintProperty("trail-line", "line-color", config.trailColor);
      map.setPaintProperty("trail-glow", "line-color", config.trailColor);
    } catch {
      // Layer not ready yet
    }
  }, [config.trailColor, mapLoaded]);

  const stats = [
    config.distance && `${config.distance} MI`,
    config.elevation && `${config.elevation} FT`,
    config.date && formatDate(config.date),
  ]
    .filter(Boolean)
    .join("  \u00B7  ");

  return (
    <div
      className="bg-white shadow-lg overflow-hidden"
      style={{ aspectRatio: "2/3" }}
    >
      {/* Map area with padding */}
      <div
        className="w-full"
        style={{ height: "80%", padding: "8%" }}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full"
        />
      </div>

      {/* Text area */}
      <div
        className="flex flex-col items-center justify-start px-6 text-center"
        style={{ height: "20%", fontFamily: "var(--font-cinzel), Cinzel, serif" }}
      >
        <h2
          className="text-base font-semibold uppercase tracking-wider text-gray-900 leading-tight"
          style={{ letterSpacing: POSTER_DESIGN.text.letterSpacing }}
        >
          {config.title}
        </h2>

        {config.location && (
          <p
            className="mt-1.5 text-[10px] uppercase tracking-widest text-gray-500"
            style={{ letterSpacing: POSTER_DESIGN.text.letterSpacing }}
          >
            {config.location}
          </p>
        )}

        {stats && (
          <p
            className="mt-2 text-[8px] uppercase tracking-widest text-gray-400"
            style={{ letterSpacing: "0.1em" }}
          >
            {stats}
          </p>
        )}
      </div>
    </div>
  );
}
