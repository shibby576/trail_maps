import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600"],
});

const siteUrl = "https://trailplot.com";

export const metadata: Metadata = {
  title: {
    default: "TrailPlot — Turn Your Hike Into a Custom Poster",
    template: "%s | TrailPlot",
  },
  description:
    "Upload your GPX file from Strava, Garmin, or AllTrails and create a custom trail poster with satellite or topographic map styles. Printed on premium paper and shipped to your door.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "TrailPlot",
    title: "TrailPlot — Turn Your Hike Into a Custom Poster",
    description:
      "Upload your GPX file from Strava, Garmin, or AllTrails and create a custom trail poster with satellite or topographic map styles. Printed on premium paper and shipped to your door.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrailPlot — Custom Trail Poster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrailPlot — Turn Your Hike Into a Custom Poster",
    description:
      "Upload your GPX file from Strava, Garmin, or AllTrails and create a custom trail poster with satellite or topographic map styles. Printed on premium paper and shipped to your door.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TrailPlot",
  url: siteUrl,
  logo: `${siteUrl}/og-image.png`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "trailplot@gmail.com",
    contactType: "customer support",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} antialiased font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
