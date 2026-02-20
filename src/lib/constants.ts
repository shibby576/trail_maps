export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const TRAIL_COLORS = [
  { name: "Gold", hex: "#d4a035" },
  { name: "Copper", hex: "#c4704b" },
  { name: "Forest", hex: "#2d6a4f" },
  { name: "Ocean", hex: "#2563eb" },
  { name: "Crimson", hex: "#dc2626" },
  { name: "Slate", hex: "#64748b" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#1a1a1a" },
] as const;

export const POSTER_DESIGN = {
  hillshade: {
    exaggerationPrimary: 1.0,
    exaggerationSecondary: 0.5,
  },
  trail: {
    defaultColor: "#d4a035",
    width: 2.0,
    opacity: 0.75,
    glowWidth: 6,
    glowOpacity: 0.15,
  },
  text: {
    fontFamily: "Cinzel",
    fontWeight: 600,
    letterSpacing: "0.15em",
  },
  layout: {
    mapPaddingPx: 36,
  },
} as const;

export const POSTER_SIZES = [
  {
    key: "12x18",
    label: '12" × 18"',
    subtitle: "Perfect for desks",
    priceCents: 2900,
    priceDisplay: 29,
    printWidth: 2400,
    printHeight: 3600,
    printfulVariantId: 3876,
  },
  {
    key: "18x24",
    label: '18" × 24"',
    subtitle: "Most popular",
    priceCents: 3900,
    priceDisplay: 39,
    printWidth: 3600,
    printHeight: 4800,
    printfulVariantId: 1,
  },
  {
    key: "24x36",
    label: '24" × 36"',
    subtitle: "Statement piece",
    priceCents: 4900,
    priceDisplay: 49,
    printWidth: 4800,
    printHeight: 7200,
    printfulVariantId: 2,
  },
] as const;

export type SizeKey = (typeof POSTER_SIZES)[number]["key"];
