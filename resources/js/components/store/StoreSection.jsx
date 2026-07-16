import { useState } from "react";
import { Link } from "@inertiajs/react";
import { X, Zap, Battery, Gauge, ArrowRight } from "lucide-react";
import { storeCategories, storeProducts } from "../../data/storeData";
import StoreProductCard from "./StoreProductCard";

const specIcons = [Zap, Gauge, Battery];

function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(100%, 720px)" }}
      >
        {/* Header / hero */}
        <div className="relative bg-gradient-to-br from-dark-bg to-dark-card px-8 pt-8 pb-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/70 mb-1">
            {product.brand}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
            {product.name}
          </h2>
          <span className="inline-block bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-7">
          {/* Price */}
          {product.price && (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-dark-bg">{product.price}</span>
              <span className="text-sm text-gray-400">{product.unit}</span>
            </div>
          )}

          {/* Specs */}
          {product.specs?.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                Key Specifications
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {product.specs.map((spec, i) => {
                  const Icon = specIcons[i % specIcons.length];
                  return (
                    <li
                      key={spec}
                      className="flex items-center gap-3 bg-light-bg rounded-xl px-4 py-3 text-sm font-medium text-dark-bg"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      {spec}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                About this product
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/contact"
              className="flex-1 bg-dark-bg text-primary font-bold py-3.5 rounded-2xl text-sm text-center hover:bg-dark-card transition-colors flex items-center justify-center gap-2"
            >
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoreSection() {
  const [activeCategory, setActiveCategory] = useState("PV Solar Panels");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="mb-10">
        <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
          Our Products
        </span>
        <h2 className="mt-6 mb-4 max-w-2xl text-4xl font-bold leading-tight text-dark-bg md:text-5xl slide-from-left">
          Working Methodology &amp; Product Range
        </h2>
        <p className="max-w-2xl text-sm text-gray-600 animate-fade-in-up-delay-1">
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
          .map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
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

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
