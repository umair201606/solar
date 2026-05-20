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
  delay = 0,
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
    transition: `opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };

  return (
    <article
      ref={cardRef}
      style={cardStyle}
      className="group flex flex-col w-full"
    >
      {/* 3px Neon Green Border Image Container with Integrated Tag Strip */}
      <div
        className="relative w-full rounded-[1.75rem] overflow-hidden shadow-xl border-[3px] border-[#D4F64D] bg-[#D4F64D] flex flex-col transition-transform duration-500 group-hover:scale-[1.01]"
      >
        {/* Project Image */}
        <div className="relative w-full h-[220px] sm:h-[280px] overflow-hidden">
          <Link href={`/projects/${slug}`} className="block w-full h-full">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </Link>
        </div>

        {/* Tag Strip - Merged perfectly inside the neon-green bottom section of the container */}
        <div className="bg-[#D4F64D] text-[#08100B] px-5 py-3 flex flex-wrap items-center justify-start gap-x-5 gap-y-1.5 text-xs sm:text-[13px] font-extrabold select-none border-t-[3px] border-[#D4F64D]">
          {tags.map((tag, idx) => {
            const Icon = tag.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 whitespace-nowrap text-[#08100B]"
              >
                {Icon && (
                  <Icon
                    className="w-4 h-4 stroke-[2.8] text-[#08100B] flex-shrink-0"
                  />
                )}
                <span>
                  {tag.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description & Button Block */}
      <div className="pt-5 px-1 flex flex-col">
        {/* Title & Location Line exactly as reference: Title | Location: Loc */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-2.5 font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
          <Link href={`/projects/${slug}`}>
            <span
              className={`transition-colors duration-300 ${
                isDark
                  ? "text-white hover:text-primary"
                  : "text-[#08100B] hover:text-[#1a6e3a]"
              }`}
            >
              {title}
            </span>
          </Link>
          <span
            className={`text-sm font-light ${isDark ? "text-gray-400" : "text-gray-300"}`}
          >
            |
          </span>
          <span
            className="text-[#D4F64D] text-xs sm:text-sm font-extrabold uppercase tracking-wide bg-[#D4F64D]/10 px-2 py-0.5 rounded"
          >
            Location: {loc}
          </span>
        </div>

        <p
          className={`text-[15px] leading-relaxed mb-4 font-light ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {desc}
        </p>

        {/* More Detail Lightning Pill Button */}
        <Link
          href={`/projects/${slug}`}
          className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-1 w-fit hover:scale-105 transition-all duration-300 shadow-md ${
            isDark
              ? "bg-[#D4F64D] text-[#08100B] hover:bg-white"
              : "bg-[#08100B] text-[#D4F64D] hover:bg-[#D4F64D] hover:text-[#08100B]"
          }`}
        >
          More Detail <Zap className="w-3.5 h-3.5 fill-current" />
        </Link>
      </div>
    </article>
  );
}
