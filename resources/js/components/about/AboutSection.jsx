import { ShieldCheck, MessageCircle, Heart } from "lucide-react";
import { siteImages } from "../../data/siteImages";

export default function AboutSection() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-hover" />,
      title: "Long-term Warranties",
      description: "All our systems come with long-term warranties. In case of any fault, our team ensures quick diagnosis and repair under warranty terms."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-primary-hover" />,
      title: "Dedicated After-Sales",
      description: "We don't just install — we stay with you! Solarkon offers dedicated after-sales service to ensure your system runs smoothly for years to come."
    },
    {
      icon: <Heart className="w-6 h-6 text-primary-hover" />,
      title: "Customer Centric",
      description: "With a customer-centric approach and a passion for sustainability, we strive to lead Pakistan's transition toward a clean energy future."
    }
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 overflow-x-clip">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Images Side */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 border-[6px] border-white">
            <img
              src={siteImages.fieldSunset}
              alt="Solar field at sunset across Pakistan"
              className="w-full h-[360px] sm:h-[460px] lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Glass Badge */}
          <div className="absolute -bottom-8 right-3 sm:-bottom-10 sm:-right-8 z-20 bg-dark-bg/90 backdrop-blur-xl border border-primary/20 text-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-[240px] sm:max-w-[280px]">
            <div className="text-primary font-bold text-4xl sm:text-5xl mb-2">150<span className="text-3xl">+</span></div>
            <div className="text-sm font-medium tracking-wide uppercase text-gray-300">MW Capacity Installed</div>
            <p className="text-xs text-gray-400 mt-2">Setting new benchmarks in renewable energy across Pakistan.</p>
          </div>
          
          <div className="absolute top-10 -left-10 w-full h-full bg-primary/20 rounded-3xl -z-10 blur-2xl"></div>
        </div>

        {/* Text Side */}
        <div className="flex flex-col gap-6 lg:pl-10 mt-16 lg:mt-0">
          <div>
            <span className="text-dark-bg bg-primary font-bold tracking-widest uppercase text-sm mb-2 ">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark-bg leading-tight mb-6 slide-from-left">
              Powering a Brighter, <br />
              Greener Pakistan
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4 animate-fade-in-up-delay-1">
              <strong className="text-dark-bg">Solarkon Private Limited</strong> is the leading solar energy provider in Pakistan, offering top-of-the-line products and services that can be tailored to meet your individual needs.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Our experienced team of professionals is dedicated to delivering the highest quality. We are proud to have installed Pakistan&apos;s largest solar project, with a capacity of 150MW, setting a new benchmark in renewable energy.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 group ">
                <div className="bg-primary/1 p-4 rounded-2xl flex items-center justify-center h-14 w-14 shrink-0 transition-colors duration-300 shadow-sm border border-primary/50">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-dark-bg mb-2 group-hover:text-primary-hover transition-colors">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}
