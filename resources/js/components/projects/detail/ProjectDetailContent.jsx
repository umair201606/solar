import { CheckCircle, Star } from "lucide-react";

export default function ProjectDetailContent({ project }) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-dark-bg mb-4">Project Overview</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{project.overview}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark-bg mb-4">Project Objectives</h2>
            <p className="text-gray-600 text-sm mb-4">{project.objectives}</p>
            <ul className="space-y-3">
              {project.objectivesList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-dark-bg shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark-bg mb-4">What We Delivered</h2>
            <p className="text-gray-600 text-sm mb-6">
              End-to-end solar solutions tailored to project requirements and long-term performance.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.delivered.map((item) => (
                <div
                  key={item.title}
                  className="bg-primary/20 border border-primary/30 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-dark-bg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark-bg mb-4">Our Impact</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{project.impact}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-dark-bg mb-6">Client Testimonial</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={project.testimonial.img}
                alt={project.testimonial.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
              <div className="bg-light-bg rounded-2xl p-6 flex-1 relative">
                <p className="text-dark-bg font-medium italic mb-4">
                  "{project.testimonial.quote}"
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-dark-bg">{project.testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{project.testimonial.role}</p>
                  </div>
                  <div className="flex gap-0.5 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-light-bg rounded-3xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-dark-bg mb-4">Key Results & Benefits</h3>
            <ul className="space-y-4 mb-6">
              {project.results.map((result) => (
                <li key={result} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  {result}
                </li>
              ))}
            </ul>
            <img
              src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400"
              alt="Solar installation"
              className="w-full h-40 object-cover rounded-2xl"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
