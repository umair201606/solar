import useScrollAnimation from '../../lib/useScrollAnimation';

export default function WhoWeAre() {
    const [sectionRef, isVisible] = useScrollAnimation();

    return (
        <section className="bg-[#ffffff] px-5 sm:px-8 lg:mx-12.5 lg:px-0">
            <div className="max-w-[1340px] flex flex-col lg:flex-row gap-6 pt-10 pb-16 sm:pt-13.5 sm:pb-27">
                {/* Badge */}
                <div className="lg:min-w-[196.5px] text-[rgb(5,31,3)] text-md flex basis-auto">
                    <span className="justify-start w-[129.5px] text-start relative block border-[rgb(5,31,3)] border-1 rounded-2xl px-4 py-1.5 h-[38px] max-w-full font-normal">
                        Who We Are
                    </span>
                </div>

                {/* Main Content */}
                <div ref={sectionRef} className="flex flex-col gap-7.5 flex-1">
                    {/* Top */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="max-w-[850px] overflow-hidden">
                            <h2
                                className={`text-[28px] sm:text-[36px] lg:text-[48px] leading-[0.95] font-bold text-[rgb(1,25,5)] overflow-hidden ${isVisible ? 'slide-from-left' : 'slide-from-left-init'}`}
                            >
                                Nature Produces & We
                                <br />
                                Deliver Solar System
                            </h2>

                            <p
                                className={`mt-6 sm:mt-10 mb-3 text-[16px] sm:text-[18px] tracking-tight leading-7 text-[#243024] ${isVisible ? 'animate-fade-in-up-delay-1' : 'animate-fade-in-up-init'}`}
                            >
                                <strong>Solarkon</strong> is a renewable energy
                                company committed to driving global
                                sustainability through smart solar technology,
                                empowering homes, businesses and communities to
                                transition to a cleaner, more efficient and
                                future-proof energy ecosystem.
                            </p>
                        </div>

                        <div className="flex items-start sm:items-center lg:items-end">
                            <button className="bg-[#c6f321] px-[31px] py-[10px] rounded-full text-[16px] sm:text-[18px] font-semibold whitespace-nowrap">
                                Get to Know Us ⚡
                            </button>
                        </div>
                    </div>

                    {/* Bottom (Image + Cards Row) */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:h-[369px]">
                        {/* Image Wrapper */}
                        <div className="flex-1">
                            <img
                                src="/images/solar-team-install.webp"
                                alt="Solar Panel Installation"
                                loading="lazy"
                                className="w-full h-[240px] sm:h-[300px] lg:h-[369px] object-cover object-center rounded-[25px]"
                            />
                        </div>

                        {/* Cards Wrapper */}
                        <div className="w-full lg:w-[271px] flex flex-col sm:flex-row lg:flex-col gap-4">
                            {/* Our Vision Card */}
                            <div className="flex-1 bg-[rgb(5,31,3)] rounded-[25px] p-6 flex flex-col justify-center">
                                <h3 className="text-white text-[20px] sm:text-[24px] font-bold mb-2">
                                    Our Vision
                                </h3>
                                <p className="text-white/90 text-sm leading-tighter">
                                    To lead Pakistan&apos;s transition toward a clean energy future by making solar energy accessible to every home, business, and industry.
                                </p>
                            </div>

                            {/* Our Mission Card */}
                            <div className="flex-1 bg-[#c6f321] rounded-[25px] p-6 flex flex-col justify-center">
                                <h3 className="text-[20px] sm:text-[24px] font-bold mb-2">
                                    Our Mission
                                </h3>
                                <p className="text-[#051f03] font-md text-sm leading-tighter">
                                    To deliver high-performance solar solutions with a customer-centric approach, ensuring long-term value through certified engineering, quality products, and dedicated after-sales support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
