import { projects } from "../../data/projectsData";
import ProjectCard from "./ProjectCard";

export default function ProjectsList() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* ── Header ── */}
        <div className="mb-14">
          <span className="inline-block border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-500 font-medium mb-6">
            Our Projects
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#08100B] leading-tight max-w-2xl mb-5 tracking-tight slide-from-left">
            Energizing Communities Through Innovation
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-gray-500 animate-fade-in-up-delay-1">
            <strong className="font-bold text-[#08100B]">Solarkon</strong> has
            successfully executed 700+ solar installations across Pakistan. Our
            portfolio includes rooftop systems, ground-mounted plants, and hybrid
            solar-diesel integrations—with projects in pipeline over 100 MWp.
          </p>
        </div>

        {/* ── 2-column project grid ── */}
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-16">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}