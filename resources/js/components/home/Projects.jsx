import React, { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { Link } from "@inertiajs/react";
import { projects } from "../../data/projectsData";

export default function Projects() {
  const [visible, setVisible] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden text-white rounded-[3rem] mx-4 sm:mx-6 my-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/background.webp" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#041a12]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div ref={headingRef} className="max-w-3xl overflow-hidden">
            <div className="border border-[#d4ff00]/50 rounded-full px-5 py-1.5 w-max mb-6 backdrop-blur-sm bg-white/5">
              <span className="text-[#d4ff00] text-sm font-bold tracking-wide">Our Projects</span>
            </div>
            <h2
              className={`text-4xl md:text-[3.5rem] font-black mb-6 leading-[1.05] tracking-tight text-white ${
                visible ? "slide-from-left" : "slide-from-left-init"
              }`}
            >
              Energizing Communities <br className="hidden md:block" /> Through Innovation
            </h2>
          </div>
          <div>
            <Link href="/projects" className="bg-[#d4ff00] text-[#041a12] px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-white transition-colors shrink-0 shadow-lg">
              More Projects <Zap className="w-5 h-5 fill-current" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.slice(0, 4).map((project, idx) => (
            <article key={idx} className="flex flex-col w-full h-full group">
              
              <div className="relative w-full rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-xl flex flex-col flex-1 mb-6 shadow-2xl overflow-hidden">
                
                {/* IMAGE WITH FOLDER TAB OVERLAY */}
                <div className="relative w-full h-[320px] rounded-[1.75rem] overflow-hidden bg-gray-900 flex-shrink-0 m-1.5">
                  <img src={project.img} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* LIME FOLDER TAB */}
                  <div className="absolute bottom-0 left-0 bg-[#d4ff00] text-[#041a12] rounded-tr-[1.5rem] pl-5 pr-6 py-3 z-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold shadow-md">
                    
                    {project.tags.map((tag, i) => {
                      const Icon = tag.icon;
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          {Icon && <Icon className="w-[18px] h-[18px] stroke-[2.5]" />}
                          <span>{tag.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[1.7rem] font-black mb-3 text-white group-hover:text-[#d4ff00] transition-colors tracking-tight">
                    {project.title} <span className="text-gray-400 font-light mx-2 text-xl">|</span> <span className="text-[#d4ff00] text-sm font-medium tracking-wide">Location: {project.loc}</span>
                  </h3>
                  <p className="text-gray-300 text-[15px] font-light leading-relaxed mb-6 flex-1">
                    {project.desc}
                  </p>
                  <Link href={`/projects/${project.slug}`} className="bg-[#d4ff00] text-[#041a12] px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 w-max hover:bg-white transition-colors mt-auto">
                    More Detail <Zap className="w-4 h-4 fill-current" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
