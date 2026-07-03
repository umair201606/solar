import { Award, Plus } from "lucide-react";
import { whyChooseSolarkon } from "../../data/companyData";

const maskSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1403' height='852' viewBox='0 0 1403 852'%3E%3Cpath fill='white' d='M679 852C695.569 852 709 838.569 709 822V538C709 521.431 722.431 508 739 508H1373C1389.57 508 1403 494.569 1403 478V30C1403 13.4314 1389.57 0 1373 0H30C13.4315 0 0 13.4315 0 30V822C0 838.569 13.4315 852 30 852H679Z'/%3E%3C/svg%3E`;

export default function Features() {
  return (
    <section className="py-20 lg:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      
      <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center lg:items-start">

        <div className="relative mt-4 lg:mt-8 w-full aspect-[555/600] drop-shadow-xl">
          
          <div 
            className="absolute inset-0 transition-all duration-300 rounded-[2rem]" 
            style={{
              WebkitMaskImage: `url("${maskSvg}")`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              WebkitMaskPosition: 'center',
              maskImage: `url("${maskSvg}")`,
              maskRepeat: 'no-repeat',
              maskSize: '100% 100%',
              maskPosition: 'center',
            }}
          >
            <img 
              src="/images/solar-farm-aerial.webp"
              alt="Solar installation" 
              className="h-full w-full object-cover" 
            />
          </div>

          <div 
            className="absolute top-0 left-0 bg-[#041a12] z-20 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 lg:p-5 xl:p-7 shadow-2xl"
            style={{ width: '26%', height: '46.7%' }}
          >
            <Award className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4 text-[#d4ff00]" strokeWidth={1.5} />
            <p className="text-[13px] sm:text-base md:text-lg lg:text-[15px] xl:text-xl font-extrabold leading-tight tracking-tight text-white">
              Top <br />
              <span className="text-[#d4ff00]">Innovation</span>
              <br /> Awards
            </p>
          </div>

          <div 
            className="absolute bottom-0 right-0 flex items-center justify-center z-20"
            style={{ width: '22.34%', height: '17.83%' }}
          >
            <div 
              className="w-[75%] h-[80%] bg-[#041a12] flex items-center justify-center text-[#d4ff00] 
                         rounded-[1rem] md:rounded-[1.5rem] hover:scale-110 transition-transform cursor-pointer shadow-xl"
            >
              <Plus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
            </div>
          </div>

        </div>

        <div className="flex flex-col">
          <div className="border border-gray-200 bg-gray-50 rounded-full px-5 py-2 w-max mb-6">
            <span className="text-gray-900 text-sm font-semibold tracking-wide">Why Choose Solarkon</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-[#050505] leading-[1.05] tracking-tight mb-6 slide-from-left">
            Where Innovation Meets Impact
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 lg:pr-10 animate-fade-in-up-delay-1">
            <strong className="text-black font-bold">Solarkon</strong> combines breakthrough solar technology with real-world sustainability, delivering clean energy solutions that drive progress, reduce emissions, and empower communities globally.
          </p>

          <div className="space-y-6">
            {whyChooseSolarkon.slice(0, 3).map((item, idx) => (
              <div key={idx} className="relative w-full group drop-shadow-sm hover:drop-shadow-md transition-all">
                <div className="absolute top-0 right-0 w-[calc(100%-84px)] h-full bg-[#041a12] rounded-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>
                
                <div className="absolute bottom-0 left-0 w-full h-[calc(100%-84px)] bg-[#041a12] rounded-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>
                
                <div className="absolute bottom-0 right-0 w-[calc(100%-60px)] h-[calc(100%-84px)] bg-[#041a12] rounded-br-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>
                
                <svg className="absolute top-[60px] left-[61px] w-[24px] h-[24px] text-[#041a12] group-hover:text-[#0a261a] transition-colors z-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 24 0 C 24 13.25 13.25 24 0 24 L 24 24 Z" />
                </svg>

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
