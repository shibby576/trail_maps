"use client";

import { useState } from "react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";

const platforms = [
  {
    id: "strava",
    name: "Strava",
    color: "#FC4C02",
    steps: [
      'Go to strava.com and log in',
      'Click "Training" in the top nav → "My Activities"',
      "Click the activity (hike/ride/run) you want to print",
      "Click the three-dot menu (⋯) below the activity title",
      '"Export GPX" — the file downloads automatically',
    ],
    tip: "You can export any of your own activities for free. You don't need Strava Premium.",
    mobileNote:
      "The Strava app also supports GPX export. Open your activity, tap the three-dot menu, scroll down, and tap 'Export GPX'.",
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    color: "#007CC3",
    steps: [
      "Go to connect.garmin.com and log in",
      'Click "Activities" in the left sidebar → "All Activities"',
      "Click the activity you want to print",
      "Click the gear icon in the upper-right corner",
      '"Export to GPX" — the file downloads automatically',
    ],
    tip: "If you use a Garmin watch, all your activities sync to Garmin Connect automatically. Your hikes are already there.",
  },
  {
    id: "alltrails",
    name: "AllTrails",
    color: "#428813",
    steps: [
      "Go to alltrails.com and log in",
      'Click "Saved" in the top menu → "Activities"',
      "Click the recorded activity you want to print",
      'In the menu below the trail photo, click "Export route file"',
      'Select "GPX Track" as the format and click "Save"',
    ],
    tip: "This works for your own recorded activities. You can also export any public trail route the same way.",
  },
];

const faqs = [
  {
    q: "What is a GPX file?",
    a: "It's a simple file that contains the GPS coordinates of your route — the path you hiked, biked, or ran. Think of it as a digital breadcrumb trail. Every major fitness app can export one.",
  },
  {
    q: "I use a different app (Komoot, Apple Watch, Suunto, COROS, etc.)",
    a: "Most GPS-enabled fitness apps can export GPX files. Look for an 'Export' or 'Download' option in your activity's settings menu. If you can get a .gpx file from your app, it'll work with TrailPlot.",
  },
  {
    q: "I don't have a recorded activity — can I still make a poster?",
    a: "Not yet from your own route, but you can try one of our sample trails to see what a poster looks like. We're working on letting you search and select trails directly.",
  },
  {
    q: "My file won't upload / something looks wrong",
    a: "Make sure you're uploading a .gpx file (not .fit, .tcx, or .kml). If you downloaded from Strava or Garmin, it should already be in the right format. If you're still stuck, email us at hello@trailplot.com and we'll help.",
  },
];

export default function GuidePage() {
  const [activePlatform, setActivePlatform] = useState("strava");
  const active = platforms.find((p) => p.id === activePlatform)!;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-semibold text-gray-900">
              TrailPlot
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <Upload className="w-4 h-4" />
            Upload GPX
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              How to Get Your GPX File
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Your hiking app already saved your route. Here&apos;s how to
              download it so we can turn it into a poster.
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="space-y-6">
            <div className="flex gap-2 justify-center">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(p.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activePlatform === p.id
                      ? "text-white shadow-md"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={
                    activePlatform === p.id
                      ? { backgroundColor: p.color }
                      : undefined
                  }
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                {active.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: active.color }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Tip: </span>
                  {active.tip}
                </p>
                {active.mobileNote && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-600">
                      On mobile:{" "}
                    </span>
                    {active.mobileNote}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-400">~45 seconds</p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors"
              >
                Ready? Upload your file
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Common questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span>TrailPlot</span>
          </div>
          <a
            href="mailto:hello@trailplot.com"
            className="hover:text-gray-700"
          >
            hello@trailplot.com
          </a>
        </div>
      </footer>
    </div>
  );
}
