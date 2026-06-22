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
    src: "/mockups/jmt-topo.png",
    trail: "John Muir Trail",
    location: "Yosemite to Mt. Whitney, CA",
    style: "Topo",
  },
  {
    src: "/mockups/hauteroute-aerial.png",
    trail: "Haute Route",
    location: "Chamonix – Zermatt",
    style: "Aerial",
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 px-6 -mx-6">
        {MOCKUPS.map((m, i) => (
          <div
            key={i}
          >
            <Image
              src={m.src}
              alt={`${m.trail} — ${m.style} style poster`}
              width={416}
              height={560}
              className="w-full h-auto rounded-sm shadow-lg"
              sizes="208px"
            />
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
