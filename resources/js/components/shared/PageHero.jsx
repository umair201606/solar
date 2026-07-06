import { useEffect, useRef } from "react";
import { siteImages } from "../../data/siteImages";
import Navbar from "../Navbar";

export default function PageHero({ title }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const scrollY = window.scrollY;
      const offset = Math.min(scrollY * 0.13, 80);
      imgRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full min-h-[360px] md:min-h-[440px] overflow-hidden bg-[#4D9DE0]">

      <div className="absolute inset-0 bg-gradient-to-br from-[#5cb3ec] via-[#4D9DE0] to-[#2d82c8] pointer-events-none" />

      <div
        className="absolute left-0 bottom-0 w-[42%] max-w-[480px] h-[100%] pointer-events-none select-none overflow-hidden rounded-[36px]"
        aria-hidden
      >
        <img
          ref={imgRef}
          src={siteImages.rooftop}
          alt=""
          className="absolute bottom-0 left-0 w-full h-[110%] object-cover object-right-bottom opacity-90 will-change-transform"
          style={{
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
          }}
        />
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 440"
        aria-hidden
      >
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#D4F64D" stopOpacity="0"/>
            <stop offset="30%"  stopColor="#D4F64D" stopOpacity="0.9"/>
            <stop offset="70%"  stopColor="#D4F64D" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#D4F64D" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#10B981" stopOpacity="0"/>
            <stop offset="35%"  stopColor="#10B981" stopOpacity="0.6"/>
            <stop offset="70%"  stopColor="#10B981" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lg3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#D4F64D" stopOpacity="0"/>
            <stop offset="40%"  stopColor="#D4F64D" stopOpacity="0.35"/>
            <stop offset="75%"  stopColor="#D4F64D" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#D4F64D" stopOpacity="0"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-400%" width="140%" height="900%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <line
          x1="-100" y1="130"
          x2="1540"  y2="310"
          stroke="url(#lg1)"
          strokeWidth="1.8"
          filter="url(#glow)"
        />

        <line
          x1="-100" y1="240"
          x2="1540"  y2="400"
          stroke="url(#lg2)"
          strokeWidth="1.2"
        />

        <line
          x1="-100" y1="55"
          x2="1540"  y2="200"
          stroke="url(#lg3)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative z-10 flex h-full min-h-[360px] md:min-h-[440px] w-full flex-col">
        <Navbar />
        <div className="flex flex-1 items-start justify-center px-6 md:px-16 lg:px-20 py-12 md:py-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg animate-fade-in-up">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
