import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  X, Zap, Search, SlidersHorizontal, ChevronDown, ChevronRight,
  Phone, MessageCircle, ShieldCheck, Loader2, PackageSearch,
  TrendingUp, TrendingDown, Minus, BadgePercent, Truck, Trash2, LayoutList,
  Heart, Activity, CalendarDays, BadgeCheck, BatteryCharging, Wifi, Sun,
  Layers, ClipboardList, AudioWaveform,
} from "lucide-react";
import StoreProductCard, { isBattery, isPanel, specValue } from "./StoreProductCard";
import { PriceChart } from "./PriceCharts";
import { formatRs, formatDateFull } from "../../lib/format";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "drop", label: "Biggest Price Drop" },
  { id: "kw-asc", label: "Capacity: Low to High" },
  { id: "kw-desc", label: "Capacity: High to Low" },
  { id: "name", label: "Name: A to Z" },
];

function track(type, meta = {}, productId = null) {
  axios.post("/api/store/track", { type, meta, product_id: productId }).catch(() => {});
}

/* ---------------- announcement bar ---------------- */

const ANNOUNCE_ICONS = [BadgePercent, ShieldCheck, Truck];

// "🎉 Exclusive discounts for our customers — call us to get yours!"
//   -> { title: "Exclusive discounts for our customers", sub: "call us to get yours!" }
function parseAnnouncement(line) {
  const clean = line.replace(/^[^\p{L}\p{N}]+/u, "").trim();
  const [title, ...rest] = clean.split("—");
  return { title: title.trim(), sub: rest.join("—").trim() };
}

