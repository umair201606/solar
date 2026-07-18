import { ArrowRight, TrendingUp, TrendingDown, Minus, ShieldCheck, Zap } from "lucide-react";
import { Sparkline } from "./PriceCharts";
import { formatRs } from "../../lib/format";

function TrendBadge({ trend, change }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <TrendingUp className="w-3 h-3" /> {change || "Rising"}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
        <TrendingDown className="w-3 h-3" /> {change || "Falling"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> Stable
    </span>
  );
}

export default function StoreProductCard({ product, defaultImage, onClick, onTrendClick }) {
  const image = product.image || defaultImage;

  return (
    <article
      className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/60 transition-all duration-300 cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      {/* Image / brand block */}
      {image ? (
        <div className="h-44 bg-light-bg relative overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-dark-bg/85 text-primary text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
            {product.brand || "SEB Solar"}
          </span>
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-dark-bg to-dark-card flex flex-col items-center justify-center gap-2 p-6">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/70">{product.brand}</p>
          <p className="text-lg font-black text-white text-center leading-tight line-clamp-2">{product.name}</p>
          <span className="mt-1 text-[10px] font-bold text-white/40 uppercase tracking-widest">{product.category}</span>
        </div>
      )}

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-dark-bg text-sm leading-snug line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {product.unit && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-light-bg border border-gray-100 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3 text-primary-hover" /> {product.unit}
            </span>
          )}
          {product.warranty && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" /> {product.warranty}
            </span>
          )}
          {product.phase && (
            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {product.phase === "Single Phase" ? "1-Ph" : "3-Ph"}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xl font-black text-dark-bg leading-none">
                {formatRs(product.price, product.unit)}
              </p>
              <div className="mt-1.5">
                <TrendBadge trend={product.trend} change={product.price_change} />
              </div>
            </div>
            {product.history?.length > 1 && (
              <button
                type="button"
                title="View price trend"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrendClick?.(product);
                }}
                className="rounded-xl px-1.5 py-1 -mr-1.5 hover:bg-light-bg border border-transparent hover:border-gray-200 transition-colors"
              >
                <Sparkline history={product.history} trend={product.trend} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-dark-bg mt-4 group-hover:gap-2 transition-all">
            View details &amp; price trend <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
