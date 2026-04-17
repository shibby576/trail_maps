import type { MapStyleId } from "./types";

/**
 * Returns the Mapbox GL-compatible style URL for a given style ID.
 * All use your existing MAPBOX_TOKEN — no additional keys needed.
 */
export function getStyleUrl(styleId: MapStyleId): string {
  switch (styleId) {
    case "outdoors":         return "mapbox://styles/mapbox/outdoors-v12";
    case "light":            return "mapbox://styles/mapbox/light-v11";
    case "dark":             return "mapbox://styles/mapbox/dark-v11";
    case "standard":         return "mapbox://styles/mapbox/standard";
    case "standard-satellite": return "mapbox://styles/mapbox/standard-satellite";
    case "satellite":        return "mapbox://styles/mapbox/satellite-streets-v12";
    case "satellite-pure":   return "mapbox://styles/mapbox/satellite-v9";
    case "navigation-night": return "mapbox://styles/mapbox/navigation-night-v1";
    case "streets":          return "mapbox://styles/mapbox/streets-v12";
  }
}

export interface TrailLayerStyle {
  width: number;
  opacity: number;
  glowWidth: number;
  glowOpacity: number;
  glowBlur: number;
}

/**
 * Per-style trail line settings.
 * Dark/satellite styles need stronger glow so the trail reads clearly.
 */
export function getTrailLayerStyle(styleId: MapStyleId): TrailLayerStyle {
  switch (styleId) {
    case "light":
    case "standard":
    case "streets":
      return { width: 2.5, opacity: 0.9,  glowWidth: 7,  glowOpacity: 0.2,  glowBlur: 3 };
    case "outdoors":
      return { width: 2.5, opacity: 0.9,  glowWidth: 7,  glowOpacity: 0.2,  glowBlur: 3 };
    case "dark":
    case "navigation-night":
      return { width: 2.5, opacity: 1.0,  glowWidth: 10, glowOpacity: 0.35, glowBlur: 5 };
    case "satellite":
    case "standard-satellite":
    case "satellite-pure":
      return { width: 3.0, opacity: 1.0,  glowWidth: 10, glowOpacity: 0.4,  glowBlur: 5 };
  }
}
