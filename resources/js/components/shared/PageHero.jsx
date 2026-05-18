import { Link } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";

export default function PageHero({ title, breadcrumbs = [] }) {
  return (
    <section className="relative w-full min-h-[360px] md:min-h-[440px] flex items-center justify-center overflow-hidden bg-[#4D9DE0]">

      {/* ── 1. Base blue gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5cb3ec] via-[#4D9DE0] to-[#2d82c8] pointer-events-none" />

      {/* ── 2. Solar house image — LEFT, sitting on the bottom edge ── */}
      {/*
          The image in the screenshot:
          - Occupies the left ~40% of the hero
          - Is cropped at the bottom (building base cut off)
          - Fades to the right into the blue bg
          - Has no border/frame — just blends in
          - Slight blue tint to unify with bg color
      */}
      <div
        className="absolute left-0 bottom-0 w-[42%] max-w-[480px] h-[100%] pointer-events-none select-none"
        aria-hidden
      >
        <img
          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=900"
          alt=""
          className="absolute bottom-0 left-0 w-full h-[110%] object-cover object-right-bottom"
          style={{
            /* Fade: right edge → transparent, top edge → transparent, bottom stays solid */
            WebkitMaskImage: `
              linear-gradient(to right,  rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 88%),
              linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 18%, rgba(0,0,0,1) 45%)
            `,
            WebkitMaskComposite: "destination-in",
            maskImage: `
              linear-gradient(to right,  rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 88%),
              linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 18%, rgba(0,0,0,1) 45%)
            `,
            maskComposite: "intersect",
            mixBlendMode: "luminosity",
            opacity: 0.75,
          }}
        />
        {/* Blue colour tint so the image reads as part of the sky-blue hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(77,157,224,0.25) 0%, rgba(77,157,224,0.15) 50%, transparent 90%)",
          }}
        />
      </div>

      {/* ── 3. Diagonal SVG energy lines (top-left → bottom-right) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 440"
        aria-hidden
      >
        <defs>
          {/* Lime glow line */}
          <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#D4F64D" stopOpacity="0"/>
            <stop offset="30%"  stopColor="#D4F64D" stopOpacity="0.9"/>
            <stop offset="70%"  stopColor="#D4F64D" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#D4F64D" stopOpacity="0"/>
          </linearGradient>
          {/* Emerald line */}
          <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#10B981" stopOpacity="0"/>
            <stop offset="35%"  stopColor="#10B981" stopOpacity="0.6"/>
            <stop offset="70%"  stopColor="#10B981" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
          </linearGradient>
          {/* Faint lime line */}
          <linearGradient id="lg3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#D4F64D" stopOpacity="0"/>
            <stop offset="40%"  stopColor="#D4F64D" stopOpacity="0.35"/>
            <stop offset="75%"  stopColor="#D4F64D" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#D4F64D" stopOpacity="0"/>
          </linearGradient>
          {/* Glow filter for the primary line */}
          <filter id="glow" x="-20%" y="-400%" width="140%" height="900%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/*
            Lines go from top-left to bottom-right.
            In the screenshot the lines cross through the middle height
            at roughly a 15–20 degree angle.
        */}

        {/* Primary lime line — most visible, with glow */}
        <line
          x1="-100" y1="130"
          x2="1540"  y2="310"
          stroke="url(#lg1)"
          strokeWidth="1.8"
          filter="url(#glow)"
        />

        {/* Secondary emerald line — slightly lower */}
        <line
          x1="-100" y1="240"
          x2="1540"  y2="400"
          stroke="url(#lg2)"
          strokeWidth="1.2"
        />

        {/* Tertiary faint lime line — higher up */}
        <line
          x1="-100" y1="55"
          x2="1540"  y2="200"
          stroke="url(#lg3)"
          strokeWidth="1"
        />
      </svg>

      {/* ── 4. Centred text content ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl py-28 md:py-36">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          {title}
        </h1>

        {breadcrumbs.length > 0 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm md:text-base font-medium text-white/80 flex-wrap bg-black/20 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10 w-max mx-auto shadow-xl">
            <Link
              href="/"
              className="hover:text-[#D4F64D] transition-colors flex items-center"
            >
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-2 sm:gap-3">
                <ChevronRight className="w-4 h-4 text-white/40" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#D4F64D] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#D4F64D] font-bold drop-shadow-md">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}