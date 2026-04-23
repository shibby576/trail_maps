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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a GPX file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's a simple file that contains the GPS coordinates of your route — the path you hiked, biked, or ran. Think of it as a digital breadcrumb trail. Every major fitness app can export one.",
      },
    },
    {
      "@type": "Question",
      name: "I use a different app (Komoot, Apple Watch, Suunto, COROS, etc.)",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most GPS-enabled fitness apps can export GPX files. Look for an 'Export' or 'Download' option in your activity's settings menu. If you can get a .gpx file from your app, it'll work with TrailPlot.",
      },
    },
    {
      "@type": "Question",
      name: "I don't have a recorded activity — can I still make a poster?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not yet from your own route, but you can try one of our sample trails to see what a poster looks like. We're working on letting you search and select trails directly.",
      },
    },
    {
      "@type": "Question",
      name: "My file won't upload / something looks wrong",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Make sure you're uploading a .gpx file (not .fit, .tcx, or .kml). If you downloaded from Strava or Garmin, it should already be in the right format. If you're still stuck, email us at trailplot@gmail.com and we'll help.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://trailplot.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "GPX Export Guide",
      item: "https://trailplot.com/guide",
    },
  ],
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
