import type { TrailGeoJSON, TrailBounds, TrailStats } from "@/lib/types";

interface TrackPoint {
  lat: number;
  lng: number;
  ele: number | null;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseTrackPoints(xml: Document): TrackPoint[] {
  const trkpts = xml.querySelectorAll("trkpt");
  const points: TrackPoint[] = [];

  trkpts.forEach((trkpt) => {
    const lat = parseFloat(trkpt.getAttribute("lat") || "0");
    const lng = parseFloat(trkpt.getAttribute("lon") || "0");
    if (!lat && !lng) return;

    const eleEl = trkpt.querySelector("ele");
    const ele = eleEl ? parseFloat(eleEl.textContent || "") : null;

    points.push({ lat, lng, ele: isNaN(ele as number) ? null : ele });
  });

  return points;
}

function computeStats(points: TrackPoint[]): TrailStats {
  let totalDistance = 0;
  let elevationGain = 0;

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);

  for (let i = 1; i < points.length; i++) {
    totalDistance += haversineDistance(
      points[i - 1].lat,
      points[i - 1].lng,
      points[i].lat,
      points[i].lng
    );

    const prevEle = points[i - 1].ele;
    const curEle = points[i].ele;
    if (prevEle != null && curEle != null && curEle > prevEle) {
      elevationGain += (curEle - prevEle) * 3.28084; // meters to feet
    }
  }

  return {
    distanceMiles: Math.round(totalDistance * 10) / 10,
    elevationGainFt: Math.round(elevationGain),
    bounds: {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
    },
  };
}

function pointsToGeoJSON(points: TrackPoint[]): TrailGeoJSON {
  const coordinates: number[][] = points.map((p) =>
    p.ele != null ? [p.lng, p.lat, p.ele] : [p.lng, p.lat]
  );

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: {},
      },
    ],
  };
}

export interface ParsedGPX {
  geojson: TrailGeoJSON;
  stats: TrailStats;
  bounds: TrailBounds;
}

export function parseGPXString(text: string): ParsedGPX {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  const points = parseTrackPoints(xml);

  if (points.length === 0) {
    return generateSampleTrail();
  }

  const stats = computeStats(points);
  return {
    geojson: pointsToGeoJSON(points),
    stats,
    bounds: stats.bounds,
  };
}

export async function parseGPXFile(file: File): Promise<ParsedGPX> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(parseGPXString(text));
    };
    reader.onerror = () => {
      resolve(generateSampleTrail());
    };
    reader.readAsText(file);
  });
}

export function generateSampleTrail(): ParsedGPX {
  const baseLatitude = 37.7749;
  const baseLongitude = -122.4194;
  const points: TrackPoint[] = [];

  let lat = baseLatitude;
  let lng = baseLongitude;

  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 2 + Math.sin(i * 0.3) * 0.5;
    const step = 0.0008;
    lat += Math.cos(angle) * step;
    lng += Math.sin(angle) * step;
    points.push({ lat, lng, ele: 200 + Math.sin(i * 0.1) * 50 });
  }

  const stats = computeStats(points);
  return {
    geojson: pointsToGeoJSON(points),
    stats,
    bounds: stats.bounds,
  };
}
