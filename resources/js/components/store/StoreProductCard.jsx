import { useState } from "react";
import { ChevronDown, Zap, Battery, Gauge } from "lucide-react";

const specIcons = [Zap, Gauge, Battery];

export default function StoreProductCard({ product, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <article className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-md transition">
      <p className="text-xs font-bold text-gray-400 tracking-wider mb-1">{product.brand}</p>
      <h3 className="text-lg font-bold text-dark-bg mb-3">{product.name}</h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-dark-bg">{product.price}</span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            product.trend === "up"
              ? "bg-primary/30 text-dark-bg"
              : "bg-red-100 text-red-600"
          }`}
        >
          {product.change}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-5">{product.unit}</p>

      <ul className="space-y-2 mb-6 flex-grow">
        {product.specs.map((spec, i) => {
          const Icon = specIcons[i % specIcons.length];
          return (
            <li key={spec} className="flex items-center gap-2 text-sm text-gray-600">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              {spec}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 flex items-center justify-center gap-2 mb-3 hover:border-primary transition"
      >
        Detailed Price History
        <ChevronDown
          className={`w-4 h-4 transition ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="bg-light-bg rounded-xl p-4 mb-3 text-sm">
          <p className="font-bold text-dark-bg mb-2 text-xs uppercase tracking-wide">
            7-Day Price Fluctuations
          </p>
          <div className="h-16 bg-primary/20 rounded-lg mb-3 flex items-end gap-1 px-2 pb-2">
            {[60, 45, 70, 55, 80, 65, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-primary rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between font-medium text-dark-bg">
              <span>Date</span>
              <span>Price</span>
              <span>Change</span>
            </div>
            {["Dec 21", "Dec 20", "Dec 19"].map((date, i) => (
              <div key={date} className="flex justify-between">
                <span>{date}</span>
                <span>{product.price}</span>
                <span className={product.trend === "up" ? "text-green-600" : "text-red-500"}>
                  {product.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="w-full bg-dark-card text-primary py-3 rounded-xl font-bold hover:bg-dark-bg transition text-sm"
      >
        Add to Quote
      </button>
    </article>
  );
}
