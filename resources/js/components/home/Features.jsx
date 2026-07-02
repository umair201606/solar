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
      imgRef.current.style.transform = `translate3d(0, ${Math.min(Math.max(offset, -60), 60)}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 bg-white">

      <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-start">

        <div
          className="relative mt-8 w-full aspect-[555/600] overflow-hidden rounded-[2rem] isolate"
          style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', transform: 'translateZ(0)' }}
        >
          <div
            ref={imgRef}
            className="absolute inset-0 will-change-transform"
          >
            <img
              src="/images/solar-farm-aerial.png"
              alt="Solar farm"
              className="h-full w-full object-cover rounded-[2rem]"
            />
          </div>
        </div>

        {/* Right: The Numbered List */}
        <div className="flex flex-col">
          <div className="border border-gray-800 rounded-full px-5 py-1.5 w-max mb-6">
            <span className="text-gray-800 text-sm font-medium tracking-wide">Why Choose Solarkon</span>
          </div>

          <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#050505] leading-[1.05] tracking-tight mb-8">
            Where Innovation Meets Impact
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 pr-10">
            <strong className="text-black font-bold">Solarkon</strong> combines breakthrough solar technology with real-world sustainability, delivering clean energy solutions that drive progress, reduce emissions, and empower communities globally.
          </p>

          <div className="space-y-6">
            {whyChooseSolarkon.slice(0, 3).map((item, idx) => (
              <div key={idx} className="relative w-full group drop-shadow-sm hover:drop-shadow-md transition-all">
                <div className="absolute inset-0 bg-[#041a12] rounded-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>

                <div className="absolute top-[12px] left-[12px] w-[60px] h-[60px] bg-[#d4ff00] rounded-[1.25rem] flex items-center justify-center font-black text-[1.5rem] text-[#041a12] z-20">
                  {item.num || `0${idx + 1}`}
                </div>

                <div className="relative z-10 pl-[108px] pr-8 py-8 min-h-[140px] flex flex-col justify-center">
                  <h3 className="text-[#d4ff00] font-bold text-[1.3rem] mb-1.5">{item.title}</h3>
                  <p className="text-[14px] font-light text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
