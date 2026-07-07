import React, { useState, useRef, useEffect } from "react";
import { User, ArrowUpRight, X, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function HeroCards({ overlay = false }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const fullscreenVideoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeFullscreen();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 30);
  };

  const handleStop = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const openFullscreen = () => {
    const resumeAt = videoRef.current ? videoRef.current.currentTime : 0;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsFullscreen(true);
    setTimeout(() => {
      if (fullscreenVideoRef.current) {
        try { fullscreenVideoRef.current.currentTime = resumeAt; } catch {}
        fullscreenVideoRef.current.play().catch(() => {});
      }
    }, 30);
  };

  const closeFullscreen = () => {
    const resumeAt = fullscreenVideoRef.current ? fullscreenVideoRef.current.currentTime : 0;
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
    }
    setIsFullscreen(false);
    if (videoRef.current) {
      try { videoRef.current.currentTime = resumeAt; } catch {}
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  return (
    <div className={`relative z-30 mx-auto w-full ${overlay ? 'h-full px-2' : 'mt-0 mb-10'}`}>
      <div className={`grid gap-4 xl:gap-5 ${overlay ? 'h-full grid-cols-1 lg:grid-cols-[1.9fr_1fr_0.8fr]' : 'grid-cols-1 md:grid-cols-2'}`}>

        {/* Card 1: "Advancing Solar Solutions" Info & Inline Video */}
        {overlay ? (
          <div className="bg-white/88 p-5 lg:p-6 xl:p-8 rounded-[24px] xl:rounded-[36px] flex flex-col h-full shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <div className="flex gap-4 xl:gap-5 flex-1 min-h-0">

              {/* Left: Text */}
              <div className="flex flex-col justify-start flex-1 py-0.5">
                <h3 className="font-bold text-[20px] lg:text-[22px] xl:text-[34px] leading-tight tracking-[-0.02em] text-[#051F03]">
                  Advancing Solar<br />Solutions
                </h3>
                <p className="text-[11px] lg:text-[12px] xl:text-[14px] leading-snug font-medium tracking-[-0.02em] text-black mt-3 xl:mt-4 overflow-hidden text-ellipsis line-clamp-4 xl:line-clamp-none">
                  Solarkon Private Limited is a premier solar energy solutions provider in Pakistan, known for delivering high-performance systems tailored to residential, commercial, industrial, and agricultural needs.
                </p>
              </div>

              {/* Right: Inline Video / Thumbnail */}
              <div
                className="w-[120px] lg:w-[130px] xl:w-[250px] rounded-[20px] xl:rounded-[36px] relative overflow-hidden shadow-md flex-shrink-0 self-stretch min-h-[120px] xl:min-h-[180px] bg-black cursor-pointer group"
                onClick={openFullscreen}
              >

                {/* Video element — always mounted, hidden/shown via opacity */}
                <video
                  ref={videoRef}
                  src="/heroVideo_optimized.mp4"
                  poster="/heroVideo_poster.jpg"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="auto"
                />

                {/* Thumbnail — shown when not playing */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  <img
                    src="/thumbnail-1.webp"
                    alt="Play our showreel"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Subtle darken on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />

                {/* Fullscreen affordance — shown on hover only */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-[48px] h-[48px] xl:w-[60px] xl:h-[60px] bg-black/60 backdrop-blur-sm rounded-full border border-white/70 flex items-center justify-center text-white shadow-lg">
                    <Maximize2 className="w-4 h-4 xl:w-5 xl:h-5" />
                  </div>
                </div>

                {/* Sound toggle — always visible, bottom-left */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-2 left-2 xl:bottom-3 xl:left-3 z-20 w-7 h-7 xl:w-9 xl:h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#d4ff00] hover:text-[#041a12] transition-all duration-200 shadow-md"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 xl:w-4 xl:h-4" />
                  ) : (
                    <Volume2 className="w-3 h-3 xl:w-4 xl:h-4" />
                  )}
                </button>
              </div>

            </div>
          </div>

        ) : (
          /* Mobile: full-width inline video card */
          <div
            className="w-full relative overflow-hidden shadow-lg h-[220px] sm:h-[300px] md:h-[340px] md:col-span-2 rounded-[1.5rem] bg-black group cursor-pointer"
            onClick={openFullscreen}
          >
            <video
              ref={videoRef}
              src="/heroVideo_optimized.mp4"
              poster="/heroVideo_poster.jpg"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
            />

            <div
              className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <img
                src="/thumbnail-1.webp"
                alt="Play our showreel"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-[60px] h-[60px] bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg border border-white/70">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="absolute bottom-3 left-3 z-20 w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#d4ff00] hover:text-[#041a12] transition-all duration-200 shadow-md"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Card 2: Stats Grid */}
        <div className={`bg-white p-6 md:p-8 rounded-[24px] xl:rounded-[2rem] flex flex-col justify-between shadow-[0_4px_6px_2px_rgba(0,0,0,0.1),0_2px_4px_2px_rgba(0,0,0,0.06)] ${overlay ? 'h-full' : 'h-auto min-h-[220px] md:min-h-[240px]'}`}>
          <p className="text-[13px] md:text-[14px] xl:text-[13px] text-gray-600 font-medium leading-relaxed">
            At Solarkon, we help homes, businesses, and industries across Pakistan cut energy costs with expertly engineered solar systems built to last.
          </p>
          <div className="flex items-end gap-3 xl:gap-4 mt-6 lg:mt-4 xl:mt-4">
            <div className="flex-1">
              <h4 className="text-[2.2rem] md:text-[2.6rem] lg:text-[2rem] xl:text-[2.8rem] font-black text-black tracking-tighter leading-none mb-1">+112k</h4>
              <p className="text-[12px] md:text-[13px] lg:text-[11px] xl:text-[14px] font-bold text-black leading-tight">Solar Panels<br />Installed</p>
            </div>
            <div className="flex-1">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-9 lg:h-9 xl:w-12 xl:h-12 bg-[#d4ff00] rounded-[0.8rem] xl:rounded-[1rem] flex items-center justify-center mb-2 xl:mb-3">
                <User className="w-5 h-5 md:w-6 md:h-6 lg:w-4 lg:h-4 xl:w-6 xl:h-6 text-[#041a12]" />
              </div>
              <p className="text-[12px] md:text-[13px] lg:text-[11px] xl:text-[14px] font-bold text-black leading-tight">Industry Leaders,<br />With Proven<br />Experts</p>
            </div>
          </div>
        </div>

        {/* Card 3: Green Highlight CTA */}
        <div className={`bg-[#d4ff00] p-6 md:p-8 rounded-[24px] xl:rounded-[2rem] flex flex-col justify-between shadow-[0_4px_6px_2px_rgba(0,0,0,0.1),0_2px_4px_2px_rgba(0,0,0,0.06)] ${overlay ? 'h-full' : 'h-auto min-h-[220px] md:min-h-[240px]'}`}>
          <h3 className="font-black text-[1.8rem] md:text-[2rem] lg:text-[1.6rem] xl:text-[2.2rem] text-black tracking-tight leading-[1.05] mb-6">
            Discover Next-Gen Solar Solutions
          </h3>
          <Link href = "/solutions"className="bg-[#041a12] text-white w-max px-6 lg:px-5 xl:px-7 py-3 lg:py-2.5 xl:py-3.5 rounded-full text-[13px] md:text-[14px] lg:text-[12px] xl:text-[14px] font-bold hover:bg-white hover:text-black transition-colors shadow-lg flex items-center gap-2 mt-auto">
            Explore <ArrowUpRight className="w-4 h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4" />
          </Link>
        </div>

      </div>

      {/* Fullscreen video modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 md:w-12 md:h-12 bg-white/10 hover:bg-[#d4ff00] hover:text-[#041a12] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg border border-white/20"
            aria-label="Close video"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <video
            ref={fullscreenVideoRef}
            src="/heroVideo_optimized.mp4"
            poster="/heroVideo_poster.jpg"
            className="w-full h-full max-w-[100vw] max-h-[100vh] object-contain"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
