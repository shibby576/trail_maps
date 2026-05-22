"use client";

import { useRouter } from "next/navigation";
import { Upload, MapPin, Palette, Printer } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrailShape } from "@/components/trail-shape";
import { MockupGallery } from "@/components/mockup-gallery";
import { SAMPLE_TRAILS } from "@/lib/sample-trails";
import Link from "next/link";
import { useState, useEffect } from "react";

const ACTIVITY_WORDS = ["Hike", "Run", "Ride", "Climb", "Trek"];

export default function HomePage() {
  const router = useRouter();
  const [loadingTrail, setLoadingTrail] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ACTIVITY_WORDS.length);
        setFading(false);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const gpxContent = e.target?.result as string;
      sessionStorage.setItem("gpxContent", gpxContent);
      sessionStorage.setItem("gpxFileName", file.name);
      router.push("/customize");
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSampleTrail = async (trail: (typeof SAMPLE_TRAILS)[number]) => {
    setLoadingTrail(trail.id);
    try {
      const res = await fetch(trail.gpxPath);
      const gpxContent = await res.text();
      sessionStorage.setItem("gpxContent", gpxContent);
      sessionStorage.setItem(
        "gpxFileName",
        trail.gpxPath.split("/").pop() || "sample.gpx"
      );
      router.push("/customize");
    } catch {
      setLoadingTrail(null);
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Trail Poster",
    description:
      "Upload your GPX file to create a custom hiking trail poster with satellite or topographic map styles",
    brand: { "@type": "Brand", name: "TrailPlot" },
    image: "https://trailplot.com/og-image.png",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "29",
      highPrice: "49",
      offerCount: "3",
      availability: "https://schema.org/InStock",
      url: "https://trailplot.com",
    },
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
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Header */}
      <header className="px-6 py-6">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <h1 className="text-2xl font-semibold text-gray-900">TrailPlot</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        <div className="w-full max-w-4xl space-y-16">
          {/* Hero */}
          <div className="text-center space-y-4 pt-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Get Your{" "}
              <span
                className="text-emerald-600 inline-block transition-opacity duration-300"
                style={{ opacity: fading ? 0 : 1 }}
              >
                {ACTIVITY_WORDS[wordIndex]}
              </span>{" "}
              Off Your Phone<br className="hidden md:block" /> and Onto Your Wall
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Upload your trail. Pick your style. Get a high-quality poster
              delivered to your door.
            </p>
          </div>

          {/* Mockup Gallery */}
          <MockupGallery />

          {/* Upload Section */}
          <section className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Upload your trail
              </h3>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {/* Strava button */}
              <a
                href="/strava/connect"
                className="flex items-center justify-center gap-3 w-full bg-[#FC4C02] hover:bg-[#e04400] text-white font-semibold rounded-2xl px-6 py-4 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Import from Strava
              </a>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* GPX upload */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-emerald-500 transition-colors bg-white/50 backdrop-blur-sm"
              >
                <input
                  type="file"
                  accept=".gpx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                    <Upload className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-gray-900">
                      Drop your GPX file here
                    </p>
                    <p className="text-sm text-gray-500">or tap to browse</p>
                  </div>
                </div>
              </div>

              <p className="text-center">
                <Link
                  href="/guide"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Don&apos;t have a GPX file? Here&apos;s how to get one →
                </Link>
              </p>
            </div>
          </section>

          {/* Sample Trails */}
          <section className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Or try a sample trail
              </h3>
              <p className="text-gray-500 mt-1">
                Pick one to see what your poster could look like
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SAMPLE_TRAILS.map((trail) => (
                <button
                  key={trail.id}
                  onClick={() => handleSampleTrail(trail)}
                  disabled={loadingTrail !== null}
                  className="group relative bg-gray-900 rounded-xl p-4 text-left hover:bg-gray-800 transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:cursor-wait"
                >
                  <TrailShape
                    gpxPath={trail.gpxPath}
                    className="w-full aspect-square mb-3"
                    strokeColor="#d4a035"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {trail.name}
                    </p>
                    <p className="text-xs text-gray-400">{trail.location}</p>
                    <p className="text-xs text-gray-500">
                      {trail.distance} · {trail.elevation}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/20 transition-colors" />
                  {loadingTrail === trail.id && (
                    <div className="absolute inset-0 rounded-xl bg-gray-900/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Upload",
                  desc: "Drop in a GPX file from Strava, Garmin, AllTrails, or any GPS app.",
                },
                {
                  icon: Palette,
                  title: "Customize",
                  desc: "Pick your colors, edit the title, and preview your poster in real time.",
                },
                {
                  icon: Printer,
                  title: "Print",
                  desc: "Order a high-quality print on premium matte paper, shipped to your door.",
                },
              ].map((step, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span>TrailPlot</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/guide" className="hover:text-gray-700">
              GPX Guide
            </Link>
            <Link href="/blog" className="hover:text-gray-700">
              Blog
            </Link>
            <a href="mailto:trailplot@gmail.com" className="hover:text-gray-700">
              trailplot@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
