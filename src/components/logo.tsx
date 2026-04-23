export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="280" height="280" rx="36" fill="#059669" />
      {/* Topo contours */}
      <path d="M 28 216 Q 56 198, 84 204 Q 112 210, 140 192 Q 168 174, 196 180 Q 224 186, 252 174" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.1" />
      <path d="M 28 192 Q 56 174, 84 180 Q 112 186, 140 168 Q 168 150, 196 156 Q 224 162, 252 150" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.08" />
      <path d="M 42 168 Q 70 150, 98 156 Q 126 162, 147 144 Q 168 126, 196 132 Q 224 138, 244 126" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.06" />
      {/* Mountain fill */}
      <path d="M 36 228 L 82 130 L 100 154 L 136 80 L 175 160 L 240 228 Z" fill="white" opacity="0.1" />
      {/* Mountain ridgeline */}
      <path d="M 36 228 L 82 130 L 100 154 L 136 80 L 175 160 L 240 228" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35" />
      {/* Trail — switchbacks to summit */}
      <path d="M 56 222 C 62 212, 72 204, 86 200 C 100 196, 110 200, 112 190 C 114 180, 100 172, 88 168 C 76 164, 72 158, 82 148 C 92 138, 108 136, 120 130 C 132 124, 136 110, 136 80" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.92" />
      {/* Waypoint dots */}
      <circle cx="56" cy="222" r="4" fill="white" opacity="0.92" />
      <circle cx="88" cy="199" r="3" fill="white" opacity="0.75" />
      <circle cx="112" cy="190" r="3" fill="white" opacity="0.75" />
      <circle cx="88" cy="168" r="3" fill="white" opacity="0.75" />
      <circle cx="82" cy="148" r="3" fill="white" opacity="0.75" />
      <circle cx="120" cy="130" r="3" fill="white" opacity="0.75" />
    </svg>
  );
}
