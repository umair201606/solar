import { Zap } from "lucide-react";
import HeroCards from "./HeroCards";

export default function Hero() {
  return (
    <>
      {/* 
        Background is the specific sky blue from the design. 
        Generous bottom padding (pb-48) allows the cards to overlap nicely.
      */}
      <section className="relative w-full pt-36 pb-48 bg-[#4D9DE0] overflow-hidden z-10">
        
        {/* Subtle background glow/gradient to make it feel premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="max-w-2xl text-white pt-8 lg:pt-0">
              <p className="text-sm md:text-base font-semibold tracking-wide text-white/90 mb-3 uppercase">
                Nature Produces &amp; We Deliver
              </p>
              <h1 className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-extrabold leading-[1.02] tracking-[-0.03em] mb-6 drop-shadow-sm">
                Solar Energy Solutions for Pakistan
              </h1>
              
              <p className="text-lg md:text-xl text-white/95 mb-10 max-w-xl font-light leading-relaxed">
                <span className="font-bold text-white">Solarkon Private Limited</span>{" "}
                delivers solar energy solutions for your home, business, and
                agricultural land—with top-of-the-line products tailored to your needs.
              </p>
              
              <button className="bg-[#D4F64D] text-[#08100B] px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-xl shadow-black/10 hover:scale-105">
                Get a Free Consultation <Zap className="w-5 h-5 fill-current" />
              </button>
            </div>
            
            {/* Right Column: Production-Grade Image */}
            {/* The design uses a transparent PNG. Since we are using standard JPGs, I placed it inside an elegant, soft-rounded container that matches the clean tech vibe perfectly. */}
            <div className="relative w-full h-[450px] lg:h-[600px] flex justify-center lg:justify-end items-end pb-8 lg:pb-0">
              <div className="relative w-full max-w-[500px] h-[90%] rounded-[2.5rem] rounded-br-[5rem] overflow-hidden shadow-2xl border-4 border-white/20 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200" 
                  className="w-full h-full object-cover object-center" 
                  alt="Solar Engineers Team" 
                />
                {/* Dark gradient overlay at the bottom of the image for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4D9DE0]/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The cards component is brought outside the blue section container 
          so it can easily overlap using negative top margin. */}
      <HeroCards />
    </>
  );
}