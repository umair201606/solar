import { Link } from "@inertiajs/react";
import { Zap } from "lucide-react";
import { getOtherProjects } from "../../data/projectsData";
import ProjectCard from "./ProjectCard";

export default function OtherProjects({ currentSlug }) {
  const others = getOtherProjects(currentSlug);

  return (
    <section className="py-20 bg-dark-bg text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509391366360-515432d667c4?q=80&w=2070')] bg-cover bg-center opacity-10 pointer-events-none"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="border border-primary rounded-full px-4 py-1 text-sm text-primary">
              Other Projects
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4 leading-tight max-w-2xl">
              Energizing Communities Through Innovation
            </h2>
            <p className="max-w-xl text-sm text-gray-400">
              Explore more clean energy work across pharmaceuticals, steel, food,
              education, and agricultural sectors throughout Pakistan.
            </p>
          </div>
          <Link
            href="/projects"
            className="bg-primary text-dark-bg px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-primary-hover transition shrink-0"
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
