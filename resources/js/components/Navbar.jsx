import { Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const SOLARKON_LOGO = "/brand-logos/android-chrome-192x192.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-1/2 -translate-x-1/2 mt-3 w-[95%] max-w-7xl z-50 rounded-[2rem] px-6 md:px-8 py-3 flex justify-between items-center transition-all duration-500
        ${
          scrolled
            ? // Over white sections: darken heavily so text stays readable
              "bg-black/40 backdrop-blur-xl backdrop-saturate-200 border border-white/20 shadow-2xl shadow-black/20"
            : // Hero is blue (#4D9DE0) — a medium-opacity dark glass reads perfectly
              "bg-black/25 backdrop-blur-md backdrop-saturate-150 border border-white/15 shadow-lg shadow-black/10"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={SOLARKON_LOGO}
            alt="Solarkon"
            className="h-10 w-10 object-contain transition-opacity duration-300 group-hover:opacity-90"
            width={40}
            height={40}
          />
          <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Solarkon
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {["Home", "About", "Solutions", "Projects", "Store", "Contact"].map((item) => (
            <li key={item}>
              <Link
                href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                className="text-white/90 font-medium hover:text-[#D4F64D] transition-colors duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* Spinning energy border button */}
          <div className="relative hidden sm:inline-flex group items-center justify-center rounded-full p-[2px] overflow-hidden shadow-[0_0_20px_rgba(212,246,77,0.25)] transition-shadow hover:shadow-[0_0_30px_rgba(212,246,77,0.45)]">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#10B981_30%,#D4F64D_50%,transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <Link
              href="/contact"
              className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-[#08100B] px-6 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-black/90 z-10"
            >
              Let's Talk Energy
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all z-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#08100B]/60 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-24 left-1/2 -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-2xl backdrop-saturate-200 border border-white/20 shadow-2xl shadow-black/50 rounded-[2.5rem] p-8 transition-all duration-500 transform ${
            isOpen ? "translate-y-0 scale-100" : "-translate-y-8 scale-95"
          }`}
        >
          <ul className="flex flex-col gap-6 text-center">
            {["Home", "About", "Solutions", "Projects", "Store", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-white text-xl font-bold hover:text-[#D4F64D] transition-colors drop-shadow-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
            <li className="pt-6 mt-2 border-t border-white/10">
              <div className="relative inline-flex w-full group items-center justify-center rounded-full p-[2px] overflow-hidden shadow-[0_0_20px_rgba(212,246,77,0.25)]">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#10B981_30%,#D4F64D_50%,transparent_70%)]" />
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="relative inline-flex w-full justify-center items-center bg-[#08100B] text-white px-8 py-4 rounded-full text-lg font-bold z-10"
                >
                  Let's Talk Energy
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}