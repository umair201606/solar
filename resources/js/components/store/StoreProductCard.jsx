import { Zap, Battery, Gauge, ArrowRight } from "lucide-react";

const specIcons = [Zap, Gauge, Battery];

export default function StoreProductCard({ product, onClick }) {
  return (
    <article
      className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image / brand block */}
      <div className="h-44 bg-gradient-to-br from-dark-bg to-dark-card flex flex-col items-center justify-center gap-2 p-6">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/70">{product.brand}</p>
        <p className="text-xl font-black text-white text-center leading-tight">{product.name}</p>
        <span className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest">{product.category}</span>
      </div>

      {/* Body */}
      <div className="p-5">
        {product.price && (
          <p className="text-2xl font-black text-dark-bg mb-3">{product.price}
            <span className="text-xs font-medium text-gray-400 ml-1.5">{product.unit}</span>
          </p>
        )}

        <ul className="space-y-1.5 mb-5">
          {product.specs.slice(0, 3).map((spec, i) => {
            const Icon = specIcons[i % specIcons.length];
            return (
              <li key={spec} className="flex items-center gap-2 text-sm text-gray-600">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                {spec}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1 text-sm font-bold text-dark-bg group-hover:gap-2 transition-all">
          View Details <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </article>
  );
}
