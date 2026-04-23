import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Export Your GPX File",
  description:
    "Step-by-step guide to exporting GPX files from Strava, Garmin, AllTrails, and other hiking apps to create your custom trail poster.",
  openGraph: {
    title: "How to Export Your GPX File | TrailPlot",
    description:
      "Step-by-step guide to exporting GPX files from Strava, Garmin, AllTrails, and other hiking apps to create your custom trail poster.",
    url: "https://trailplot.com/guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Export Your GPX File | TrailPlot",
    description:
      "Step-by-step guide to exporting GPX files from Strava, Garmin, AllTrails, and other hiking apps to create your custom trail poster.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
