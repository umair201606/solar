import { useRef, useEffect } from "react";
import { whyChooseSolarkon } from "../../data/companyData";

export default function Features() {
  const imgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const speed = 0.08;
      const offset = (rect.top - window.innerHeight) * speed;
      imgRef.current.style.transform = `translate3d(0, ${Math.min(
        Math.max(offset, -60),
        60
      )}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 bg-white">
      <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-start">
        
        {/* Left: Image with Parallax */}
        <div
          className="relative mt-8 w-full aspect-[4/3] sm:aspect-[555/600] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] isolate"
          style={{
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            transform: "translateZ(0)",
          }}
        >
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <img
              src="/images/solar-farm-aerial.webp"
              alt="Solar farm"
              className="h-full w-full object-cover rounded-[2rem]"
            />
          </div>
        </div>

        {/* Right: Content & The Numbered List */}
        <div className="flex flex-col">
          <div className="border border-gray-800 rounded-full px-5 py-1.5 w-max mb-6">
            <span className="text-gray-800 text-sm font-medium tracking-wide">
              Why Choose Solarkon
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-[#050505] leading-[1.05] tracking-tight mb-6 sm:mb-8">
            Where Innovation Meets Impact
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 pr-0 sm:pr-6 lg:pr-10">
            <strong className="text-black font-bold">Solarkon</strong> pairs
            premium solar technology with certified engineering to deliver
            systems that cut energy bills and run reliably for years. From site
            survey to after-sales support, we handle every step.
          </p>

          {/* Cards Wrapper */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {whyChooseSolarkon.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="relative w-full group drop-shadow-sm hover:drop-shadow-md transition-all"
              >
                {/* Background Box 1: Right Side (Cutout minus 64px/80px/96px) */}
                <div className="absolute top-0 right-0 w-[calc(100%-64px)] sm:w-[calc(100%-80px)] lg:w-[calc(100%-96px)] h-full bg-[#041a12] transition-colors group-hover:bg-[#0a261a] rounded-[1.5rem] rounded-bl-none z-0"></div>

                {/* Background Box 2: Bottom Side */}
                <div className="absolute bottom-0 left-0 w-full h-[calc(100%-64px)] sm:h-[calc(100%-80px)] lg:h-[calc(100%-96px)] bg-[#041a12] transition-colors group-hover:bg-[#0a261a] rounded-[1.5rem] rounded-tr-none z-0"></div>

                {/* Inner Corner Inverted SVG */}
                <svg
                  className="absolute z-0 text-[#041a12] group-hover:text-[#0a261a] transition-colors 
                    top-[40px] left-[40px] w-[24px] h-[24px] 
                    sm:top-[56px] sm:left-[56px] sm:w-[24px] sm:h-[24px] 
                    lg:top-[64px] lg:left-[64px] lg:w-[32px] lg:h-[32px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M 24 0 C 24 13.25 13.25 24 0 24 L 24 24 Z" />
                </svg>

                {/* Floating Number Box */}
                <div
                  className="absolute z-20 flex items-center justify-center bg-[#d4ff00] text-[#041a12] font-black
                    top-[8px] left-[8px] w-[48px] h-[48px] rounded-[1rem] text-[1.1rem]
                    sm:top-[12px] sm:left-[12px] sm:w-[56px] sm:h-[56px] sm:rounded-[1.15rem] sm:text-[1.3rem]
                    lg:top-[16px] lg:left-[16px] lg:w-[64px] lg:h-[64px] lg:rounded-[1.25rem] lg:text-[1.5rem]"
                >
                  {item.num || `0${idx + 1}`}
                </div>

                {/* Content Container */}
                <div
                  className="relative z-10 flex flex-col justify-center
                    min-h-[100px] py-5 pr-4 pl-[80px]
                    sm:min-h-[120px] sm:py-6 sm:pr-6 sm:pl-[96px]
                    lg:min-h-[140px] lg:py-8 lg:pr-8 lg:pl-[116px]"
                >
                  <h3
                    className="text-[#d4ff00] font-bold mb-1 sm:mb-1.5
                    text-[1rem] sm:text-[1.15rem] lg:text-[1.3rem]"
                  >
                    {item.title}
                  </h3>
                  <p
                    className="font-light text-gray-300 leading-relaxed
                    text-[12px] sm:text-[13px] lg:text-[14px]"
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}