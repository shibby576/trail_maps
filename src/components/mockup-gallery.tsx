"use client";

import Image from "next/image";

const MOCKUPS = [
  {
    src: "/mockups/kissena-watercolor.png",
    trail: "Kissena Group Ride",
    location: "New York City",
    style: "Watercolor",
  },
  {
    src: "/mockups/enchantments-aerial.png",
    trail: "The Enchantments",
    location: "Washington, USA",
    style: "Aerial",
  },
  {
    src: "/mockups/halfdome-outdoors.png",
    trail: "Half Dome",
    location: "Yosemite, CA",
    style: "Outdoors",
  },
  {
    src: "/mockups/hauteroute-aerial.png",
    trail: "Haute Route",
    location: "Chamonix – Zermatt",
    style: "Aerial",
  },
  {
    src: "/mockups/hauteroute-topo.png",
    trail: "Haute Route",
    location: "Chamonix – Zermatt",
    style: "Topo",
  },
];

export function MockupGallery() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          Beautifully printed, any style
        </h3>
        <p className="text-gray-500 mt-1 text-sm">
          Seven map styles to match any adventure
        </p>
      </div>

      {/* Horizontally scrollable row */}
      <div className="flex gap-5 overflow-x-auto pb-4 px-6 -mx-6 snap-x snap-mandatory scrollbar-hide">
        {MOCKUPS.map((m, i) => (
          <div
            key={i}
            className="flex-none w-52 snap-start"
          >
            <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden rounded-sm shadow-lg">
              <Image
                src={m.src}
                alt={`${m.trail} — ${m.style} style poster`}
                fill
                className="object-cover"
                sizes="208px"
              />
            </div>
            {/* Caption */}
            <div className="mt-2.5 space-y-0.5">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {m.trail}
              </p>
              <p className="text-xs text-gray-500">{m.location}</p>
              <span className="inline-block mt-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                {m.style}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
