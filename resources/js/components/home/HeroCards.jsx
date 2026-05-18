import { Play, Contact2 } from "lucide-react";

export default function HeroCards() {
  return (
    // Negative margin (-mt-32) pulls the cards up over the blue background
    <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-8 -mt-32 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Video/Info Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 items-center shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex-1">
            <h3 className="font-extrabold text-[1.4rem] tracking-tight leading-[1.1] mb-3 text-black">
              Our Story
            </h3>
            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
              Solarkon Private Limited is the leading solar energy provider in Pakistan,
              offering top-of-the-line products and services tailored to your individual needs.
            </p>
          </div>
          
          {/* Video Thumbnail block with play button */}
          <div className="w-full sm:w-[120px] h-[120px] bg-gray-100 rounded-2xl relative flex-shrink-0 flex items-center justify-center overflow-hidden group cursor-pointer shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1509391366360-515432d667c4?w=400"
              alt="Solar Panels Thumbnail"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Play Button Overlay */}
            <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center z-10 shadow-lg text-[#D4F64D] group-hover:bg-[#D4F64D] group-hover:text-black transition-colors duration-300">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Card 2: Stats & Certifications */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] flex border border-gray-100 shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex w-full items-center">
            
            {/* Left Stat */}
            <div className="flex-1 pr-4 border-r-2 border-gray-100">
              <h4 className="text-[2.5rem] font-black text-black mb-1 tracking-tighter leading-none">
                700+
              </h4>
              <p className="text-[13px] font-bold text-gray-800 leading-tight">
                Solar<br />Installations
              </p>
            </div>
            
            {/* Right Stat / Certification */}
            <div className="flex-1 pl-6">
              <div className="bg-[#D4F64D] w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <Contact2 className="text-black w-5 h-5" strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-bold text-gray-800 leading-tight">
                150MW<br />Installed<br />Capacity
              </p>
            </div>
            
          </div>
        </div>

        {/* Card 3: Highlight CTA (Lime Green) */}
        <div className="bg-[#D4F64D] p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between shadow-xl shadow-[#D4F64D]/30 min-h-[220px] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
          
          {/* Subtle background decoration to match the screenshot vibe */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="font-extrabold text-[1.8rem] text-black tracking-tight leading-[1.05] relative z-10">
            Vision &amp; Values<br />of Our<br />Company
          </h3>
          
          <button className="bg-black text-white w-max px-6 py-3 rounded-full text-sm font-bold mt-6 hover:bg-white hover:text-black transition-colors duration-300 relative z-10 shadow-lg">
            Explore Solutions
          </button>
        </div>
        
      </div>
    </div>
  );
}