import PageHero from "../components/shared/PageHero";
import { CheckCircle, Zap, ShieldCheck, PieChart, Landmark } from "lucide-react";
import { financingOptions, solutionCategories } from "../data/solutionsData";
import Blog from "../components/home/Blog";

const icons = [Zap, ShieldCheck, PieChart];

const financePartners = [
  { name: "Askari Bank", logo: "/bank-logos/askari-bank.png" },
  { name: "Meezan Bank", logo: "/bank-logos/meezan-bank.png" },
  { name: "Faysal Bank", logo: "/bank-logos/faysal-bank-seeklogo.png" },
  { name: "Allied Bank", logo: "/bank-logos/allied-bank.png" },
  { name: "Bank of Punjab", logo: "/bank-logos/Bank-of-punjab-Logo.png" },
  { name: "Habib Metro Bank", logo: "/bank-logos/HABIBMETRO_Bank_idQddlJcJI_0.png" },
  { name: "Bank Alfalah", logo: "/bank-logos/bank-alfalah-seeklogo.png" },
];

export default function Solutions() {
  return (
    <>
      <PageHero title="Energy Solutions" />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-dark-bg slide-from-left">
              Solar Systems Engineered Around You
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 animate-fade-in-up-delay-1">
              From homes and workplaces to factories and farms, Solarkon designs, installs,
              and maintains complete solar systems tailored to your load, your site, and your
              budget. Choose the setup that fits, whether on-grid, off-grid, or hybrid, and let
              our certified engineers handle the rest.
            </p>
          </div>

          <div className="mb-20 grid gap-8 md:grid-cols-3">
            {solutionCategories.map((item, index) => {
              const Icon = icons[index];
              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-gray-100 bg-light-bg p-6 sm:p-8"
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

          <div className="rounded-[2rem] sm:rounded-[3rem] bg-dark-card p-6 sm:p-10 lg:p-12 text-white">
            <div className="mb-4 flex items-center gap-3">
              <Landmark className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-primary" />
              <h3 className="text-2xl sm:text-3xl font-bold">Flexible Financing Solutions</h3>
            </div>
            <p className="mb-8 max-w-3xl text-sm sm:text-base text-gray-300 leading-relaxed">
              Going solar shouldn&apos;t wait on budget. Pay upfront and own it outright,
              spread the cost over easy monthly installments with{" "}
              <span className="text-primary font-medium">no bank involved</span>, or let us
              structure a <span className="text-primary font-medium">bank-financed EMI</span>{" "}
              through our partner banks with transparent terms and plans available with or
              without collateral. For large setups, our Power Purchase Agreement needs zero
              upfront investment. Whatever your cash flow, there&apos;s a route to clean energy.
            </p>
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

            {/* Financing Partners */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Bank Financing In Partnership With
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {financePartners.map((p) => (
                  <div
                    key={p.name}
                    className="flex h-20 w-[calc(50%-0.375rem)] items-center justify-center rounded-2xl bg-white px-4 shadow-md transition-transform duration-300 hover:-translate-y-1 sm:w-40"
                    title={p.name}
                  >
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      loading="lazy"
                      className="max-h-11 w-auto max-w-[85%] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      <Blog />
    </>
  );
}
