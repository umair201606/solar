import { useState } from "react";
import { CheckCircle, Star, X } from "lucide-react";

export default function ProjectDetailContent({ project }) {
  const [lightbox, setLightbox] = useState(null);
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
                  className="backdrop-blur-xl bg-[#041a12]/5 border border-[#041a12]/10 rounded-2xl p-6 shadow-sm"
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

          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-dark-bg mb-6">Project Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
                    onClick={() => setLightbox(img)}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - Image ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox */}
          {lightbox && (
            <div
              className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setLightbox(null)}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightbox}
                alt="Gallery image"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-dark-bg mb-6">Client Testimonial</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={project.testimonial.img}
                alt={project.testimonial.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
              <div className="backdrop-blur-xl bg-[#041a12]/5 border border-[#041a12]/10 rounded-2xl p-6 flex-1 relative shadow-sm">
                <p className="text-dark-bg font-medium italic mb-4">
                  "{project.testimonial.quote}"
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-dark-bg">{project.testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{project.testimonial.role}</p>
                  </div>
                  <div className="flex gap-0.5 text-[#D4F64D]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4F64D]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="backdrop-blur-xl bg-[#041a12]/5 border border-[#041a12]/10 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-dark-bg mb-4">Key Results & Benefits</h3>
            <ul className="space-y-4 mb-6">
              {project.results.map((result) => (
                <li key={result} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#D4F64D] shrink-0" />
                  {result}
                </li>
              ))}
            </ul>
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-40 object-cover rounded-2xl"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
