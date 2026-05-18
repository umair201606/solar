import { Calendar } from "lucide-react";

export default function ProjectDetailHeader({ project }) {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-16 relative z-20 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-dark-bg mb-6">
        {project.detailTitle}
        <span className="text-base font-normal text-gray-500 border-l border-gray-300 pl-3 ml-3">
          | Location: {project.loc}
        </span>
      </h1>

      <div className="relative border-4 border-dark-card rounded-[2rem] overflow-hidden">
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-[400px] md:h-[480px] object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-dark-card text-white px-6 py-4 rounded-tr-3xl flex flex-wrap gap-5 text-sm font-medium border-t-4 border-r-4 border-white">
          {project.tags.map((tag) => (
            <div key={tag.text} className="flex items-center gap-2">
              <span className="text-primary">
                <tag.icon className="w-4 h-4" />
              </span>
              <span>{tag.text}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 border-l border-gray-600 pl-5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Completion: {project.completionDate}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
