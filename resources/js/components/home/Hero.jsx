import { Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import HeroCards from "./HeroCards";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Trigger smooth fade and scale entries for text elements on load
    setLoaded(true);

    // Track scroll for clean floating parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // IntersectionObserver to coordinate the drawing of the vector illustration
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Parallax translation for floating above the screen
  const floatY = scrollY * -0.12;
  const organicWave = Math.sin(scrollY * 0.003) * 8;

  return (
    <>
      {/* Self-contained styling for text slide-reveals, vector blueprints, and turbine rotations */}
      <style>{`
        /* Premium Text Entrance Animations sliding in from the left */
        .text-reveal-left {
          opacity: 0;
          transform: translateX(-60px) scale(0.98);
          filter: blur(5px);
          animation: revealTextLeft 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes revealTextLeft {
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0);
          }
        }

        /* SVG Cartoon Vector Draw-In Staging */
        .vector-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          transition: stroke-dashoffset 2.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .draw-active .vector-draw {
          stroke-dashoffset: 0;
        }
        .vector-fade-in {
          opacity: 0;
          transform: translateY(20px) scale(0.96);
          transition: opacity 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .draw-active .vector-fade-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Infinite Wind Turbine Rotations */
        .spin-turbine-back-left {
          animation: rotateTurbine 6s linear infinite;
        }
        .spin-turbine-back-mid {
          animation: rotateTurbine 4.8s linear infinite;
        }
        .spin-turbine-front {
          animation: rotateTurbine 3.8s linear infinite;
        }
        @keyframes rotateTurbine {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Floating Ambient Cloud Waves */
        .float-cloud-slow {
          animation: waveCloud 8s infinite alternate ease-in-out;
        }
        .float-cloud-fast {
          animation: waveCloud 5s infinite alternate ease-in-out;
        }
        @keyframes waveCloud {
          0% { transform: translateX(0px); }
          100% { transform: translateX(15px); }
        }

        /* Ambient Solar Sunshine Pulse */
        .sun-pulse {
          animation: pulseSunshine 8s infinite alternate ease-in-out;
        }
        @keyframes pulseSunshine {
          0% {
            opacity: 0.85;
            transform: scale(0.97);
            fill: #99CD96;
          }
          100% {
            opacity: 1;
            transform: scale(1.03);
            fill: #AEE2AB;
          }
        }

        /* Blowing Wind Waves */
        .wind-wave-1 {
          animation: blowWind 8s infinite linear;
        }
        .wind-wave-2 {
          animation: blowWind 11s infinite linear;
          animation-delay: 2.5s;
        }
        .wind-wave-3 {
          animation: blowWind 9.5s infinite linear;
          animation-delay: 5s;
        }
        @keyframes blowWind {
          0% {
            stroke-dashoffset: 400;
            opacity: 0;
          }
          15% {
            opacity: 0.5;
          }
          85% {
            opacity: 0.5;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }

        /* Main Ambient Vector Float */
        .vector-ambient-float {
          animation: vectorHover 5s infinite alternate ease-in-out;
        }
        @keyframes vectorHover {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
      `}</style>

      {/* 
        Background is the specific sky blue from the design. 
        Generous bottom padding (pb-48) allows the cards to overlap nicely.
      */}
      <section ref={containerRef} className="relative w-full pt-25 pb-48 bg-[#4D9DE0] overflow-hidden z-10">
        
        {/* Subtle background glow/gradient to make it feel premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTA with Premium Slide-in from Left Animations */}
            <div className="max-w-2xl text-white pt-8 lg:pt-0">
              <p 
                className="text-sm md:text-base font-semibold tracking-wide text-white/90 mb-3 uppercase text-reveal-left"
                style={{ animationDelay: "150ms" }}
              >
                Nature Produces &amp; We Deliver
              </p>
              
              <h1 
                className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-extrabold leading-[1.02] tracking-[-0.03em] mb-6 drop-shadow-sm text-reveal-left"
                style={{ animationDelay: "300ms" }}
              >
                Solar Energy Solutions for Pakistan
              </h1>
              
              <p 
                className="text-lg md:text-xl text-white/95 mb-10 max-w-xl font-light leading-relaxed text-reveal-left"
                style={{ animationDelay: "450ms" }}
              >
                <span className="font-bold text-white">Solarkon Private Limited</span>{" "}
                delivers solar energy solutions for your home, business, and
                agricultural land—with top-of-the-line products tailored to your needs.
              </p>
              
              <button 
                className="bg-[#D4F64D] text-[#08100B] px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-xl shadow-black/10 hover:scale-105 text-reveal-left"
                style={{ animationDelay: "600ms" }}
              >
                Get a Free Consultation <Zap className="w-5 h-5 fill-current" />
              </button>
            </div>
            
            {/* Right Column: Perfect Replica Cartoon Vector - Borderless, Floating, Spinning Turbines */}
            <div 
              className={`relative w-full h-[500px] lg:h-[650px] flex justify-center items-center pb-8 lg:pb-0 transform transition-all duration-1000 ease-out delay-100 ${
                loaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{
                transform: `translateY(${floatY + organicWave}px)`,
                willChange: "transform",
              }}
            >
              {/* Solar Aura Glow behind the Illustration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-[#D4F64D]/25 via-white/5 to-transparent blur-[85px] rounded-full pointer-events-none z-0"></div>

              {/* Vector SVG Wrapper - No border around it, floats dynamically */}
              <div className={`relative w-full max-w-[580px] h-full flex justify-center items-center vector-ambient-float z-10 ${isInView ? "draw-active" : ""}`}>
                <svg 
                  viewBox="0 0 800 600" 
                  width="100%" 
                  height="100%" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.22)]"
                >
                  {/* Backdrop shapes from user reference */}
                  
                  {/* Staged Group 1: Oval Green Backdrop & Ground Grass Base */}
                  <g className="vector-fade-in" style={{ transitionDelay: '0.1s' }}>
                    {/* Light Green Backdrop Oval */}
                    <ellipse cx="440" cy="320" rx="300" ry="210" fill="#A1D09E" className="sun-pulse" style={{ transformOrigin: '440px 320px' }} />
                    
                    {/* Dark Green Turf Base Grass Oval */}
                    <ellipse cx="430" cy="510" rx="270" ry="40" fill="#588C4E" stroke="#383D36" strokeWidth="3.5" />
                  </g>

                  {/* Flowing Wind Waves - Positioned behind house and turbines */}
                  <g className="vector-fade-in" style={{ transitionDelay: '0.3s' }}>
                    <path d="M 100,280 C 200,230 300,310 420,260 C 500,230 580,270 660,250" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="180 220" className="wind-wave-1" />
                    <path d="M 80,360 C 180,310 260,390 380,340 C 480,300 560,350 640,320" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="140 260" className="wind-wave-2" />
                    <path d="M 120,200 C 220,160 320,230 440,190 C 520,160 600,210 680,180" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" strokeDasharray="160 240" className="wind-wave-3" />
                  </g>

                  {/* Staged Group 2: The Modern Cream House Body */}
                  <g className="vector-fade-in" style={{ transitionDelay: '0.4s' }}>
                    {/* Right Front Wall Section */}
                    <path d="M 525,295 L 685,295 L 685,500 L 525,500 Z" fill="#FFFDF2" stroke="#383D36" strokeWidth="3.5" className="vector-draw" />
                    {/* Left Front Wall Section */}
                    <path d="M 360,295 L 525,295 L 525,500 L 360,500 Z" fill="#FFFDF2" stroke="#383D36" strokeWidth="3.5" className="vector-draw" />
                  </g>

                  {/* Staged Group 3: Curved Entrance Arch & Recess */}
                  <g className="vector-fade-in" style={{ transitionDelay: '0.6s' }}>
                    {/* Recessed Arched Shadow Archway */}
                    <path d="M 555,500 L 555,420 A 45,45 0 0 1 650,420 L 650,500 Z" fill="#D7CFBE" stroke="#383D36" strokeWidth="3.5" />
                    {/* Cream Outer Frame Arch */}
                    <path d="M 555,500 L 555,420 A 45,45 0 0 1 650,420 L 650,500 Z" fill="none" stroke="#383D36" strokeWidth="3.5" />
                    {/* Wood-Brown Door */}
                    <rect x="578" y="426" width="54" height="74" fill="#7A3B22" stroke="#383D36" strokeWidth="2.5" />
                    {/* Inset Door panels for 3D cartoon style */}
                    <rect x="586" y="434" width="38" height="18" fill="#5F2A15" stroke="#383D36" strokeWidth="1.5" />
                    <rect x="586" y="458" width="38" height="36" fill="#5F2A15" stroke="#383D36" strokeWidth="1.5" />
                    {/* Golden Door knob on the LEFT */}
                    <circle cx="583.5" cy="466" r="3.5" fill="#E2A478" stroke="#383D36" strokeWidth="1.2" />
                  </g>

                  {/* Staged Group 4: Gable Slanted Green Roof & Blue Solar Panel Grid */}
                  <g className="vector-fade-in" style={{ transitionDelay: '0.8s' }}>
                    {/* Dark Teal Green Gable Roof */}
                    <polygon points="350,295 520,195 690,295" fill="#136B66" stroke="#383D36" strokeWidth="4" className="vector-draw" />
                    {/* Roof Fascia horizontal overhang */}
                    <rect x="340" y="293" width="360" height="12" rx="3" fill="#136B66" stroke="#383D36" strokeWidth="3" />

                    {/* Highly Refined Solar Panel on Left Slope */}
                    {/* Silver/Grey Outer Metal Frame */}
                    <polygon points="388,271 502,209 522,239 408,301" fill="none" stroke="#BAC0BA" strokeWidth="3" />
                    {/* Deep Blue Solar Cell Base */}
                    <polygon points="390,270 500,210 520,240 410,290" fill="#1C5E8A" stroke="#383D36" strokeWidth="2" className="vector-draw" />
                    
                    {/* Solar cell inner grid lines - Geometrically Aligned to Perspective */}
                    {/* Long Grid lines (Along the Slope) */}
                    <line x1="399" y1="277" x2="505" y2="222" stroke="#E3EFF7" strokeWidth="1.5" />
                    <line x1="405" y1="283" x2="511" y2="231" stroke="#E3EFF7" strokeWidth="1.5" />
                    {/* Cross Grid lines (Across the Slope) */}
                    <line x1="413" y1="259" x2="433" y2="279" stroke="#E3EFF7" strokeWidth="1.5" />
                    <line x1="434" y1="248" x2="454" y2="269" stroke="#E3EFF7" strokeWidth="1.5" />
                    <line x1="456" y1="236" x2="476" y2="259" stroke="#E3EFF7" strokeWidth="1.5" />
                    <line x1="477" y1="225" x2="497" y2="249" stroke="#E3EFF7" strokeWidth="1.5" />

                    {/* Glossy Diagonal Reflection Sweep */}
                    <polygon points="410,275 490,221 498,231 418,285" fill="rgba(255, 255, 255, 0.15)" />
                  </g>

                  {/* Staged Group 5: First-Floor Balcony Platform & Upward Railings */}
                  <g className="vector-fade-in" style={{ transitionDelay: '1.0s' }}>
                    {/* Balcony Railing Top Handrail (above platform) */}
                    <rect x="330" y="358" width="200" height="8" rx="2" fill="#FCFAF0" stroke="#383D36" strokeWidth="3" />
                    {/* Railing Bottom Rail */}
                    <rect x="335" y="386" width="190" height="6" fill="#C5C7BF" stroke="#383D36" strokeWidth="2.5" />
                    
                    {/* Spindles rising vertically between rails */}
                    <line x1="345" y1="364" x2="345" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="365" y1="364" x2="365" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="385" y1="364" x2="385" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="405" y1="364" x2="405" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="425" y1="364" x2="425" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="445" y1="364" x2="445" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="465" y1="364" x2="465" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="485" y1="364" x2="485" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="505" y1="364" x2="505" y2="388" stroke="#383D36" strokeWidth="2.5" />
                    <line x1="525" y1="364" x2="525" y2="388" stroke="#383D36" strokeWidth="2.5" />

                    {/* Balcony Platform base slab */}
                    <rect x="330" y="390" width="200" height="14" fill="#FCFAF0" stroke="#383D36" strokeWidth="3" />
                    {/* Platform slab shadow */}
                    <rect x="330" y="404" width="200" height="6" fill="#C5C7BF" stroke="#383D36" strokeWidth="2.5" />
                  </g>

                  {/* Staged Group 6: Double-Pane 2x2 Cartoon Windows (6 total) */}
                  <g className="vector-fade-in" style={{ transitionDelay: '1.2s' }}>
                    {/* UPPER LEFT FLOOR WINDOWS (2) */}
                    {/* Window 1 */}
                    <rect x="385" y="305" width="40" height="50" fill="#FFFFFF" stroke="#3C352D" strokeWidth="3" />
                    <line x1="405" y1="305" x2="405" y2="355" stroke="#3C352D" strokeWidth="2.5" />
                    <line x1="385" y1="330" x2="425" y2="330" stroke="#3C352D" strokeWidth="2.5" />

                    {/* Window 2 */}
                    <rect x="455" y="305" width="40" height="50" fill="#FFFFFF" stroke="#3C352D" strokeWidth="3" />
                    <line x1="475" y1="305" x2="475" y2="355" stroke="#3C352D" strokeWidth="2.5" />
                    <line x1="455" y1="330" x2="495" y2="330" stroke="#3C352D" strokeWidth="2.5" />

                    {/* UPPER RIGHT FLOOR WINDOWS (2) */}
                    {/* Window 3 */}
                    <rect x="560" y="290" width="40" height="50" fill="#FFFFFF" stroke="#3C352D" strokeWidth="3" />
                    <line x1="580" y1="290" x2="580" y2="340" stroke="#3C352D" strokeWidth="2.5" />
                    <line x1="560" y1="315" x2="600" y2="315" stroke="#3C352D" strokeWidth="2.5" />

                    {/* Window 4 */}
                    <rect x="635" y="290" width="40" height="50" fill="#FFFFFF" stroke="#3C352D" strokeWidth="3" />
                    <line x1="655" y1="290" x2="655" y2="340" stroke="#3C352D" strokeWidth="2.5" />
                    <line x1="635" y1="315" x2="675" y2="315" stroke="#3C352D" strokeWidth="2.5" />

                    {/* LOWER LEFT FLOOR WINDOWS (2) */}
                    {/* Window 5 */}
                    <rect x="385" y="425" width="40" height="50" fill="#FFFFFF" stroke="#3C352D" strokeWidth="3" />
                    <line x1="405" y1="425" x2="405" y2="475" stroke="#3C352D" strokeWidth="2.5" />
                    <line x1="385" y1="450" x2="425" y2="450" stroke="#3C352D" strokeWidth="2.5" />

                    {/* Window 6 */}
                    <rect x="455" y="425" width="40" height="50" fill="#FFFFFF" stroke="#3C352D" strokeWidth="3" />
                    <line x1="475" y1="425" x2="475" y2="475" stroke="#3C352D" strokeWidth="2.5" />
                    <line x1="455" y1="450" x2="495" y2="450" stroke="#3C352D" strokeWidth="2.5" />
                  </g>

                  {/* Staged Group 7: Left Background Medium Turbine Tower */}
                  <g className="vector-fade-in" style={{ transitionDelay: '1.4s' }}>
                    {/* Tapered Tower */}
                    <polygon points="158,490 172,490 167,260 163,260" fill="#FCFAF0" stroke="#383D36" strokeWidth="2.5" />
                    {/* Tapered inner highlight */}
                    <line x1="165" y1="490" x2="165" y2="260" stroke="#BAC0BA" strokeWidth="1" />
                    {/* Foundation block */}
                    <rect x="153" y="482" width="24" height="10" rx="2" fill="#BAC0BA" stroke="#383D36" strokeWidth="1.5" />
                    {/* Nacelle Capsule */}
                    <rect x="157" y="248" width="16" height="12" rx="4" fill="#FCFAF0" stroke="#383D36" strokeWidth="2" />
                  </g>

                  {/* Staged Group 8: Middle Background Very Tall Turbine Tower */}
                  <g className="vector-fade-in" style={{ transitionDelay: '1.6s' }}>
                    {/* Tapered Tower */}
                    <polygon points="250,490 270,490 262,160 258,160" fill="#FCFAF0" stroke="#383D36" strokeWidth="3.5" />
                    {/* Tapered inner highlight */}
                    <line x1="260" y1="490" x2="260" y2="160" stroke="#BAC0BA" strokeWidth="1.5" />
                    {/* Foundation block */}
                    <rect x="244" y="475" width="32" height="16" rx="3" fill="#BAC0BA" stroke="#383D36" strokeWidth="2" />
                    {/* Nacelle Capsule */}
                    <rect x="251" y="148" width="18" height="14" rx="5" fill="#FCFAF0" stroke="#383D36" strokeWidth="2.5" />
                  </g>

                  {/* Staged Group 9: Foreground Balcony/Front Turbine Tower */}
                  <g className="vector-fade-in" style={{ transitionDelay: '1.8s' }}>
                    {/* Tapered Tower */}
                    <polygon points="308,490 322,490 317,320 313,320" fill="#FCFAF0" stroke="#383D36" strokeWidth="2" />
                    {/* Foundation block */}
                    <rect x="304" y="484" width="20" height="8" rx="1.5" fill="#BAC0BA" stroke="#383D36" strokeWidth="1.2" />
                    {/* Nacelle Capsule */}
                    <rect x="309" y="310" width="12" height="10" rx="3" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.5" />
                  </g>

                  {/* Staged Group 10: Wind Turbine Blades & Clouds */}
                  <g className="vector-fade-in" style={{ transitionDelay: '2.0s' }}>
                    
                    {/* Leftmost Turbine Blades (Spinning, Aerodynamic curves) */}
                    <g className="spin-turbine-back-left" style={{ transformOrigin: '165px 254px' }}>
                      {/* Blade 1 (Up) */}
                      <path d="M 165,254 Q 163,205 165,175 Q 167,205 165,254" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.2" />
                      {/* Blade 2 (Down-Right) */}
                      <path d="M 165,254 Q 207,278 233,293 Q 199,285 165,254" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.2" />
                      {/* Blade 3 (Down-Left) */}
                      <path d="M 165,254 Q 123,278 97,293 Q 131,285 165,254" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.2" />
                      {/* Center Hub Cap */}
                      <circle cx="165" cy="254" r="5.5" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.5" />
                    </g>

                    {/* Middle Tall Turbine Blades (Spinning, Aerodynamic curves) */}
                    <g className="spin-turbine-back-mid" style={{ transformOrigin: '260px 155px' }}>
                      {/* Blade 1 (Up) */}
                      <path d="M 260,155 Q 257,90 260,50 Q 263,90 260,155" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.5" />
                      {/* Blade 2 (Down-Right) */}
                      <path d="M 260,155 Q 316,187 351,208 Q 306,197 260,155" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.5" />
                      {/* Blade 3 (Down-Left) */}
                      <path d="M 260,155 Q 204,187 169,208 Q 214,197 260,155" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.5" />
                      {/* Center Hub Cap */}
                      <circle cx="260" cy="155" r="7.5" fill="#FCFAF0" stroke="#383D36" strokeWidth="2" />
                    </g>

                    {/* Small Front Turbine Blades (Spinning, Aerodynamic curves) */}
                    <g className="spin-turbine-front" style={{ transformOrigin: '315px 315px' }}>
                      {/* Blade 1 (Up) */}
                      <path d="M 315,315 Q 313,265 315,235 Q 317,265 315,315" fill="#FCFAF0" stroke="#383D36" strokeWidth="1" />
                      {/* Blade 2 (Down-Right) */}
                      <path d="M 315,315 Q 357,339 383,354 Q 349,346 315,315" fill="#FCFAF0" stroke="#383D36" strokeWidth="1" />
                      {/* Blade 3 (Down-Left) */}
                      <path d="M 315,315 Q 273,339 247,354 Q 281,346 315,315" fill="#FCFAF0" stroke="#383D36" strokeWidth="1" />
                      {/* Center Hub Cap */}
                      <circle cx="315" cy="315" r="4.5" fill="#FCFAF0" stroke="#383D36" strokeWidth="1.2" />
                    </g>

                    {/* Clouds (Exactly Placed Vector Style) */}
                    {/* Cloud 1 (Left Low, overlapping leftmost tower) */}
                    <g className="float-cloud-slow">
                      <path d="M 120,380 A 15,15 0 0 1 140,365 A 25,25 0 0 1 180,365 A 15,15 0 0 1 200,380 Z" fill="#FFFFFF" opacity="0.95" />
                      <ellipse cx="160" cy="385" rx="35" ry="12" fill="#FFFFFF" opacity="0.95" />
                    </g>
                    {/* Cloud 2 (Left High, behind blades) */}
                    <g className="float-cloud-fast">
                      <path d="M 280,240 A 12,12 0 0 1 295,230 A 18,18 0 0 1 325,230 A 12,12 0 0 1 340,240 Z" fill="#FFFFFF" opacity="0.95" />
                      <ellipse cx="310" cy="244" rx="28" ry="8" fill="#FFFFFF" opacity="0.95" />
                    </g>
                    {/* Cloud 3 (Middle Roof cloud) */}
                    <g className="float-cloud-slow">
                      <path d="M 530,285 A 15,15 0 0 1 545,270 A 24,24 0 0 1 585,270 A 15,15 0 0 1 600,285 Z" fill="#FFFFFF" opacity="0.95" />
                      <ellipse cx="565" cy="290" rx="33" ry="10" fill="#FFFFFF" opacity="0.95" />
                    </g>
                    {/* Cloud 4 (Right side low cloud) */}
                    <g className="float-cloud-fast">
                      <path d="M 720,340 A 12,12 0 0 1 732,330 A 20,20 0 0 1 762,330 A 12,12 0 0 1 775,340 Z" fill="#FFFFFF" opacity="0.95" />
                      <ellipse cx="748" cy="344" rx="26" ry="8" fill="#FFFFFF" opacity="0.95" />
                    </g>
                    {/* Cloud 5 (Top center sky cloud) */}
                    <g className="float-cloud-slow">
                      <path d="M 360,140 A 10,10 0 0 1 372,130 A 16,16 0 0 1 398,130 A 10,10 0 0 1 410,140 Z" fill="#FFFFFF" opacity="0.9" />
                      <ellipse cx="385" cy="143" rx="22" ry="6" fill="#FFFFFF" opacity="0.9" />
                    </g>

                  </g>

                </svg>
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