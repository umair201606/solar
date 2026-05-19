import { Zap } from "lucide-react";

export default function WhoWeAre() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Images Side */}
        <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800"
            alt="Solarkon Solar Installation"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[250px]">
            <Zap className="text-primary w-10 h-10 shrink-0" fill="currentColor" />
            <p className="font-bold text-dark-bg leading-tight">Leading Solar Provider in Pakistan</p>
          </div>
        </div>

        {/* Text Side */}
        <div className="flex flex-col">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3">
            Who We Are
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-dark-bg leading-tight mb-6">
            Powering a Brighter,<br /> Greener Pakistan
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            <strong className="text-dark-bg">Solarkon Private Limited</strong> is a premier solar energy solutions provider in Pakistan, known for delivering high-performance systems tailored to residential, commercial, industrial, and agricultural needs. Our team of certified engineers and technicians brings decades of combined experience. We are proud to have installed Pakistan&apos;s largest solar project, with a capacity of 150MW.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#041a12] text-white p-8 rounded-3xl flex flex-col justify-center transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                To lead Pakistan's transition toward a clean energy future through sustainable innovation.
              </p>
            </div>
            <div className="bg-primary text-[#041a12] p-8 rounded-3xl flex flex-col justify-center transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold mb-3">Our Passion</h3>
              <p className="text-sm font-medium leading-relaxed">
                With a customer-centric approach and a passion for sustainability, we strive to lead Pakistan&apos;s transition toward a clean energy future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
