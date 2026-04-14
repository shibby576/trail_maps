import type { MapStyleId } from "./types";
import { STADIA_MAPS_KEY } from "./constants";

/**
 * Returns the Mapbox GL-compatible style URL for a given style ID.
 *
 * Outdoors: Mapbox-hosted, uses your existing MAPBOX_TOKEN.
 * Watercolor / Topo: Stadia Maps (Stamen), requires NEXT_PUBLIC_STADIA_MAPS_KEY.
 */
export function getStyleUrl(styleId: MapStyleId): string {
  switch (styleId) {
    case "outdoors":
      return "mapbox://styles/mapbox/outdoors-v12";
    case "watercolor":
      return `https://tiles.stadiamaps.com/styles/stamen_watercolor.json${STADIA_MAPS_KEY ? `?api_key=${STADIA_MAPS_KEY}` : ""}`;
    case "topo":
      return `https://tiles.stadiamaps.com/styles/stamen_terrain.json${STADIA_MAPS_KEY ? `?api_key=${STADIA_MAPS_KEY}` : ""}`;
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
 * Per-style trail line settings. Watercolor needs a thicker, more opaque line
 * to read clearly against the busy painted background. Topo stays clean/minimal.
 */
export function getTrailLayerStyle(styleId: MapStyleId): TrailLayerStyle {
  switch (styleId) {
    case "outdoors":
      return { width: 2.5, opacity: 0.9, glowWidth: 7, glowOpacity: 0.2, glowBlur: 3 };
    case "watercolor":
      return { width: 3.5, opacity: 1.0, glowWidth: 12, glowOpacity: 0.3, glowBlur: 6 };
    case "topo":
      return { width: 2.5, opacity: 0.95, glowWidth: 6, glowOpacity: 0.15, glowBlur: 2 };
  }
}
