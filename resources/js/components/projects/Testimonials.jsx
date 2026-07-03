import { siteImages } from "../../data/siteImages";
import { Quote } from "lucide-react";

export default function Testimonials() {
  
  return (
    <section className="py-24 bg-white max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start">
        
        {/* Left: Standard Image */}
        <div className="relative w-full h-[650px] rounded-[2.5rem] overflow-hidden drop-shadow-xl">
          <img src="/images/solar-team-install.webp" alt="Team" className="w-full h-full object-cover" />
        </div>

        {/* Right: Content & Testimonial Card */}
        <div className="flex flex-col pt-4">
          <div className="border border-gray-500 rounded-full px-5 py-1.5 w-max mb-6">
            <span className="text-gray-600 text-sm font-medium tracking-wide">Powered by Trust and Results</span>
          </div>
          
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#050505] leading-[1.05] tracking-tight mb-6">
            What Our Clients Say Matters
          </h2>
          
          <p className="text-gray-600 text-[17px] leading-relaxed mb-12 pr-4">
            Every <strong className="text-black font-bold">Solarize</strong> customer experience reflects the trust and quality behind our services. Their voices aren't just validation, they're a guiding force for our continued innovation in clean energy.
          </p>

          <div className="relative pt-2 pl-2 mt-4 group mb-10">
            
            <div className="absolute inset-0 drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)] transition-all">
              
              <div className="absolute top-0 right-0 w-[calc(100%-84px)] h-full bg-[#041a12] rounded-[2rem] transition-colors group-hover:bg-[#0a261a]"></div>
              
              <div className="absolute bottom-0 left-0 w-full h-[calc(100%-84px)] bg-[#041a12] rounded-[2rem] transition-colors group-hover:bg-[#0a261a]"></div>
              
              <div className="absolute bottom-0 right-0 w-[calc(100%-84px)] h-[calc(100%-84px)] bg-[#041a12] rounded-br-[2rem] transition-colors group-hover:bg-[#0a261a]"></div>
              
              <svg className="absolute top-[60px] left-[60px] w-[24px] h-[24px] text-[#041a12] transition-colors group-hover:text-[#0a261a] z-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M 24 0 C 24 13.25 13.25 24 0 24 L 24 24 Z" />
              </svg>
            </div>

            <div className="absolute top-[4px] left-[4px] w-[72px] h-[72px] bg-[#d4ff00] rounded-[1.5rem] flex items-center justify-center z-20">
              <Quote className="w-8 h-8 text-[#041a12] fill-[#041a12] rotate-180" />
            </div>
            
            <div className="relative z-10 pl-[110px] pt-[64px] pr-8 pb-10 min-h-[220px]">
              <p className="text-[1.25rem] font-bold text-white italic leading-[1.6] mb-10">
                "Solarkon provides services at Industrial Scale,Fast and Quick.Probably one of the best solar installation services in Pakistan ."
              </p>
              <div className="flex items-center gap-4">
                <img src={siteImages.clients.industrial} alt="Client" className="w-[50px] h-[50px] rounded-full object-cover border-2 border-[#d4ff00]" />
                <div>
                  <h4 className="text-white font-bold text-base">Bashir Sons</h4>
                  <p className="text-[#d4ff00] text-sm font-medium">Bahsir Sons Industries</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
