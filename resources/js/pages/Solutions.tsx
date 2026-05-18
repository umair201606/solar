import PageHero from "../components/shared/PageHero";
import { CheckCircle, Zap, ShieldCheck, PieChart, Landmark } from "lucide-react";
import { financingOptions, solutionCategories } from "../data/solutionsData";
import CTA from "../components/home/CTA";

const icons = [Zap, ShieldCheck, PieChart];

export default function Solutions() {
  return (
    <>
      <PageHero
        title="Energy Solutions"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Solutions" }]}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-dark-bg">
            Flexible Financing &amp; Energy Options
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            As the best solar energy company in Pakistan, we are dedicated to giving
            customers high-quality goods and services that meet or surpass their
            expectations.
          </p>
        </div>

        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {solutionCategories.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-gray-100 bg-light-bg p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Icon className="h-6 w-6 text-dark-bg" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-dark-bg">{item.title}</h3>
                <p className="mb-6 text-sm text-gray-600">{item.desc}</p>
                <ul className="space-y-3">
                  {item.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600"
                    >
                      <CheckCircle className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="rounded-[3rem] bg-dark-card p-12 text-white">
          <div className="mb-8 flex items-center gap-3">
            <Landmark className="h-8 w-8 text-primary" />
            <h3 className="text-3xl font-bold">Flexible Financing Solutions</h3>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {financingOptions.map((opt) => (
              <div key={opt.title} className="space-y-4">
                <h4 className="text-lg font-bold text-primary">{opt.title}</h4>
                <ul className="space-y-2">
                  {opt.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
