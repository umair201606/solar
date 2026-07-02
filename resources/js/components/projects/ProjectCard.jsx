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

  const cardStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0) scale(1)" : "translateX(-60px) scale(0.97)",
    transition: `opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };

  const tagOverlayStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0, 0)" : "translate(-30px, 30px)",
    transition: `opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 200}ms`,
  };

  return (
    <article ref={cardRef} style={cardStyle} className="group flex w-full flex-col">
      <div
        className={`relative h-[280px] w-full overflow-hidden rounded-[1.75rem] border-[3px] shadow-xl sm:h-[340px] ${
          isDark ? "border-[#D4F64D]" : "border-[#08100B]"
        }`}
      >
        <Link href={`/projects/${slug}`} className="block h-full w-full">
          <img
            src={img}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        <div
          style={tagOverlayStyle}
          className={`absolute bottom-0 left-0 z-20 flex items-center gap-5 rounded-tr-[1.5rem] px-5 py-3 ${
            isDark ? "bg-[#D4F64D] text-[#08100B]" : "bg-[#08100B] text-white"
          }`}
        >
          {tags.map((tag, idx) => {
            const Icon = tag.icon;
            return (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold sm:text-sm">
                {Icon && (
                  <Icon
                    className={`h-4 w-4 shrink-0 stroke-[2.5] ${
                      isDark ? "text-[#08100B]" : "text-[#D4F64D]"
                    }`}
                  />
                )}
                <span className={isDark ? "font-bold text-[#08100B]" : "text-white/90"}>{tag.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col px-1 pt-7">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link href={`/projects/${slug}`}>
            <h3
              className={`text-2xl font-extrabold leading-tight tracking-tight transition-colors duration-300 sm:text-[1.75rem] ${
                isDark ? "text-white hover:text-[#D4F64D]" : "text-[#08100B] hover:text-[#1a6e3a]"
              }`}
            >
              {title}
            </h3>
          </Link>
          <span className={`text-sm font-light ${isDark ? "text-[#D4F64D]/60" : "text-gray-400"}`}>|</span>
          <span className={`text-sm font-medium ${isDark ? "text-[#D4F64D]" : "text-gray-500"}`}>
            Location: {loc}
          </span>
        </div>

        <p className={`mb-6 max-w-[95%] text-[15px] leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {desc}
        </p>

        <Link
          href={`/projects/${slug}`}
          className={`inline-flex w-fit items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
            isDark
              ? "bg-[#D4F64D] text-[#08100B] shadow-lg shadow-[#D4F64D]/20 hover:bg-[#E6FF7A]"
              : "bg-[#08100B] text-[#D4F64D] shadow-md hover:bg-[#0f2010]"
          }`}
        >
          More Detail
          <Zap className={`h-4 w-4 stroke-none transition-transform ${isDark ? "fill-[#08100B]" : "fill-[#D4F64D]"}`} />
        </Link>
      </div>
    </article>
  );
}
