import { Award } from "lucide-react";
import { whyChooseSolarkon } from "../../data/companyData";
import FeatureItem from "./FeatureItem";
import PartnerLogos from "./PartnerLogos";

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800"
            alt="Solarkon solar installation team"
            className="h-[500px] w-full rounded-3xl object-cover"
          />
          <div className="absolute top-8 -left-8 w-40 rounded-2xl border border-gray-800 bg-dark-bg p-6 text-primary shadow-xl">
            <Award className="mx-auto mb-3 h-10 w-10" />
            <p className="text-center text-sm font-bold leading-tight">
              Pakistan&apos;s
              <br />
              Leading
              <br />
              Solar Provider
            </p>
          </div>
        </div>
        <div>
          <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
            Why Choose Solarkon
          </span>
          <h2 className="mt-6 mb-6 text-4xl font-bold text-dark-bg">
            Industry Leader with a Proven National Footprint
          </h2>
          <p className="mb-8 text-gray-600">
            <strong className="text-dark-bg">Solarkon</strong> combines certified
            engineering, best-in-class technology, flexible financing, and dedicated
            after-sales support to deliver clean energy across Pakistan.
          </p>

          <div className="space-y-4">
            {whyChooseSolarkon.slice(0, 3).map((item) => (
              <FeatureItem key={item.num} {...item} />
            ))}
          </div>
        </div>
      </div>

      <PartnerLogos />
    </section>
  );
}
