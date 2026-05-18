import { caseStudies } from "../../data/companyData";
import CaseStudyCard from "./CaseStudyCard";

export default function CaseStudies() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
          Our Projects
        </span>
        <h2 className="mt-6 mb-4 text-4xl font-bold text-dark-bg">
          Completed Projects Across Pakistan
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Our portfolio includes rooftop systems, ground-mounted plants, and hybrid
          solar-diesel integrations—with various projects in pipeline{" "}
          <strong className="text-dark-bg">over 100 MWp</strong>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.title} {...study} />
        ))}
      </div>
    </section>
  );
}
