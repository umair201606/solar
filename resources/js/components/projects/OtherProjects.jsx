import { Link } from "@inertiajs/react";
import { Zap } from "lucide-react";
import { getOtherProjects } from "../../data/projectsData";
import ProjectCard from "./ProjectCard";
import useScrollAnimation from '../../lib/useScrollAnimation';

export default function OtherProjects({ currentSlug }) {
  const others = getOtherProjects(currentSlug);
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section className="py-20 text-white relative overflow-hidden">
      {/* Background Image + Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/background.webp" alt="" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#041a12]/80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div ref={sectionRef} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 overflow-hidden">
          <div>
            <span className="border border-[#d4ff00]/50 rounded-full px-4 py-1 text-sm text-[#d4ff00] backdrop-blur-sm bg-white/5">
              Other Projects
            </span>
            <h2
              className={`text-4xl md:text-5xl font-bold mt-6 mb-4 leading-tight max-w-2xl ${isVisible ? 'slide-from-left' : 'slide-from-left-init'}`}
            >
              Energizing Communities Through Innovation
            </h2>
            <p
              className={`max-w-xl text-sm text-gray-400 ${isVisible ? 'animate-fade-in-up-delay-1' : 'animate-fade-in-up-init'}`}
            >
              Explore more clean energy work across pharmaceuticals, steel, food,
              education, and agricultural sectors throughout Pakistan.
            </p>
          </div>
          <Link
            href="/projects"
            className="bg-[#D4F64D] text-[#041a12] px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-white transition shrink-0"
          >
            More Projects <Zap className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {others.map((project) => (
            <ProjectCard key={project.slug} {...project} variant="dark" />
          ))}
        </div>
      </div>
    </section>
  );
}
