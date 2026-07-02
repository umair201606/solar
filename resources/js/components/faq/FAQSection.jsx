import FAQAccordion from "./FAQAccordion";
import FAQContactCard from "./FAQContactCard";

export default function FAQSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <span className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-600">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4 text-dark-bg leading-tight slide-from-left">
            Everything You Need to Know
          </h2>
          <p className="text-gray-600 text-sm mb-10 max-w-xl animate-fade-in-up-delay-1">
            From technology to timelines, find all the key answers in one simple place.
          </p>
          <FAQAccordion />
        </div>
        <FAQContactCard />
      </div>
    </section>
  );
}
