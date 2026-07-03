import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import HeroCards from './HeroCards';

const maskSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1403' height='852' viewBox='0 0 1403 852'%3E%3Cpath fill='white' d='M679 852C695.569 852 709 838.569 709 822V538C709 521.431 722.431 508 739 508H1373C1389.57 508 1403 494.569 1403 478V30C1403 13.4314 1389.57 0 1373 0H30C13.4315 0 0 13.4315 0 30V822C0 838.569 13.4315 852 30 852H679Z'/%3E%3C/svg%3E`;

export default function HeroSection() {
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== 'undefined' && window.innerWidth >= 1024,
    );

    useEffect(() => {
        const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    const maskStyle = isDesktop
        ? {
              WebkitMaskImage: `url("${maskSvg}")`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              WebkitMaskPosition: 'center',
              maskImage: `url("${maskSvg}")`,
              maskRepeat: 'no-repeat',
              maskSize: '100% 100%',
              maskPosition: 'center',
          }
        : undefined;

    return (
        <section
            className="w-full relative overflow-x-hidden bg-white md:px-2 md:py-1 lg:px-3 lg:py-2"
            aria-label="Hero section"
        >
            <div className="mx-auto w-full max-w-[1440px]">
                {/* Hero Box */}
                <div className="relative flex w-full flex-col overflow-hidden rounded-none md:rounded-[36px] lg:rounded-none h-[90dvh] md:h-[calc(100dvh-8px)] lg:h-auto lg:aspect-[1403/852]">
                    
                    {/* Background Mask & Static Hero Image */}
                    <div
                        className="absolute inset-0 z-0 overflow-hidden bg-[#0a2316]"
                        style={maskStyle}
                    >
                        <img
                            src="/final.webp"
                            alt=""
                            aria-hidden="true"
                            className="size-full object-cover"
                            fetchPriority="high"
                        />
                        <div
                            className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-b from-black/60 via-transparent to-black/50 lg:bg-transparent lg:from-black/40 lg:via-transparent lg:to-black/35"
                            aria-hidden="true"
                        />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 flex h-full w-full flex-col">
                        <Navbar />

                        {/* Middle Text Content */}
                        <div className="flex flex-1 max-w-[900px] flex-col items-start justify-center px-6 sm:px-10 md:px-16 lg:px-20 pb-12 pt-[10%] sm:pt-[5%] lg:pt-[4%] lg:pb-[280px] xl:pb-[320px]">
                            <div>
                                {/* overflow-hidden clips the slide-in animation so it doesn't cause horizontal scroll */}
                                <div className="overflow-hidden">
                                    <h1
                                        className="max-w-[819px] text-3xl leading-[0.95] font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[80px] slide-from-left"
                                    >
                                        Solarkon Delivers
                                        <br />a Sustainable Future
                                    </h1>
                                </div>

                                <p
                                    className="mt-4 max-w-[819px] text-sm leading-snug font-semibold tracking-tight text-white/95 sm:text-lg md:text-xl lg:max-w-[600px] xl:max-w-[819px] animate-fade-in-up-delay-2"
                                >
                                    Solarkon Private Limited delivers solar energy
                                    solutions for your home, business, and
                                    agricultural land with top-of-the-line products
                                    tailored to your needs.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Cards Overlay */}
                    <div 
                        className="hidden lg:absolute lg:right-1 lg:left-2 lg:z-20 lg:block"
                        style={{ bottom: '1.85%', height: '34.85%' }}
                    >
                        <HeroCards overlay />
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="mt-6 flex flex-col gap-4 px-4 pb-12 lg:hidden">
                    <HeroCards />
                </div>
            </div>
        </section>
    );
}
