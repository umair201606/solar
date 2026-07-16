import { MapPin } from "lucide-react";
import { ongoingProjects } from "../../data/companyData";
import useScrollAnimation from "../../lib/useScrollAnimation";
import AnimatedCounter from "../ui/AnimatedCounter";

export default function CaseStudies() {
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20 overflow-hidden">
      <div ref={sectionRef} className="mb-10 sm:mb-12 text-center overflow-hidden">
        <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
          Ongoing Projects
        </span>
        <h2
          className={`mt-6 mb-4 text-4xl font-bold text-dark-bg ${isVisible ? "slide-from-left" : "slide-from-left-init"}`}
        >
          Currently Powering Pakistan
        </h2>
        <p
          className={`mx-auto max-w-2xl text-gray-600 ${isVisible ? "animate-fade-in-up-delay-1" : "animate-fade-in-up-init"}`}
        >
          A snapshot of the projects our teams are building across the country
          right now.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ongoingProjects.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-dark-bg px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Ongoing
              </span>
              <span className="inline-flex items-baseline gap-1 rounded-lg bg-primary px-2.5 py-1 text-dark-bg">
                <span className="text-lg font-black">{p.capacity}</span>
                <span className="text-xs font-bold text-dark-bg/70">{p.unit}</span>
              </span>
            </div>
            <h3 className="mb-1.5 text-lg font-bold text-dark-bg">{p.name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-gray-400" /> {p.loc}
            </p>
          </div>
        ))}

        {/* Pipeline note */}
        <div className="flex flex-col justify-center rounded-2xl bg-primary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
          <AnimatedCounter value="100+ MWp" enabled={isVisible} as="span" className="text-lg font-black text-dark-bg" />
          <p className="mt-1 text-sm text-dark-bg/70">
            More in the pipeline across multiple sectors.
          </p>
        </div>
      </div>
    </section>
  );
}
