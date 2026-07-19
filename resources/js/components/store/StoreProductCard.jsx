import {
  ArrowRight, TrendingUp, TrendingDown, Minus, ShieldCheck, Zap,
  AudioWaveform, BatteryMedium, Package, MessageCircle, Phone,
} from "lucide-react";
import { TrendArea } from "./PriceCharts";
import { formatRs } from "../../lib/format";

export const isBattery = (p) => (p.category || "").includes("Batter");
export const isPanel = (p) => (p.category || "").includes("Panel");

export function specValue(product, key) {
  const hit = (product.specs || []).find((s) => s.toLowerCase().startsWith(key.toLowerCase() + ":"));
  return hit ? hit.split(":").slice(1).join(":").trim() : null;
}

/** The three icon chips in the card header, derived per product type. */
function buildChips(product) {
  const chips = [];

  // 1 — capacity
  if (isPanel(product)) {
    const raw = specValue(product, "Power") || product.name.match(/(\d{3,4})\s*W/i)?.[1];
    const watts = raw ? (String(raw).match(/w$/i) ? String(raw) : `${raw}W`) : null;
    chips.push({ icon: Zap, value: watts || "A Grade", label: "Max Power" });
  } else if (product.unit) {
    chips.push({ icon: Zap, value: product.unit, label: isBattery(product) ? "Energy" : "Power" });
  }

  // 2 — warranty (panels: efficiency)
  if (product.warranty) {
    chips.push({ icon: ShieldCheck, value: product.warranty, label: "Warranty" });
  } else if (isPanel(product)) {
    chips.push({ icon: ShieldCheck, value: "High", label: "Efficiency" });
  }

  // 3 — phase / technology / tier
  if (product.phase) {
    chips.push({
      icon: AudioWaveform,
      value: product.phase === "Single Phase" ? "1-Ph" : "3-Ph",
      label: "Phase",
    });
  } else if (isBattery(product)) {
    chips.push({
      icon: BatteryMedium,
      value: specValue(product, "Technology") || specValue(product, "Type") || "LiFePO₄",
      label: "Technology",
    });
  } else if (isPanel(product)) {
    chips.push({ icon: Package, value: "Tier 1", label: "Brand" });
  }

  return chips.slice(0, 3);
}

function TrendPill({ trend, change }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">
        <TrendingUp className="w-3 h-3" /> {change || "Rising"}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
        <TrendingDown className="w-3 h-3" /> {change || "Falling"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
      <Minus className="w-3 h-3" /> Stable
    </span>
  );
}

export default function StoreProductCard({ product, defaultImage, onClick, onTrendClick, onContact }) {
  const image = product.image || defaultImage;
  const chips = buildChips(product);

  return (
    <article
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-600/15 hover:-translate-y-2 hover:border-emerald-300 hover:ring-1 hover:ring-emerald-300 transition-all duration-300 cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      {/* ---- Header: soft green gradient, info left, photo right ---- */}
      <div className="relative bg-gradient-to-br from-emerald-50/90 via-emerald-50 to-emerald-100/80 p-3.5 sm:p-4 overflow-hidden">
        {/* photo blob */}
        <div className="absolute -right-6 -top-6 w-32 h-40 rounded-full bg-white/50" aria-hidden />
        {/* dotted pattern */}
        <div
          className="absolute right-2 top-2 w-10 h-10 opacity-60"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(#34d39966 1.2px, transparent 1.2px)",
            backgroundSize: "9px 9px",
          }}
        />
        {image && (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="absolute right-1.5 top-5 w-14 h-16 sm:w-[4.5rem] sm:h-20 object-contain mix-blend-multiply drop-shadow group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <div className="relative pr-16 sm:pr-20">
          <span className="inline-block bg-emerald-100/90 text-emerald-700 text-[8px] sm:text-[9px] font-black tracking-[0.16em] uppercase px-2 py-1 rounded-md">
            {product.brand || "Solarkon"}
          </span>
          <h3 className="mt-2 text-[12px] sm:text-[14px] font-black text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 min-h-[2.1rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-[0.16em] uppercase text-gray-400">
            {product.category}
          </p>
        </div>

        <div className="relative mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 min-h-[1.25rem]">
          {chips.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-1 min-w-0">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Icon className="w-2.5 h-2.5 text-emerald-600" />
              </span>
              <span className="leading-tight min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-black text-gray-900 truncate">{value}</span>
                <span className="hidden sm:block text-[8px] text-gray-500 truncate">{label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Body: tagline, price, slim 30-day trend ---- */}
      <div className="p-3.5 sm:p-4 pb-0 flex-1 flex flex-col">
        <p className="text-[10px] sm:text-[11px] text-gray-500 leading-snug line-clamp-1 min-h-[1rem]">
          {product.tagline || ""}
        </p>
        <p className="mt-1 text-base sm:text-xl font-black text-gray-900 leading-none whitespace-nowrap">
          {formatRs(product.price, product.unit)}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <TrendPill trend={product.trend} change={product.price_change} />
          <span className="hidden sm:inline text-[10px] text-gray-400">vs 30 days</span>
        </div>

        <button
          type="button"
          title="View price trend"
          onClick={(e) => {
            e.stopPropagation();
            onTrendClick?.(product);
          }}
          className="mt-2.5 w-full text-left rounded-xl hover:bg-gray-50/60 transition-colors"
        >
          <span className="block text-[9px] sm:text-[10px] text-gray-400 mb-1">Price trend (30 days)</span>
          <TrendArea history={product.history} trend={product.trend} height={52} />
        </button>
      </div>

      {/* ---- Footer CTA ---- */}
      <div className="px-3.5 sm:px-4 pb-3.5 mt-2">
        <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 group-hover:gap-2 transition-all">
            View details <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              title="WhatsApp us about this product"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(product, "whatsapp");
              }}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-400 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white flex items-center justify-center shadow-sm hover:scale-110 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Call us about this product"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(product, "call");
              }}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-400 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white flex items-center justify-center shadow-sm hover:scale-110 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
