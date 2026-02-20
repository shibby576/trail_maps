export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="40" height="40" rx="8" fill="#059669" />

      {/* Topographic contour lines */}
      <path
        d="M 6 30 Q 12 26, 16 27 Q 20 28, 24 25 Q 28 22, 34 23"
        stroke="white"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M 6 26 Q 11 22, 15 23 Q 19 24, 23 21 Q 27 18, 34 19"
        stroke="white"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M 8 22 Q 13 18, 17 19 Q 21 20, 24 17 Q 28 14, 33 15"
        stroke="white"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.15"
      />

      {/* Mountain silhouette */}
      <path
        d="M 6 32 L 13 18 L 16 22 L 21 12 L 28 24 L 34 32 Z"
        fill="white"
        opacity="0.15"
      />
      <path
        d="M 6 32 L 13 18 L 16 22 L 21 12 L 28 24 L 34 32"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />

      {/* Trail path winding through mountains */}
      <path
        d="M 9 31 C 12 28, 13 25, 15 23 C 17 21, 18 19, 20 17 C 22 15, 25 18, 27 20 C 29 22, 30 19, 32 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />

      {/* Trail start marker */}
      <circle cx="9" cy="31" r="2" fill="white" opacity="0.9" />

      {/* Trail end / summit marker */}
      <path
        d="M 32 11 L 32 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M 32 11 L 35 14.5 L 32 13.5 L 29 14.5 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}
