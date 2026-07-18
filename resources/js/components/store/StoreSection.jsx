import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  X, Zap, Battery, Gauge, Search, SlidersHorizontal, ChevronDown,
  Phone, MessageCircle, ShieldCheck, Loader2, PackageSearch, Megaphone,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import StoreProductCard from "./StoreProductCard";
import { PriceChart } from "./PriceCharts";
import { formatRs } from "../../lib/format";

const specIcons = [Zap, Gauge, Battery];

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
          <h3 className="text-lg font-black text-dark-bg leading-tight pr-10">{product.name}</h3>
          <div className="flex items-baseline gap-2.5 mt-2 flex-wrap">
            <span className="text-2xl font-black text-dark-bg">
              {formatRs(product.price, product.unit)}
            </span>
            {product.trend === "up" && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> {product.price_change}
              </span>
            )}
            {product.trend === "down" && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
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
                <p className="text-sm font-bold text-dark-bg mt-0.5">{formatRs(value, product.unit)}</p>
              </div>
            ))}
            <div className="bg-light-bg rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Overall</p>
              <p className={`text-sm font-bold mt-0.5 ${
                overallPct > 0 ? "text-red-600" : overallPct < 0 ? "text-green-700" : "text-dark-bg"
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
            className="w-full bg-dark-bg hover:bg-dark-card text-primary font-bold py-3 rounded-2xl text-sm transition-colors"
          >
            View Full Product Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- product modal ---------------- */

function ProductModal({ product, defaults, onClose }) {
  const [contacting, setContacting] = useState(null);

  useEffect(() => {
    if (product) track("product_view", { name: product.name }, product.id);
  }, [product?.id]);

  if (!product) return null;

  const image = product.image || defaults.image;
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

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-dark-bg to-dark-card px-6 sm:px-8 pt-7 pb-5 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/70 mb-1">
            {product.brand}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 pr-10">
            {product.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="inline-block bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.phase && (
              <span className="inline-block bg-white/10 text-white/80 text-xs font-bold px-3 py-1 rounded-full">
                {product.phase}
              </span>
            )}
            {product.warranty && (
              <span className="inline-flex items-center gap-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" /> {product.warranty} Warranty
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">
          <div className="grid sm:grid-cols-2 gap-6 items-start">
            {image && (
              <div className="rounded-2xl overflow-hidden bg-light-bg border border-gray-100">
                <img src={image} alt={product.name} className="w-full h-52 object-cover" />
              </div>
            )}
            <div className={image ? "" : "sm:col-span-2"}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-dark-bg">
                  {formatRs(product.price, product.unit)}
                </span>
                {product.unit && product.unit !== "Per Watt" && (
                  <span className="text-sm text-gray-400">{product.unit}</span>
                )}
              </div>
              <div className="mt-2">
                {product.trend === "up" && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5" /> {product.price_change} recently
                  </span>
                )}
                {product.trend === "down" && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5" /> {product.price_change} recently
                  </span>
                )}
                {(!product.trend || product.trend === "stable") && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Minus className="w-3.5 h-3.5" /> Price stable
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Rates change with the market — call or WhatsApp us for today&apos;s best
                price and <span className="font-bold text-gray-500">exclusive discounts</span>.
              </p>
            </div>
          </div>

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
                      <Icon className="w-4 h-4 text-primary-hover shrink-0" />
                      {spec}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                About this product
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Price trend — detailed history at the end */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Price Trend &amp; History
            </h3>
            <PriceChart history={product.history} unit={product.unit} />
          </div>
        </div>

        {/* Contact CTAs */}
        <div className="shrink-0 border-t border-gray-100 p-4 sm:px-8 sm:py-5 bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => contact("whatsapp")}
              disabled={contacting !== null}
              className="flex-1 bg-[#25D366] hover:bg-[#1fb857] text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {contacting === "whatsapp"
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <MessageCircle className="w-4 h-4" />}
              WhatsApp for Best Price
            </button>
            <button
              onClick={() => contact("call")}
              disabled={contacting !== null}
              className="flex-1 bg-dark-bg hover:bg-dark-card text-primary font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {contacting === "call"
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Phone className="w-4 h-4" />}
              Call Now
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-2.5">
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
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition ${
          selected.length
            ? "bg-dark-card text-primary border-dark-card"
            : "bg-white text-gray-600 border-gray-200 hover:border-primary"
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
                className="accent-[#0a261a] w-4 h-4"
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

  const searchTimer = useRef(null);

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

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setBrands([]); setPhase("All");
    setKwMin(""); setKwMax(""); setPriceMin(""); setPriceMax(""); setSort("featured");
  };

  return (
    <section className="py-14 max-w-7xl mx-auto px-6">
      {/* Announcements */}
      {data?.announcements?.length > 0 && (
        <div className="mb-10 bg-dark-bg rounded-[2rem] px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
          <span className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest shrink-0">
            <Megaphone className="w-4 h-4" /> SEB Solar
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-1.5">
            {data.announcements.map((a, i) => (
              <span key={i} className="text-sm text-white/90 font-medium">{a}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <span className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600">
          Live Market Rates
        </span>
        <h2 className="mt-6 mb-4 max-w-2xl text-4xl font-bold leading-tight text-dark-bg md:text-5xl">
          Solar Products &amp; Daily Price Trends
        </h2>
        <p className="max-w-2xl text-sm text-gray-600">
          Batteries, inverters and panels at live market rates — with price history on every
          product so you buy at the right time. Call or WhatsApp for exclusive discounts.
        </p>
      </div>

      {/* Search + sort row */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products, brands, specs — e.g. Goodwe 10kW, IP65, 590W…"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none bg-white"
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition ${
              showAdvanced || kwMin || kwMax || priceMin || priceMax || phase !== "All"
                ? "bg-dark-card text-primary border-dark-card"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 outline-none focus:border-primary cursor-pointer"
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
        <div className="mb-5 bg-light-bg border border-gray-100 rounded-3xl p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Phase</label>
            <div className="flex gap-2">
              {["All", "Single Phase", "Three Phase"].map((p) => (
                <button
                  key={p}
                  onClick={() => pickPhase(p)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                    phase === p
                      ? "bg-dark-card text-primary"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary"
                  }`}
                >
                  {p === "Single Phase" ? "1-Phase" : p === "Three Phase" ? "3-Phase" : "All"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              Capacity (kW / kWh)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" value={kwMin} onChange={(e) => setKwMin(e.target.value)}
                placeholder="Min"
                className="w-full px-4 py-2 rounded-full border border-gray-200 text-sm bg-white outline-none focus:border-primary"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number" min="0" value={kwMax} onChange={(e) => setKwMax(e.target.value)}
                placeholder="Max"
                className="w-full px-4 py-2 rounded-full border border-gray-200 text-sm bg-white outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              Price Range (Rs.)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="w-full px-4 py-2 rounded-full border border-gray-200 text-sm bg-white outline-none focus:border-primary"
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="number" min="0" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="w-full px-4 py-2 rounded-full border border-gray-200 text-sm bg-white outline-none focus:border-primary"
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
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? "bg-dark-card text-primary"
                : "bg-light-bg text-gray-600 border border-gray-200 hover:border-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result meta */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-400">
          {loading ? "Loading products…" : (
            <>
              Showing <span className="font-bold text-dark-bg">{filtered.length}</span> of{" "}
              {products.length} products
            </>
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear all filters
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filtered.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              defaultImage={data?.defaults?.image}
              onClick={() => setSelectedProduct(product)}
              onTrendClick={(p) => setTrendProduct(p)}
            />
          ))}
        </div>
      )}

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
