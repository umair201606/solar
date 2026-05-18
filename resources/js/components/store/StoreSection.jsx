import { Link } from "@inertiajs/react";
import { useState } from "react";
import { storeCategories, storeProducts } from "../../data/storeData";
import StoreProductCard from "./StoreProductCard";

export default function StoreSection() {
  const [activeCategory, setActiveCategory] = useState("PV Solar Panels");

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="mb-10">
        <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
          Our Products
        </span>
        <h2 className="mt-6 mb-4 max-w-2xl text-4xl font-bold leading-tight text-dark-bg md:text-5xl">
          Working Methodology &amp; Product Range
        </h2>
        <p className="max-w-2xl text-sm text-gray-600">
          We offer PV solar panels, off-grid, on-grid, and hybrid inverters—high-quality
          goods and services that meet or surpass customer expectations across Pakistan.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {storeCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-dark-card text-primary"
                : "bg-light-bg text-gray-600 border border-gray-200 hover:border-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {storeProducts
          .filter((product) => product.category === activeCategory)
          .map((product, i) => (
            <StoreProductCard key={product.id} product={product} defaultOpen={i === 0} />
          ))}
      </div>

      <div className="bg-primary/15 border border-primary/25 rounded-[2rem] p-10 md:p-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold text-dark-bg mb-3">
            Global Panel Pricing Trends
          </h3>
          <p className="text-gray-600 text-sm">
            Average tier-1 module prices have stabilized with modest upward pressure
            on high-efficiency panels. Solarkon tracks wholesale movements so your
            quotes stay competitive.
          </p>
        </div>
        <div className="h-32 bg-white/60 rounded-2xl flex items-end gap-2 px-4 pb-4">
          {[40, 55, 45, 70, 60, 85, 75, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary rounded-t min-h-[8px]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 bg-dark-card rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Securing Enterprise Scale?</h3>
          <p className="text-gray-300 text-sm max-w-md">
            Volume procurement, custom logistics, and dedicated account support for
            large-scale solar deployments.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-primary text-dark-bg px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-primary-hover transition shrink-0"
        >
          Contact Procurement Desk →
        </Link>
      </div>
    </section>
  );
}
