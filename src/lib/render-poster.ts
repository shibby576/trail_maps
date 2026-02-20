import mapboxgl from "mapbox-gl";
import type { PosterConfig, TrailGeoJSON, TrailBounds } from "@/lib/types";
import { MAPBOX_TOKEN, POSTER_DESIGN } from "@/lib/constants";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Draw poster text onto a Canvas 2D context using Cinzel font.
 * Matches the HTML preview layout: wrapped title, location, stats.
 */
function drawPosterText(
  ctx: CanvasRenderingContext2D,
  config: PosterConfig,
  width: number,
  textAreaTop: number,
  textAreaHeight: number
) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = width / 2;
  const maxTextWidth = width * 0.75;

  // Title — size to match the preview proportions (~5% of width)
  const titleSize = Math.round(width * 0.045);
  const titleSpacing = titleSize * 0.15;
  ctx.font = `600 ${titleSize}px Cinzel, serif`;
  ctx.fillStyle = "#1a1a1a";
  const titleText = config.title.toUpperCase();
  const titleLines = wrapSpacedText(ctx, titleText, maxTextWidth, titleSpacing);
  const titleLineHeight = titleSize * 1.35;
  const titleBlockHeight = titleLines.length * titleLineHeight;
  let titleStartY = textAreaTop + textAreaHeight * 0.25 - titleBlockHeight / 2;

  for (const line of titleLines) {
    titleStartY += titleLineHeight;
    drawSpacedText(ctx, line, centerX, titleStartY, titleSpacing);
  }

  let nextY = titleStartY + titleLineHeight * 0.8;

  // Location
  if (config.location) {
    const locSize = Math.round(width * 0.025);
    ctx.font = `600 ${locSize}px Cinzel, serif`;
    ctx.fillStyle = "#6b7280";
    const locText = config.location.toUpperCase();
    drawSpacedText(ctx, locText, centerX, nextY, locSize * 0.15);
    nextY += locSize * 2;
  }

  // Stats line
  const statsItems = [
    config.distance && `${config.distance} MI`,
    config.elevation && `${config.elevation} FT`,
    config.date && formatDate(config.date).toUpperCase(),
  ].filter(Boolean);

  if (statsItems.length > 0) {
    const statsSize = Math.round(width * 0.02);
    ctx.font = `600 ${statsSize}px Cinzel, serif`;
    ctx.fillStyle = "#9ca3af";
    const statsText = statsItems.join("  \u00B7  ");
    drawSpacedText(ctx, statsText, centerX, nextY, statsSize * 0.1);
  }
}

/** Break text into lines that fit within maxWidth, accounting for extra letter spacing. */
function wrapSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  extraSpacing: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = measureSpacedWidth(ctx, testLine, extraSpacing);

    if (lineWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function measureSpacedWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  extraSpacing: number
): number {
  const baseWidth = ctx.measureText(text).width;
  return baseWidth + extraSpacing * (text.length - 1);
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  extraSpacing: number
) {
  const totalWidth = measureSpacedWidth(ctx, text, extraSpacing);
  let x = centerX - totalWidth / 2;

  for (const char of text) {
    const charWidth = ctx.measureText(char).width;
    ctx.fillText(char, x + charWidth / 2, y);
    x += charWidth + extraSpacing;
  }
}

/**
 * Create an off-screen Mapbox map, render tiles, and return the canvas.
 * Capped at 4096px on the longest side to stay within WebGL texture limits.
 */
function renderMapCanvas(
  trailGeoJSON: TrailGeoJSON,
  trailBounds: TrailBounds,
  trailColor: string,
  mapWidth: number,
  mapHeight: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    container.style.width = `${mapWidth}px`;
    container.style.height = `${mapHeight}px`;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    document.body.appendChild(container);

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container,
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

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Map render timed out after 30s"));
    }, 30000);

    function cleanup() {
      clearTimeout(timeout);
      map.remove();
      document.body.removeChild(container);
    }

    map.on("load", () => {
      map.addSource("trail", {
        type: "geojson",
        data: trailGeoJSON,
      });

      // Scale trail width up for print resolution
      const printScale = mapWidth / 400;

      map.addLayer({
        id: "trail-glow",
        type: "line",
        source: "trail",
        paint: {
          "line-color": trailColor,
          "line-width": POSTER_DESIGN.trail.glowWidth * printScale * 0.5,
          "line-opacity": POSTER_DESIGN.trail.glowOpacity,
          "line-blur": 4 * printScale * 0.5,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      map.addLayer({
        id: "trail-line",
        type: "line",
        source: "trail",
        paint: {
          "line-color": trailColor,
          "line-width": POSTER_DESIGN.trail.width * printScale * 0.5,
          "line-opacity": POSTER_DESIGN.trail.opacity,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      const padding = POSTER_DESIGN.layout.mapPaddingPx * (mapWidth / 400);
      map.fitBounds(
        [
          [trailBounds.minLng, trailBounds.minLat],
          [trailBounds.maxLng, trailBounds.maxLat],
        ],
        { padding, duration: 0 }
      );

      map.once("idle", () => {
        const mapCanvas = map.getCanvas();
        resolve(mapCanvas);
        // Defer cleanup so the canvas data is read first
        setTimeout(cleanup, 100);
      });
    });

    map.on("error", (e) => {
      cleanup();
      reject(e.error || new Error("Map render failed"));
    });
  });
}

/**
 * Render a full print-resolution poster as a PNG Blob.
 * Hybrid approach: Mapbox GL for the map area, Canvas 2D for text.
 */
export async function renderPosterToBlob(
  config: PosterConfig,
  trailGeoJSON: TrailGeoJSON,
  trailBounds: TrailBounds,
  printWidth: number,
  printHeight: number
): Promise<Blob> {
  // Layout: 8% padding around map area, map takes 80% of height, text 20%
  const posterPadding = Math.round(printWidth * 0.08);
  const mapAreaHeight = Math.round(printHeight * 0.80);
  const targetMapWidth = printWidth - posterPadding * 2;
  const targetMapHeight = mapAreaHeight - posterPadding * 2;

  // Cap at 4096 for WebGL limits
  const maxDim = 4096;
  const scaleFactor = Math.min(
    1,
    maxDim / Math.max(targetMapWidth, targetMapHeight)
  );
  const renderMapWidth = Math.round(targetMapWidth * scaleFactor);
  const renderMapHeight = Math.round(targetMapHeight * scaleFactor);

  // Render the map
  const mapCanvas = await renderMapCanvas(
    trailGeoJSON,
    trailBounds,
    config.trailColor,
    renderMapWidth,
    renderMapHeight
  );

  // Create final composite canvas at full print resolution
  const canvas = document.createElement("canvas");
  canvas.width = printWidth;
  canvas.height = printHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, printWidth, printHeight);

  // Draw map with padding offset (upscale if needed)
  ctx.drawImage(mapCanvas, posterPadding, posterPadding, targetMapWidth, targetMapHeight);

  // Text area starts where the map visually ends (padding + map height)
  const mapBottomEdge = posterPadding + targetMapHeight;
  const textAreaTop = mapBottomEdge;
  const textAreaHeight = printHeight - mapBottomEdge;
  drawPosterText(ctx, config, printWidth, textAreaTop, textAreaHeight);

  // Export as PNG blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      "image/png"
    );
  });
}
