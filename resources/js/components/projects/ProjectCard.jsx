import { Link } from "@inertiajs/react";
import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * ProjectCard
 *
 * variant="light" — white section (Projects page list)
 * variant="dark"  — dark green section (Home page)
 */
export default function ProjectCard({
  slug,
  img,
  title,
  loc,
  desc,
  tags,
  variant = "light",
}) {
  const isDark = variant === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const currentEl = cardRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }
    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  // Premium hardware-accelerated Bezier entrance animation from left
  const cardStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0) scale(1)" : "translateX(-60px) scale(0.97)",
    transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  // Curved Tag overlay (greenish curve box): slides in from bottom-left with staggered parallax delay
  const tagOverlayStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0, 0)" : "translate(-30px, 30px)",
    transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
  };

  return (
    <article
      ref={cardRef}
      style={cardStyle}
      className="group flex flex-col w-full"
    >
      <div
        className={`relative w-full h-[280px] sm:h-[340px] rounded-[1.75rem] overflow-hidden shadow-xl border-[3px] ${
          isDark ? "border-primary" : "border-[#08100B]"
        }`}
      >
        <Link href={`/projects/${slug}`} className="block w-full h-full">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        </Link>

        {/* The greenish curved div tag overlay, animating on scroll */}
        <div
          style={tagOverlayStyle}
          className={`absolute bottom-0 left-0 rounded-tr-[1.5rem] px-5 py-3 flex items-center gap-5 z-20 ${
            isDark
              ? "bg-primary text-dark-bg"
              : "bg-[#08100B] text-white"
          }`}
        >
          {tags.map((tag, idx) => {
            const Icon = tag.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap"
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 stroke-[2.5] flex-shrink-0 ${
                      isDark ? "text-dark-bg" : "text-[#D4F64D]"
                    }`}
                  />
                )}
                <span className={isDark ? "text-dark-bg font-bold" : "text-white/90"}>
                  {tag.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-7 px-1 flex flex-col">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
          <Link href={`/projects/${slug}`}>
            <h3
              className={`text-2xl sm:text-[1.75rem] font-extrabold tracking-tight leading-tight transition-colors duration-300 ${
                isDark
                  ? "text-white hover:text-primary"
                  : "text-[#08100B] hover:text-[#1a6e3a]"
              }`}
            >
              {title}
            </h3>
          </Link>
          <span
            className={`text-sm font-light ${isDark ? "text-primary/60" : "text-gray-400"}`}
          >
            |
          </span>
          <span
            className={`text-sm font-medium ${
              isDark ? "text-primary" : "text-gray-500"
            }`}
          >
            Location: {loc}
          </span>
        </div>

        <p
          className={`text-[15px] leading-relaxed mb-6 max-w-[95%] ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {desc}
        </p>

        <Link
          href={`/projects/${slug}`}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 w-fit hover:-translate-y-0.5 group/btn ${
            isDark
              ? "bg-primary text-dark-bg shadow-lg shadow-primary/20 hover:bg-primary-hover"
              : "bg-[#08100B] text-[#D4F64D] shadow-md hover:shadow-lg hover:bg-[#0f2010]"
          }`}
        >
          More Detail
          <Zap
            className={`w-4 h-4 stroke-none group-hover/btn:scale-110 transition-transform ${
              isDark ? "fill-dark-bg" : "fill-[#D4F64D]"
            }`}
          />
        </Link>
      </div>
    </article>
  );
}
