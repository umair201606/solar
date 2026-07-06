import { House, Drill, Factory, Tractor } from "lucide-react";
import { serviceOfferings } from "../../data/companyData";
import useScrollAnimation from '../../lib/useScrollAnimation';

const icons = [House, Drill, Factory, Tractor];

export default function Services() {
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 overflow-hidden">
      <div ref={sectionRef}>

        {/* Top Header & Stats */}
        <div className="flex flex-col lg:flex-row justify-between  gap-10 sm:gap-12 mb-13">
          <div className="max-w-2xl overflow-hidden">
            <div className="border border-[rgb(5,31,3)] rounded-full px-5 py-1.5 w-max mb-6">
              <span className="text-[rgb(5,31,3)] text-sm font-medium tracking-wide">Powering Solutions</span>
            </div>
            <h2
              className={`text-4xl md:text-5xl lg:text-[48px] font-bold text-text-main leading-[1.1] tracking-tight ${isVisible ? 'slide-from-left' : 'slide-from-left-init'}`}
            >
              Revolutionizing Energy for Tomorrow's World
            </h2>
            <p
              className={`text-text-muted mt-6 text-lg leading-relaxed ${isVisible ? 'animate-fade-in-up-delay-3' : 'animate-fade-in-up-init'}`}
            >
              At <strong className="text-dark-bg">Solarkon</strong>, we design and implement clean energy systems that help people, businesses, and the planet thrive efficiently, sustainably, and intelligently.
            </p>
          </div>
          
             {/* Stats */}
          <div className="flex items-end lg:self-end gap-8 sm:gap-12 lg:gap-14">

            <div className="flex flex-col basis-auto ">
              <div className="text-[2.5rem] sm:text-[48px] tracking-[-3px] sm:tracking-[-4px] font-extrabold  text-[#021b06]">
                173k
              </div>

              <div className="text-[18px] sm:text-[22px] tracking-tighter leading-5 font-bold text-[#021b06]">
                kWh Generated
                <br />
                Daily
              </div>
            </div>

            <div className="w-px h-24 sm:h-32 bg-gray-300" />

            <div className="flex flex-col basis-auto gap-2.5">
              <div className="text-[2.5rem] sm:text-[48px] tracking-[-2px] font-extrabold  text-[#021b06]">
                200+
              </div>

              <div className="text-[18px] sm:text-[22px] tracking-tighter leading-5 font-bold text-[#021b06]">
                Homes & Businesses
                <br />
                Powered
              </div>
            </div>

          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceOfferings.map((service, idx) => {
            const Icon = icons[idx];
            const isDark = idx === 1; 
            
            return (
              <div 
                key={idx} 
                className={`px-7.5 py-10 rounded-[2rem] flex flex-col justify-between min-h-[253px] shadow-xl hover:-translate-y-2 transition-transform duration-300 ${isDark ? 'bg-dark-bg text-white' : 'bg-primary text-dark-bg'}`}
              >
                <div className={` rounded-full flex items-center justify-center `}>
                  <Icon className={`w-7 h-7 ${isDark ? 'text-white' : 'text-dark-bg'}`} />
                </div>
                <div>
                  <h3 className="text-[1.35rem] font-extrabold mb-4 leading-tight tracking-tight">{service.title}</h3>
                  <p className={`text-sm leading-tight  ${isDark ? 'text-gray-400 font-light' : 'text-dark-bg/90 font-medium'}`}>
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