function AnnouncementBar({ announcements }) {
  if (!announcements?.length) return null;
  return (
    <div className="mb-10 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 sm:px-7 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0">
      <span className="inline-flex items-center gap-2.5 shrink-0 lg:pr-8">
        <span className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Zap className="w-4.5 h-4.5 text-white fill-white" />
        </span>
        <span className="text-lg font-black tracking-wide text-emerald-700 uppercase">Solarkon</span>
      </span>
      <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:gap-0">
        {announcements.slice(0, 3).map((line, i) => {
          const { title, sub } = parseAnnouncement(line);
          const Icon = ANNOUNCE_ICONS[i % ANNOUNCE_ICONS.length];
          return (
            <div
              key={i}
              className="flex items-center gap-3 flex-1 sm:px-6 sm:first:pl-0 sm:border-l border-gray-100 lg:first:border-l"
            >
              <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-emerald-600" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-gray-900">{title}</span>
                {sub && <span className="block text-xs text-gray-500 mt-0.5">{sub}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- trend popup (finance-style quick view) ---------------- */

function TrendModal({ product, onClose, onOpenDetails }) {
  if (!product) return null;

  const history = product.history || [];
  const prices = history.map((h) => h[1]);
  const high = prices.length ? Math.max(...prices) : null;
  const low = prices.length ? Math.min(...prices) : null;
  const first = history[0]?.[1];
  const last = history[history.length - 1]?.[1];
  const overallPct = first ? (((last - first) / first) * 100).toFixed(1) : null;

  return (
    <div
      className="fixed inset-0 z-[210] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-0.5">
            Price Trend · {product.brand}
          </p>
          <h3 className="text-lg font-black text-gray-900 leading-tight pr-10">{product.name}</h3>
          <div className="flex items-baseline gap-2.5 mt-2 flex-wrap">
            <span className="text-2xl font-black text-gray-900">
              {formatRs(product.price, product.unit)}
            </span>
            {product.trend === "up" && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> {product.price_change}
              </span>
            )}
            {product.trend === "down" && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                <TrendingDown className="w-3.5 h-3.5" /> {product.price_change}
              </span>
            )}
            {(!product.trend || product.trend === "stable") && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Minus className="w-3.5 h-3.5" /> Stable
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
          <PriceChart history={history} unit={product.unit} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              ["Highest", high], ["Lowest", low], ["First Recorded", first],
            ].map(([label, value]) => (
              <div key={label} className="bg-light-bg rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{formatRs(value, product.unit)}</p>
              </div>
            ))}
            <div className="bg-light-bg rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Overall</p>
              <p className={`text-sm font-bold mt-0.5 ${
                overallPct > 0 ? "text-red-600" : overallPct < 0 ? "text-emerald-700" : "text-gray-900"
              }`}>
                {overallPct > 0 ? "+" : ""}{overallPct}%
              </p>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            {history.length} price updates recorded · dates from our live market rate list
          </p>
        </div>

        <div className="shrink-0 border-t border-gray-100 p-4 sm:px-8">
          <button
            onClick={onOpenDetails}
            className="w-full bg-emerald-600 hover:bg-emerald-600-hover text-white font-bold py-3 rounded-2xl text-sm transition-colors"
          >
            View Full Product Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- product modal ---------------- */

const FAV_KEY = "solarkon_favourites";
const readFavs = () => {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
};

const TREND_RANGES = [[30, "30 Days"], [60, "60 Days"], [90, "90 Days"], [0, "All Time"]];

// Last `days` of history (0 = all); falls back to full history when the
// window has fewer than 2 points so the chart never goes blank.
function sliceHistory(history, days) {
  if (!days || history.length < 2) return history;
  const last = new Date(history[history.length - 1][0]).getTime();
  const cutoff = last - days * 24 * 3600 * 1000;
  const sliced = history.filter(([d]) => new Date(d).getTime() >= cutoff);
  return sliced.length >= 2 ? sliced : history;
}

/** Up to 4 spec tiles: capacity, phase, type/technology, warranty, then leftover specs. */
function buildSpecTiles(product) {
  const tiles = [];
  if (isPanel(product)) {
    const watts = specValue(product, "Power");
    if (watts) tiles.push({ icon: Zap, color: "text-amber-500", label: "Max Power", value: watts });
  } else if (product.unit && product.unit !== "Per Watt") {
    tiles.push({
      icon: Zap, color: "text-amber-500",
      label: isBattery(product) ? "Energy" : "Power", value: product.unit,
    });
  }
  if (product.phase) {
    tiles.push({ icon: AudioWaveform, color: "text-emerald-600", label: "Phase", value: product.phase });
  }
  const type = specValue(product, "Type") || specValue(product, "Technology");
  if (type) {
    tiles.push({
      icon: ClipboardList, color: "text-emerald-600",
      label: isBattery(product) ? "Technology" : "Type", value: type,
    });
  }
  if (product.warranty) {
    tiles.push({ icon: ShieldCheck, color: "text-emerald-600", label: "Warranty", value: product.warranty });
  }
  for (const spec of product.specs || []) {
    if (tiles.length >= 4) break;
    const [key, ...rest] = spec.split(":");
    if (!rest.length) continue;
    const label = key.trim();
    if (["Type", "Technology", "Power"].includes(label)) continue;
    if (tiles.some((t) => t.label === label)) continue;
    tiles.push({ icon: Layers, color: "text-emerald-600", label, value: rest.join(":").trim() });
  }
  return tiles.slice(0, 4);
}

function productFeatures(product) {
  if (isBattery(product)) {
    return [
      { icon: BadgeCheck, title: "Long Life", sub: "Thousands of charge cycles" },
      { icon: BatteryCharging, title: "Deep Backup", sub: "Reliable day & night power" },
      { icon: Wifi, title: "Smart BMS", sub: "Built-in battery management" },
      { icon: ShieldCheck, title: "Advanced Safety", sub: "Multiple protection for worry-free use" },
    ];
  }
  if (isPanel(product)) {
    return [
      { icon: BadgeCheck, title: "High Efficiency", sub: "More output from every ray" },
      { icon: Sun, title: "A-Grade Cells", sub: "Tier-1 quality modules" },
      { icon: Layers, title: "Weather Proof", sub: "Built for Pakistan's climate" },
      { icon: ShieldCheck, title: "Long-Term Output", sub: "Decades of dependable power" },
    ];
  }
  return [
    { icon: BadgeCheck, title: "Reliable", sub: "High efficiency & stable performance" },
    { icon: BatteryCharging, title: "Battery Ready", sub: "Supports lead-acid & lithium batteries" },
    { icon: Wifi, title: "Smart Monitoring", sub: "Real-time monitoring via app & web" },
    { icon: ShieldCheck, title: "Advanced Safety", sub: "Multiple protection for worry-free use" },
  ];
}

function ProductModal({ product, defaults, onClose }) {
  const [contacting, setContacting] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [rangeDays, setRangeDays] = useState(30);
  const [expanded, setExpanded] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (product) {
      track("product_view", { name: product.name }, product.id);
      setImgIdx(0);
      setRangeDays(30);
      setExpanded(false);
      setFav(readFavs().includes(product.slug));
    }
  }, [product?.id]);

  if (!product) return null;

  const images = [...new Set([product.image || defaults.image, ...(product.gallery || [])].filter(Boolean))];
  const description = product.description || defaults.description;

  const contact = async (channel) => {
    setContacting(channel);
    try {
      const url = `${window.location.origin}/store?product=${product.slug}`;
      const { data } = await axios.post(`/api/store/products/${product.id}/contact-click`, {
        channel,
        product_url: url,
      });
      window.open(channel === "call" ? data.tel_url : data.wa_url, "_blank");
    } catch {
      // still let the visitor reach us even if logging failed
    } finally {
      setContacting(null);
    }
  };

  const toggleFav = () => {
    const favs = readFavs();
    const next = favs.includes(product.slug)
      ? favs.filter((s) => s !== product.slug)
      : [...favs, product.slug];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFav(next.includes(product.slug));
  };

  const history = product.history || [];
  const sliced = sliceHistory(history, rangeDays);
  const prices = sliced.map((h) => h[1]);
  const high = prices.length ? Math.max(...prices) : null;
  const low = prices.length ? Math.min(...prices) : null;
  const firstPrice = sliced[0]?.[1];
  const lastPrice = sliced[sliced.length - 1]?.[1];
  const rangePct = firstPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : null;
  const lastDate = history[history.length - 1]?.[0];
  const rangeLabel = rangeDays ? `${rangeDays}-Day` : "All-Time";
  const rangeWords = rangeDays ? `in the last ${rangeDays} days` : "since first recorded";
  const specTiles = buildSpecTiles(product);
  const features = productFeatures(product);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 sm:px-8 pt-7 pb-5 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/80 mb-1">
            {product.brand}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight pr-10">
            {product.name}
          </h2>
          {product.tagline && (
            <p className="text-[13px] text-white/75 leading-snug mt-1 pr-10">{product.tagline}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.phase && (
              <span className="inline-block bg-white/20 text-white/80 text-xs font-bold px-3 py-1 rounded-full">
                {product.phase}
              </span>
            )}
            {product.warranty && (
              <span className="inline-flex items-center gap-1 bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" /> {product.warranty} Warranty
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid lg:grid-cols-2 gap-7 items-start">
            {/* ---- Left: gallery + price trend ---- */}
            <div className="space-y-6">
              {images.length > 0 && (
                <div className="flex gap-3">
                  {images.length > 1 && (
                    <div className="flex flex-col gap-2.5 w-16 shrink-0">
                      {images.slice(0, 4).map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setImgIdx(i)}
                          className={`rounded-xl border-2 overflow-hidden bg-white p-1 transition-colors ${
                            i === imgIdx ? "border-emerald-600" : "border-gray-100 hover:border-gray-300"
                          }`}
                        >
                          <img src={src} alt="" className="w-full h-12 object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="relative flex-1 rounded-2xl border border-gray-100 bg-light-bg overflow-hidden">
                    <img
                      src={images[imgIdx] || images[0]}
                      alt={product.name}
                      className="w-full h-72 object-contain mix-blend-multiply p-4"
                    />
                    <button
                      type="button"
                      onClick={toggleFav}
                      title={fav ? "Remove from favourites" : "Save to favourites"}
                      className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Heart className={`w-4.5 h-4.5 ${fav ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Price trend card */}
              <div className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-700">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Price Trend
                  </span>
                  <div className="relative">
                    <select
                      value={rangeDays}
                      onChange={(e) => setRangeDays(Number(e.target.value))}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-700 outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      {TREND_RANGES.map(([days, label]) => (
                        <option key={days} value={days}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <PriceChart history={sliced} unit={product.unit} />

                {sliced.length >= 2 && (
                  <>
                    <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl mt-5">
                      <div className="px-4 py-3">
                        <p className="text-[11px] text-gray-400 font-medium">{rangeLabel} High</p>
                        <p className="text-sm font-black text-emerald-700 mt-0.5">{formatRs(high, product.unit)}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[11px] text-gray-400 font-medium">{rangeLabel} Low</p>
                        <p className="text-sm font-black text-red-600 mt-0.5">{formatRs(low, product.unit)}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[11px] text-gray-400 font-medium">Change ({rangeLabel})</p>
                        <p className={`flex items-center gap-1 text-sm font-black mt-0.5 ${
                          rangePct > 0 ? "text-red-600" : rangePct < 0 ? "text-blue-700" : "text-gray-500"
                        }`}>
                          {rangePct > 0 ? <TrendingUp className="w-3.5 h-3.5" />
                            : rangePct < 0 ? <TrendingDown className="w-3.5 h-3.5" />
                            : <Minus className="w-3.5 h-3.5" />}
                          {rangePct > 0 ? "+" : ""}{rangePct?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2.5 bg-light-bg rounded-xl px-4 py-3 text-[13px] text-gray-600">
                      <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                      {rangePct === 0
                        ? `Price unchanged ${rangeWords}`
                        : `Price ${rangePct < 0 ? "decreased" : "increased"} by ${Math.abs(rangePct).toFixed(1)}% ${rangeWords}`}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ---- Right: price, market info, specs, about, CTAs ---- */}
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900">
                    {formatRs(product.price, product.unit)}
                  </span>
                  {product.unit && product.unit !== "Per Watt" && (
                    <span className="text-sm font-bold text-gray-400">{product.unit}</span>
                  )}
                </div>
                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  {product.trend === "up" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" /> {product.price_change}
                    </span>
                  )}
                  {product.trend === "down" && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      <TrendingDown className="w-3.5 h-3.5" /> {product.price_change}
                    </span>
                  )}
                  {(!product.trend || product.trend === "stable") && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <Minus className="w-3.5 h-3.5" /> Stable
                    </span>
                  )}
                  <span className="text-xs text-gray-400">in last 30 days</span>
                </div>
              </div>

              {/* Live market price */}
              <div>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-emerald-50/60 border-b border-gray-100">
                    <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.14em] uppercase text-emerald-700">
                      <Activity className="w-4 h-4" /> Live Market Price
                    </span>
                    <span className="text-[11px] text-gray-400">Last Updated</span>
                  </div>
                  <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <div className="px-5 py-3.5">
                      <p className="text-[11px] text-gray-400">Updated:</p>
                      <p className="flex items-center gap-2 text-sm font-bold text-gray-900 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {lastDate ? formatDateFull(lastDate) : "—"}
                      </p>
                    </div>
                    <div className="px-5 py-3.5">
                      <p className="text-[11px] text-gray-400">Source:</p>
                      <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mt-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Official Distributor Network
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 px-1">
                  Prices are updated daily based on distributor quotations.
                </p>
              </div>

              {/* Key specifications */}
              {specTiles.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    Key Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {specTiles.map(({ icon: Icon, color, label, value }) => (
                      <div key={label} className="rounded-xl border border-gray-100 px-4 py-3.5 flex items-center gap-3">
                        <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                        <span className="min-w-0">
                          <span className="block text-[11px] text-gray-400">{label}</span>
                          <span className="block text-[15px] font-black text-gray-900 truncate">{value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All specifications */}
              {product.specs?.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    All Specifications
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {product.specs.map((spec) => {
                      const [key, ...rest] = spec.split(":");
                      const value = rest.join(":").trim();
                      return (
                        <li
                          key={spec}
                          className="flex items-baseline justify-between gap-3 text-sm border-b border-gray-50 pb-1.5"
                        >
                          {value ? (
                            <>
                              <span className="text-gray-500">{key.trim()}</span>
                              <span className="font-bold text-gray-900 text-right">{value}</span>
                            </>
                          ) : (
                            <span className="text-gray-700">{spec}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* About */}
              {description && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    About This Product
                  </h3>
                  <p className={`text-sm text-gray-600 leading-relaxed ${expanded ? "" : "line-clamp-4"}`}>
                    {description}
                  </p>
                  {description.length > 220 && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      {expanded ? "Show less" : "View full details"}
                      <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>
                  )}
                </div>
              )}

              {/* Feature strip */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
                {features.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="bg-white px-3 py-4 text-center">
                    <span className="mx-auto w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-2">
                      <Icon className="w-4.5 h-4.5 text-emerald-600" />
                    </span>
                    <p className="text-[12px] font-black text-gray-900">{title}</p>
                    <p className="text-[10.5px] text-gray-400 leading-snug mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-8 bg-light-bg rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-around gap-3">
            {[
              ["100% Genuine Products", BadgeCheck],
              ["Official Warranty", ShieldCheck],
              ["Fast Delivery All Over Pakistan", Truck],
            ].map(([label, Icon]) => (
              <span key={label} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Icon className="w-4.5 h-4.5 text-emerald-600" /> {label}
              </span>
            ))}
          </div>
        </div>

        {/* Contact CTAs — pinned below the scroll area, always visible */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-4 sm:px-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => contact("whatsapp")}
              disabled={contacting !== null}
              className="bg-[#25D366] hover:bg-[#1fb857] text-white font-bold py-3 sm:py-3.5 rounded-2xl text-[13px] sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {contacting === "whatsapp"
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <MessageCircle className="w-4 h-4" />}
              <span className="hidden sm:inline">WhatsApp for Best Price</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
            <button
              onClick={() => contact("call")}
              disabled={contacting !== null}
              className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-3 sm:py-3.5 rounded-2xl text-[13px] sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {contacting === "call"
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Phone className="w-4 h-4" />}
              Call Now
            </button>
          </div>
          <p className="hidden sm:block text-center text-[11px] text-gray-400 mt-2">
            Mention this product when you call — we track your enquiry so our team responds faster.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- filters ---------------- */

function BrandDropdown({ brands, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border shadow-sm transition ${
          selected.length
            ? "bg-emerald-600 text-white border-emerald-600"
            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
        }`}
      >
        Brands{selected.length ? ` (${selected.length})` : ""}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl p-2 max-h-72 overflow-y-auto">
          {selected.length > 0 && (
            <button
              onClick={onClear}
              className="w-full text-left px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg mb-1"
            >
              Clear brands
            </button>
          )}
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-light-bg cursor-pointer text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(brand)}
                onChange={() => onToggle(brand)}
                className="accent-emerald-600 w-4 h-4"
              />
              {brand}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- main section ---------------- */

export default function StoreSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brands, setBrands] = useState([]);
  const [phase, setPhase] = useState("All");
  const [kwMin, setKwMin] = useState("");
  const [kwMax, setKwMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("featured");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trendProduct, setTrendProduct] = useState(null);

  // Mobile: floating filter tab (appears after the top filter row scrolls away)
  // + slide-in filter drawer.
  const [mobileFilters, setMobileFilters] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const filterRowRef = useRef(null);

  const searchTimer = useRef(null);

  useEffect(() => {
    const el = filterRowRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setFabVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileFilters ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFilters]);

  useEffect(() => {
    axios
      .get("/api/store/products")
      .then(({ data }) => {
        setData(data);
        // Deep link: /store?product=slug opens that product.
        const slug = new URLSearchParams(window.location.search).get("product");
        if (slug) {
          const found = data.products.find((p) => p.slug === slug);
          if (found) setSelectedProduct(found);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const onSearch = (value) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    if (value.trim().length >= 2) {
      searchTimer.current = setTimeout(() => track("search", { q: value.trim().toLowerCase() }), 900);
    }
  };

  const pickCategory = (cat) => {
    setCategory(cat);
    if (cat !== "All") track("filter", { category: cat });
  };

  const toggleBrand = (brand) => {
    setBrands((prev) => {
      const next = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand];
      if (!prev.includes(brand)) track("filter", { brand });
      return next;
    });
  };

  const pickPhase = (value) => {
    setPhase(value);
    if (value !== "All") track("filter", { phase: value });
  };

  const products = data?.products || [];

  const activeCategories = useMemo(() => {
    const withProducts = new Set(products.map((p) => p.category));
    return ["All", ...(data?.categories || []).filter((c) => withProducts.has(c))];
  }, [data, products]);

  const activeBrands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return (data?.brands || []).filter((b) => set.has(b));
  }, [data, products]);

  const filtered = useMemo(() => {
    let result = products;

    if (category !== "All") result = result.filter((p) => p.category === category);
    if (brands.length) result = result.filter((p) => brands.includes(p.brand));
    if (phase !== "All") result = result.filter((p) => p.phase === phase);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          (p.specs || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    if (kwMin !== "") result = result.filter((p) => p.power_kw !== null && p.power_kw >= Number(kwMin));
    if (kwMax !== "") result = result.filter((p) => p.power_kw !== null && p.power_kw <= Number(kwMax));
    if (priceMin !== "") result = result.filter((p) => p.price !== null && p.price >= Number(priceMin));
    if (priceMax !== "") result = result.filter((p) => p.price !== null && p.price <= Number(priceMax));

    const dropPct = (p) => {
      const c = parseFloat(p.price_change);
      return Number.isNaN(c) ? 0 : c;
    };

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        result = [...result].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
      case "drop":
        result = [...result].sort((a, b) => dropPct(a) - dropPct(b));
        break;
      case "kw-asc":
        result = [...result].sort((a, b) => (a.power_kw ?? Infinity) - (b.power_kw ?? Infinity));
        break;
      case "kw-desc":
        result = [...result].sort((a, b) => (b.power_kw ?? -Infinity) - (a.power_kw ?? -Infinity));
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, category, brands, phase, search, kwMin, kwMax, priceMin, priceMax, sort]);

  const hasActiveFilters =
    category !== "All" || brands.length > 0 || phase !== "All" || search.trim() !== "" ||
    kwMin !== "" || kwMax !== "" || priceMin !== "" || priceMax !== "";

  const activeFilterCount =
    (category !== "All" ? 1 : 0) + brands.length + (phase !== "All" ? 1 : 0) +
    (kwMin !== "" || kwMax !== "" ? 1 : 0) + (priceMin !== "" || priceMax !== "" ? 1 : 0);

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setBrands([]); setPhase("All");
    setKwMin(""); setKwMax(""); setPriceMin(""); setPriceMax(""); setSort("featured");
  };

  // Direct WhatsApp / Call from a card — same lead logging as the modal CTAs.
  const contactProduct = async (product, channel) => {
    try {
      const url = `${window.location.origin}/store?product=${product.slug}`;
      const { data } = await axios.post(`/api/store/products/${product.id}/contact-click`, {
        channel,
        product_url: url,
      });
      window.open(channel === "call" ? data.tel_url : data.wa_url, "_blank");
    } catch {
      // ignore logging failures — never block the visitor from reaching us
    }
  };

  return (
    <section className="py-14 max-w-7xl mx-auto px-6">
      {/* Announcements */}
      <AnnouncementBar announcements={data?.announcements} />

      {/* Hero */}
      <div className="mb-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 shadow-sm px-4 py-1.5 text-sm font-medium text-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Market Rates
          </span>
          <h2 className="mt-6 mb-4 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-gray-900 md:text-6xl">
            Solar Products &amp;<br />
            Daily <span className="text-emerald-600">Price</span> Trends
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-gray-500">
            Batteries, inverters and panels at live market rates — with price history
            on every product so you buy at the right time.{" "}
            <span className="font-bold text-emerald-600">Call or WhatsApp</span> for
            exclusive discounts.
          </p>
        </div>
        <div className="relative hidden lg:block w-[26rem] h-64" aria-hidden>
          <div className="absolute inset-0 rounded-[3rem] rounded-tr-[6rem] bg-gradient-to-br from-emerald-50 via-emerald-100/70 to-emerald-50" />
          <div
            className="absolute right-6 top-5 w-20 h-20 opacity-70"
            style={{
              backgroundImage: "radial-gradient(#34d39966 1.5px, transparent 1.5px)",
              backgroundSize: "13px 13px",
            }}
          />
          <img
            src="/storage/media/1784395297_Inverter.jpg"
            alt=""
            className="absolute right-24 bottom-2 h-56 object-contain mix-blend-multiply drop-shadow-xl"
          />
          <img
            src="/storage/media/1784395296_Battery.jpg"
            alt=""
            className="absolute left-6 bottom-2 h-40 object-contain mix-blend-multiply drop-shadow-lg"
          />
        </div>
      </div>

      {/* Search + sort row */}
      <div ref={filterRowRef} className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products, brands, specs — e.g. Goodwe 10kW, IP65, 590W…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 shadow-sm text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none bg-white"
          />
        </div>
        <div className="flex gap-3">
          <BrandDropdown
            brands={activeBrands}
            selected={brands}
            onToggle={toggleBrand}
            onClear={() => setBrands([])}
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition shadow-sm ${
              showAdvanced
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-600"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl text-sm font-medium border border-gray-200 shadow-sm bg-white text-gray-700 outline-none focus:border-emerald-600 cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="mb-6 bg-gray-50 rounded-[1.75rem] p-6 sm:p-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.14em] text-gray-500 mb-3">Phase</label>
            <div className="flex gap-2.5">
              {["All", "Single Phase", "Three Phase"].map((p) => (
                <button
                  key={p}
                  onClick={() => pickPhase(p)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${
                    phase === p
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-600"
                  }`}
                >
                  {p === "Single Phase" ? "1-Phase" : p === "Three Phase" ? "3-Phase" : "All"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.14em] text-gray-500 mb-3">
              Capacity (kW / kWh)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number" min="0" value={kwMin} onChange={(e) => setKwMin(e.target.value)}
                placeholder="Min"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-emerald-600"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number" min="0" value={kwMax} onChange={(e) => setKwMax(e.target.value)}
                placeholder="Max"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.14em] text-gray-500 mb-3">
              Price Range (Rs.)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number" min="0" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-emerald-600"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number" min="0" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {activeCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => pickCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition ${
              category === cat
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result meta */}
      <div className="flex items-center justify-between mb-6">
        <p className="flex items-center gap-3 text-[15px] text-gray-500">
          <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
            <LayoutList className="w-4 h-4 text-emerald-600" />
          </span>
          {loading ? "Loading products…" : (
            <>
              Showing <span className="font-black text-gray-900">{filtered.length}</span> of{" "}
              {products.length} products
            </>
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading live rates…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-gray-400">
          <PackageSearch className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-bold text-gray-500">No products match your filters</p>
          <p className="text-sm mt-1">Try widening the price or capacity range.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-16">
          {filtered.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              defaultImage={data?.defaults?.image}
              onClick={() => setSelectedProduct(product)}
              onTrendClick={(p) => setTrendProduct(p)}
              onContact={contactProduct}
            />
          ))}
        </div>
      )}

      {/* ---- Floating search bar: all viewports, appears once the in-page
             search row scrolls out of view ---- */}
      <div
        className={`fixed top-0 inset-x-0 z-[140] transition-transform duration-300 ${
          fabVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search products, brands, specs…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm bg-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-400 whitespace-nowrap">
              {filtered.length} of {products.length} products
            </span>
          </div>
        </div>
      </div>

      {/* ---- Mobile: floating filter tab on the left edge ---- */}
      <button
        type="button"
        onClick={() => setMobileFilters(true)}
        className={`lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-[150] flex flex-col items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-2xl shadow-xl shadow-emerald-600/30 px-2.5 py-4 transition-transform duration-300 ${
          fabVisible && !mobileFilters ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SlidersHorizontal className="w-4.5 h-4.5" />
        <span className="text-[10px] font-black tracking-[0.2em]" style={{ writingMode: "vertical-rl" }}>
          FILTERS
        </span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-[10px] font-black flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ---- Mobile: slide-in filter drawer ---- */}
      <div
        className={`lg:hidden fixed inset-0 z-[180] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileFilters(false)}
      />
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-[190] w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          mobileFilters ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="flex items-center gap-2 text-base font-black text-gray-900">
            <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-600" /> Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </span>
          <button
            onClick={() => setMobileFilters(false)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2.5">Category</p>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => pickCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition ${
                    category === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {activeBrands.length > 0 && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2.5">Brands</p>
              <div className="grid grid-cols-2 gap-1.5">
                {activeBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2.5">Phase</p>
            <div className="flex gap-2">
              {["All", "Single Phase", "Three Phase"].map((p) => (
                <button
                  key={p}
                  onClick={() => pickPhase(p)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition ${
                    phase === p
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  {p === "Single Phase" ? "1-Phase" : p === "Three Phase" ? "3-Phase" : "All"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2.5">
              Capacity (kW / kWh)
            </p>
            <div className="flex items-center gap-2.5">
              <input
                type="number" min="0" value={kwMin} onChange={(e) => setKwMin(e.target.value)}
                placeholder="Min"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number" min="0" value={kwMax} onChange={(e) => setKwMax(e.target.value)}
                placeholder="Max"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2.5">
              Price Range (Rs.)
            </p>
            <div className="flex items-center gap-2.5">
              <input
                type="number" min="0" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number" min="0" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2.5">Sort By</p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-700 outline-none focus:border-emerald-600"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 p-4 space-y-2.5">
          <button
            onClick={() => setMobileFilters(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
          >
            Show {filtered.length} Product{filtered.length === 1 ? "" : "s"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full text-sm font-bold text-red-500 hover:text-red-600 py-1.5 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>
      </div>

      <TrendModal
        product={trendProduct}
        onClose={() => setTrendProduct(null)}
        onOpenDetails={() => {
          setSelectedProduct(trendProduct);
          setTrendProduct(null);
        }}
      />

      <ProductModal
        product={selectedProduct}
        defaults={data?.defaults || {}}
        onClose={() => {
          setSelectedProduct(null);
          const url = new URL(window.location);
          url.searchParams.delete("product");
          window.history.replaceState({}, "", url);
        }}
      />
    </section>
  );
}
