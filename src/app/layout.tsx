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

export const metadata: Metadata = {
  title: "TrailPlot - Turn Your Hike Into Art",
  description:
    "Upload your trail data and create a beautiful poster to commemorate your adventure.",
  icons: {
    icon: "data:image/svg+xml,<svg viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='40' height='40' rx='8' fill='%23059669'/><path d='M 6 30 Q 12 26, 16 27 Q 20 28, 24 25 Q 28 22, 34 23' stroke='white' stroke-width='0.7' stroke-linecap='round' fill='none' opacity='0.2'/><path d='M 6 26 Q 11 22, 15 23 Q 19 24, 23 21 Q 27 18, 34 19' stroke='white' stroke-width='0.7' stroke-linecap='round' fill='none' opacity='0.2'/><path d='M 8 22 Q 13 18, 17 19 Q 21 20, 24 17 Q 28 14, 33 15' stroke='white' stroke-width='0.7' stroke-linecap='round' fill='none' opacity='0.15'/><path d='M 6 32 L 13 18 L 16 22 L 21 12 L 28 24 L 34 32 Z' fill='white' opacity='0.15'/><path d='M 6 32 L 13 18 L 16 22 L 21 12 L 28 24 L 34 32' stroke='white' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' fill='none' opacity='0.5'/><path d='M 9 31 C 12 28, 13 25, 15 23 C 17 21, 18 19, 20 17 C 22 15, 25 18, 27 20 C 29 22, 30 19, 32 16' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' fill='none' opacity='0.9'/><circle cx='9' cy='31' r='2' fill='white' opacity='0.9'/><path d='M 32 11 L 32 16' stroke='white' stroke-width='1.5' stroke-linecap='round' opacity='0.9'/><path d='M 32 11 L 35 14.5 L 32 13.5 L 29 14.5 Z' fill='white' opacity='0.9'/></svg>",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
