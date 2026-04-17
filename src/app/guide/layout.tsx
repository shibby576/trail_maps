import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Export Your GPX File",
  description:
    "Download your hiking, running, or cycling route as a GPX file from Strava, Garmin Connect, or AllTrails. Step-by-step instructions.",
  openGraph: {
    title: "How to Export Your GPX File | TrailPlot",
    description:
      "Download your hiking, running, or cycling route as a GPX file from Strava, Garmin Connect, or AllTrails. Step-by-step instructions.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
