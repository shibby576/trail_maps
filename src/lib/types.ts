export interface PosterConfig {
  title: string;
  date: string;
  location: string;
  distance: string;
  elevation: string;
  trailColor: string;
}

export interface TrailGeoJSON {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    geometry: {
      type: "LineString";
      coordinates: number[][];
    };
    properties: Record<string, unknown>;
  }[];
}

export interface TrailBounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export interface TrailStats {
  distanceMiles: number;
  elevationGainFt: number;
  bounds: TrailBounds;
}

export type Step = "upload" | "customize" | "preview" | "checkout" | "success";

export interface CheckoutRequest {
  sizeKey: string;
  imageUrl: string;
}
