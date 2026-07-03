import { caseStudies } from "../../data/companyData";
import CaseStudyCard from "./CaseStudyCard";
import useScrollAnimation from '../../lib/useScrollAnimation';

export default function CaseStudies() {
  const [sectionRef, isVisible] = useScrollAnimation();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 overflow-hidden">
      <div ref={sectionRef} className="mb-12 text-center overflow-hidden">
        <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
          Ongoing & Completed
        </span>
        <h2
          className={`mt-6 mb-4 text-4xl font-bold text-dark-bg ${isVisible ? 'slide-from-left' : 'slide-from-left-init'}`}
        >
          Ongoing Projects Across Pakistan
        </h2>
        <p
          className={`mx-auto max-w-2xl text-gray-600 ${isVisible ? 'animate-fade-in-up-delay-1' : 'animate-fade-in-up-init'}`}
        >
          From megawatt-scale expansions to new installations, we're actively
          powering Pakistan's industrial growth with solar energy.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {caseStudies.map((study) => (
          <CaseStudyCard key={`${study.title}-${study.subtitle}`} {...study} />
        ))}
      </div>
    </section>
  );
}
