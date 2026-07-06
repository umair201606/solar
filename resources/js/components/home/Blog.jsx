import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import BlogCard from "./BlogCard";
import Reveal from "../shared/Reveal";
import useScrollAnimation from '../../lib/useScrollAnimation';

const posts = [
  {
    title: "Off-Grid vs Hybrid vs On-Grid: Which System Is Right for You?",
    img: "/images/vibrant_images/inverter1.webp",
    category: "Solar Guide",
    date: "May 20, 2026",
    readTime: "5 min read",
  },
  {
    title: "Flexible Financing Options for Solar in Pakistan",
    img: "/images/vibrant_images/solarkon.webp",
    category: "Finance Tips",
    date: "May 18, 2026",
    readTime: "4 min read",
  },
  {
    title: "700+ Installations: Sectors We Serve Across Pakistan",
    img: "/images/vibrant_images/team2.webp",
    category: "Sectors Served",
    date: "May 15, 2026",
    readTime: "6 min read",
  },
];

export default function Blog() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const pillRef = useRef(null);
  const [pillRadius, setPillRadius] = useState(16);

  useEffect(() => {
    if (!pillRef.current) return;
    const el = pillRef.current;
    const update = () => setPillRadius(el.offsetHeight / 2);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 overflow-hidden">
      <div ref={sectionRef} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 overflow-hidden">
        <div className="overflow-hidden">
          <div ref={pillRef} className="relative w-max mb-2 inline-block">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
              aria-hidden="true"
            >
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={pillRadius}
                ry={pillRadius}
                fill="none"
                stroke="#1f2937"
                strokeWidth="1"
                pathLength="1"
                className={isVisible ? 'draw-border-rect' : 'draw-border-rect-init'}
              />
            </svg>
            <span className="relative block px-5 py-1.5 text-gray-800 text-sm font-medium tracking-wide uppercase">
              Solarkon Blog
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-extrabold mt-6 mb-4 text-dark-bg tracking-tight leading-tight ${isVisible ? 'slide-from-left' : 'slide-from-left-init'}`}
          >
            Green Insights, Real Impact
          </h2>
          <p
            className={`text-gray-600 max-w-xl font-light text-base md:text-lg ${isVisible ? 'animate-fade-in-up-delay-1' : 'animate-fade-in-up-init'}`}
          >
            Explore how <strong className="text-dark-bg">Solarkon</strong>{" "}
            transforms industries, communities, and the planet. One story at a
            time.
          </p>
        </div>
       
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <Reveal key={post.title} animation="fade-up" delay={`${idx * 150}ms`}>
            <BlogCard {...post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
