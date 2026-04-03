"use client";

import { useEffect, useState } from "react";

interface TrailShapeProps {
  gpxPath: string;
  className?: string;
  strokeColor?: string;
}

export function TrailShape({
  gpxPath,
  className = "",
  strokeColor = "#d4a035",
}: TrailShapeProps) {
  const [pathData, setPathData] = useState<string>("");

  useEffect(() => {
    fetch(gpxPath)
      .then((res) => res.text())
      .then((text) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const trkpts = xml.querySelectorAll("trkpt");

        if (trkpts.length === 0) return;

        const points: { lat: number; lng: number }[] = [];
        trkpts.forEach((pt) => {
          const lat = parseFloat(pt.getAttribute("lat") || "0");
          const lng = parseFloat(pt.getAttribute("lon") || "0");
          if (lat && lng) points.push({ lat, lng });
        });

        if (points.length === 0) return;

        // Normalize to viewBox with padding
        const lats = points.map((p) => p.lat);
        const lngs = points.map((p) => p.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const latRange = maxLat - minLat || 0.001;
        const lngRange = maxLng - minLng || 0.001;
        const padding = 0.15;
        const size = 100;

        const normalized = points.map((p) => {
          const x =
            ((p.lng - minLng) / lngRange) * size * (1 - 2 * padding) +
            size * padding;
          const y =
            (1 - (p.lat - minLat) / latRange) * size * (1 - 2 * padding) +
            size * padding;
          return { x, y };
        });

        // Downsample for SVG performance
        const step = Math.max(1, Math.floor(normalized.length / 150));
        const sampled = normalized.filter((_, i) => i % step === 0 || i === normalized.length - 1);

        const d = sampled
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(" ");

        setPathData(d);
      })
      .catch(() => {});
  }, [gpxPath]);

  if (!pathData) {
    return <div className={`${className} animate-pulse bg-white/5 rounded`} />;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow */}
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      />
      {/* Main trail */}
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}
