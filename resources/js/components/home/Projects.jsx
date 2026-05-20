import { Link } from "@inertiajs/react";
import { Zap } from "lucide-react";
import { projects } from "../../data/projectsData";
import ProjectCard from "../projects/ProjectCard";

export default function Projects() {
  return (
    <>
      

      {/* Dark Projects Grid Section */}
      <section className="relative py-24 text-white overflow-hidden bg-dark-bg">
        <div className="max-w-[85rem] mx-auto px-6 relative z-10">
          
          {/* Header Block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
            <div className="max-w-3xl">
              <span className="border border-[#D4F64D] rounded-full px-5 py-1.5 text-sm text-[#D4F64D] font-bold tracking-wide inline-flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#D4F64D] animate-pulse"></span>
                Our Projects
              </span>
              <h2 className="text-4xl md:text-[3.5rem] font-extrabold mb-6 leading-[1.1] tracking-tight text-white">
                Energizing Communities <br className="hidden md:block" />
                Through Innovation
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-light">
                Solarkon has successfully executed 700+ solar installations across
                Pakistan—from Bashir Sons Steel (5 MWp) to Gourmet Bakeries, Lahore
                Grammar School, and more across diverse sectors.
              </p>
            </div>
            
            <Link
              href="/projects"
              className="bg-[#D4F64D] text-[#08100B] px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300 shrink-0 mb-2 shadow-lg shadow-[#D4F64D]/20"
            >
              View All Projects <Zap className="w-4 h-4 fill-current" />
            </Link>
          </div>

          {/* Cards Grid - Increased gap-y to properly space out the floating overlapping pills */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
            {projects.slice(0, 4).map((project, idx) => (
              <ProjectCard key={project.slug} {...project} variant="dark" delay={idx * 150} />
            ))}
          </div>
          
        </div>
      </section>
    </>
  );
}