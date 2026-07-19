import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MediaPickerModal from "../../components/admin/MediaPickerModal";
import {
  Loader2, ImagePlus, X, Plus, Trash2, TrendingUp, TrendingDown, Minus, Info,
  ArrowLeft, Pencil, Eye, Copy, ClipboardList, CircleDollarSign, FileText,
  Image as ImageIcon, Globe, Calendar, ShieldCheck, Check,
} from "lucide-react";
import { PriceChart } from "../../components/store/PriceCharts";
import { formatRs, formatDateFull } from "../../lib/format";

// Field guidance that adapts to the selected category.
const CATEGORY_HINTS = {
  "Lithium Batteries": {
    unit: "Battery capacity for display — e.g. 5kWh, 16kWh",
    power_kw: "Capacity in kWh, numbers only — e.g. 5 / 10 / 16",
    price: "Full battery price in Rs. — e.g. 245000",
    specs: "One per line — e.g.\nVoltage: 51.2V\nCapacity: 100Ah\nProtection: IP65\nLife Cycles: 8000+",
    specsPlaceholder: "Voltage: 51.2V\nCapacity: 100Ah\nProtection: IP65",
  },
  "Solar Panels": {
    unit: "Use \"Per Watt\" so the store shows Rs./W",
    power_kw: "Panel watts ÷ 1000 — e.g. 0.59 for a 590W panel",
    price: "Rate per watt in Rs. — e.g. 43.75",
    specs: "One per line — e.g.\nPower: 590W\nTechnology: N-Type Bifacial\nGrade: A Grade",
    specsPlaceholder: "Power: 590W\nTechnology: N-Type Bifacial\nGrade: A Grade",
  },
  default: {
    unit: "Inverter power for display — e.g. 10kW",
    power_kw: "Capacity in kW, numbers only — e.g. 3 / 10 / 15",
    price: "Full inverter price in Rs. — e.g. 410000",
    specs: "One per line — e.g.\nPower: 10kW\nType: Hybrid\nProtection: IP66\nSeries: PV12000",
    specsPlaceholder: "Power: 10kW\nType: Hybrid\nProtection: IP66",
  },
};

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white";

const TREND_RANGES = [["7D", 7], ["30D", 30], ["90D", 90], ["1Y", 365], ["All", 0]];

function Hint({ children, style }) {
  return <p className="text-[11px] text-gray-400 mt-1 leading-snug" style={style}>{children}</p>;
}

function CardHeader({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <span className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-600" />
        </span>
        <span className="font-black text-[15px] text-[#041a12]">{title}</span>
      </span>
      {right}
    </div>
  );
}

// history pairs [[date, price], ...] limited to last N days (0 = all)
function sliceDays(pairs, days) {
  if (!days || pairs.length < 2) return pairs;
  const last = new Date(pairs[pairs.length - 1][0]).getTime();
  const cutoff = last - days * 24 * 3600 * 1000;
  const sliced = pairs.filter(([d]) => new Date(d).getTime() >= cutoff);
  return sliced.length >= 2 ? sliced : pairs;
}

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const emptyForm = {
    name: "",
    slug: "",
    category: "",
    brand: "",
    price: "",
    internal_price: "",
    price_date: new Date().toISOString().slice(0, 10),
    unit: "",
    warranty: "",
    phase: "",
    power_kw: "",
    whatsapp_number: "",
    specs: [],
    description: "",
    tagline: "",
    is_published: true,
  };

  const [form, setForm] = useState(emptyForm);
  const [original, setOriginal] = useState(null);
  const [catalog, setCatalog] = useState({ categories: [], brands: [] });
  const [categoryDefaultImage, setCategoryDefaultImage] = useState(null);
  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [history, setHistory] = useState([]);
  const [graphMode, setGraphMode] = useState("price");
  const [newPrice, setNewPrice] = useState({ price: "", internal_price: "", recorded_on: new Date().toISOString().slice(0, 10) });
  const [addingPrice, setAddingPrice] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPriceForm, setEditPriceForm] = useState({ price: "", internal_price: "", recorded_on: "" });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);
  const [trendRange, setTrendRange] = useState(30);

  const snapshotRef = useRef("");
  const snapshot = (f = form, main = mainImage, gallery = galleryImages) =>
    JSON.stringify({ f, m: main?.id ?? null, g: gallery.map((g) => g.id) });

  const hints = CATEGORY_HINTS[form.category] || CATEGORY_HINTS.default;

  useEffect(() => {
    axios.get("/api/catalog").then(({ data }) =>
      setCatalog({
        categories: data.categories.map((c) => c.name),
        brands: data.brands.map((b) => b.name),
      })
    );
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setForm(emptyForm);
      setOriginal(null);
      setHistory([]);
      setMainImage(null);
      setGalleryImages([]);
      snapshotRef.current = snapshot(emptyForm, null, []);
      return;
    }
    setLoading(true);
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        const p = res.data;
        const loaded = {
          name: p.name || "",
          slug: p.slug || "",
          category: p.category || "",
          brand: p.brand || "",
          price: p.price || "",
          internal_price: p.internal_price || "",
          price_date: new Date().toISOString().slice(0, 10),
          unit: p.unit || "",
          warranty: p.warranty || "",
          phase: p.phase || "",
          power_kw: p.power_kw ?? "",
          whatsapp_number: p.whatsapp_number || "",
          specs: p.specs || [],
          description: p.description || "",
          tagline: p.tagline || "",
          is_published: p.is_published ?? true,
        };
        const media = p.media || [];
        const main = media.find((m) => m.pivot.type === "main") || null;
        const gallery = media.filter((m) => m.pivot.type === "gallery");
        setOriginal(p);
        setForm(loaded);
        setHistory(p.price_histories || []);
        setCategoryDefaultImage(p.category_default_image || null);
        setMainImage(main);
        setGalleryImages(gallery);
        snapshotRef.current = snapshot(loaded, main, gallery);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const dirty = snapshot() !== snapshotRef.current;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSpecsChange = (value) => {
    setForm((prev) => ({ ...prev, specs: value.split("\n") }));
  };

  const addBrand = async () => {
    const name = newBrand.trim();
    if (!name) return;
    try {
      await axios.post("/api/brands", { name });
      setCatalog((prev) => ({ ...prev, brands: [...prev.brands, name].sort() }));
      setForm((prev) => ({ ...prev, brand: name }));
      setAddingBrand(false);
      setNewBrand("");
    } catch (e) {
      alert(e.response?.data?.message || "Could not add brand");
    }
  };

  const buildPayload = () => ({
    ...form,
    specs: form.specs.map((s) => s.trim()).filter(Boolean),
    price: form.price !== "" ? parseFloat(form.price) : null,
    internal_price: form.internal_price !== "" ? parseFloat(form.internal_price) : null,
    power_kw: form.power_kw !== "" ? parseFloat(form.power_kw) : null,
    phase: form.phase || null,
    main_image_id: mainImage?.id || null,
    gallery_ids: galleryImages.map((m) => m.id),
  });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        const res = await axios.put(`/api/products/${id}`, buildPayload());
        setOriginal(res.data);
        setHistory(res.data.price_histories || []);
        snapshotRef.current = snapshot();
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 2500);
      } else {
        const { data } = await axios.post("/api/products", buildPayload());
        navigate(`/store/${data.id}/edit`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const duplicate = async () => {
    if (!confirm("Duplicate this product as an unpublished copy?")) return;
    try {
      const { data } = await axios.post("/api/products", {
        ...buildPayload(),
        name: `${form.name} (Copy)`,
        slug: "",
        is_published: false,
      });
      navigate(`/store/${data.id}/edit`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to duplicate");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product permanently? Its price history is removed too.")) return;
    await axios.delete(`/api/products/${id}`);
    navigate("/store");
  };

  const openPreview = () => {
    if (original?.slug) window.open(`/store?product=${original.slug}`, "_blank");
  };

  /* ---- price history actions ---- */
  const addPricePoint = async () => {
    if (!newPrice.price) return;
    const { data } = await axios.post(`/api/products/${id}/prices`, {
      price: parseFloat(newPrice.price),
      internal_price: newPrice.internal_price !== "" ? parseFloat(newPrice.internal_price) : null,
      recorded_on: newPrice.recorded_on,
    });
    setHistory(data);
    setNewPrice({ price: "", internal_price: "", recorded_on: new Date().toISOString().slice(0, 10) });
    setAddingPrice(false);
  };

  const saveEditPrice = async () => {
    if (!editPriceForm.price) return;
    const { data } = await axios.put(`/api/products/${id}/prices/${editingPriceId}`, {
      price: parseFloat(editPriceForm.price),
      internal_price: editPriceForm.internal_price !== "" ? parseFloat(editPriceForm.internal_price) : null,
      recorded_on: editPriceForm.recorded_on,
    });
    setHistory(data);
    setEditingPriceId(null);
  };

  const deletePricePoint = async (priceId) => {
    if (!confirm("Remove this price point from the trend history?")) return;
    const { data } = await axios.delete(`/api/products/${id}/prices/${priceId}`);
    setHistory(data);
  };

  /* ---- derived ---- */
  const pairs = useMemo(
    () => (history || []).map((h) => [h.recorded_on?.slice(0, 10), Number(h.price)]),
    [history]
  );
  const internalPairs = useMemo(
    () => (history || []).filter((h) => h.internal_price != null).map((h) => [h.recorded_on?.slice(0, 10), Number(h.internal_price)]),
    [history]
  );
  const activePairs = graphMode === "internal" ? internalPairs : pairs;
  const trendPairs = useMemo(() => sliceDays(activePairs, trendRange), [activePairs, trendRange]);

  const stats30 = useMemo(() => {
    const s = sliceDays(pairs, 30);
    if (s.length === 0) return null;
    const prices = s.map((p) => p[1]);
    return {
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
      high: Math.max(...prices),
      low: Math.min(...prices),
    };
  }, [pairs]);

  const latestEntry = history.length ? history[history.length - 1] : null;

  const priceChanged =
    isEditing && original && form.price !== "" &&
    parseFloat(form.price) !== parseFloat(original.price);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* ---- Header ---- */}
      <button
        type="button"
        onClick={() => navigate("/store")}
        className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
              {mainImage ? (
                <img src={mainImage.url} alt="" className="w-full h-full object-contain p-1.5" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setPickerFor("main")}
              title="Change main image"
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#041a12] text-white flex items-center justify-center shadow hover:bg-emerald-700 transition-colors"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
          <div className="min-w-0">
            {form.category && (
              <p className="text-[11px] font-black tracking-[0.16em] uppercase text-emerald-600">
                {form.category}
              </p>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-[#041a12] leading-tight mt-0.5">
              {form.name || (isEditing ? "…" : "New Product")}
            </h1>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.category && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  {form.category}
                </span>
              )}
              {form.brand && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                  {form.brand}
                </span>
              )}
              {form.unit && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                  {form.unit}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  form.is_published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${form.is_published ? "bg-emerald-500" : "bg-gray-400"}`} />
                {form.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={openPreview}
              className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              type="button"
              onClick={duplicate}
              className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
            >
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 items-start">
          {/* ================= LEFT ================= */}
          <div className="space-y-6 min-w-0">
            {/* Product Information */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <CardHeader icon={ClipboardList} title="Product Information" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      placeholder="e.g. Goodwe 10kW 1-Ph Hybrid Inverter" className={inputCls} />
                    <Hint>Brand + capacity + type — this is what customers search for.</Hint>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Brand</label>
                    {addingBrand ? (
                      <div className="flex gap-2">
                        <input value={newBrand} autoFocus onChange={(e) => setNewBrand(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBrand(); } }}
                          placeholder="New brand name" className={inputCls} />
                        <button type="button" onClick={addBrand}
                          className="px-3 rounded-xl bg-emerald-600 text-white text-sm font-bold">Add</button>
                        <button type="button" onClick={() => setAddingBrand(false)}
                          className="px-3 rounded-xl border border-gray-200 text-gray-500 text-sm">✕</button>
                      </div>
                    ) : (
                      <select
                        name="brand"
                        value={form.brand}
                        onChange={(e) => {
                          if (e.target.value === "__add__") setAddingBrand(true);
                          else handleChange(e);
                        }}
                        className={inputCls}
                      >
                        <option value="">Select brand</option>
                        {catalog.brands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        <option value="__add__">＋ Add new brand…</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} required className={inputCls}>
                      <option value="">Select category</option>
                      {catalog.categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Hint>Manage the list in Brands &amp; Categories. Field tips adapt to your choice.</Hint>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Capacity (kW/kWh)</label>
                    <input name="power_kw" type="number" step="0.01" min="0" value={form.power_kw}
                      onChange={handleChange} placeholder="e.g. 10" className={inputCls} />
                    <Hint>{hints.power_kw} Used by the store&apos;s capacity filter and sorting.</Hint>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Phase</label>
                    <select name="phase" value={form.phase} onChange={handleChange} className={inputCls}>
                      <option value="">Not applicable</option>
                      <option value="Single Phase">Single Phase</option>
                      <option value="Three Phase">Three Phase</option>
                    </select>
                    <Hint>For inverters — customers filter by phase.</Hint>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Warranty</label>
                    <input name="warranty" value={form.warranty} onChange={handleChange}
                      placeholder="e.g. 10 Years" className={inputCls} />
                    <Hint>Shown as a badge — leave empty if none.</Hint>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Unit (display)</label>
                    <input name="unit" value={form.unit} onChange={handleChange}
                      placeholder={form.category === "Solar Panels" ? "Per Watt" : "e.g. 10kW"} className={inputCls} />
                    <Hint>{hints.unit}</Hint>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} />
                  <Hint>Leave empty to generate automatically from the name.</Hint>
                </div>
              </div>
            </div>

            {/* Price Trend */}
            {isEditing && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <CardHeader
                  icon={TrendingUp}
                  title="Price Trend"
                  right={
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                        {TREND_RANGES.map(([label, days]) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setTrendRange(days)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              trendRange === days ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => setGraphMode("price")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            graphMode === "price" ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          Price
                        </button>
                        <button
                          type="button"
                          onClick={() => setGraphMode("internal")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            graphMode === "internal" ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          Internal
                        </button>
                      </div>
                    </div>
                  }
                />
                <PriceChart history={trendPairs} unit={form.unit} color={graphMode === "internal" ? "#3b82f6" : undefined} />
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <CardHeader icon={FileText} title="Product Details" />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp Number</label>
                  <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange}
                    placeholder="Default from Settings if empty" className={inputCls} />
                  <Hint>
                    Only set this when a specific product is handled on a different number.
                    Empty = the default number from Settings. Format: 03XXXXXXXXX.
                  </Hint>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tagline</label>
                  <input name="tagline" value={form.tagline} onChange={handleChange}
                    placeholder="e.g. Best for residential & small commercial solar systems" className={inputCls} />
                  <Hint>Short line on the store card — who this product is best for. Empty = product name.</Hint>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                    placeholder="Default from Settings if empty" className={`${inputCls} resize-none`} />
                  <Hint>Empty = the default description from Settings is shown on the store.</Hint>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Specifications (one per line)</label>
                  <textarea value={form.specs.join("\n")} onChange={(e) => handleSpecsChange(e.target.value)} rows={5}
                    placeholder={hints.specsPlaceholder} className={`${inputCls} resize-none`} />
                  <Hint style={{ whiteSpace: "pre-line" }}>{hints.specs} Customers can search these on the store.</Hint>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <CardHeader icon={ImageIcon} title="Media" />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Main Image</label>
                  {mainImage ? (
                    <div className="relative inline-block">
                      <img src={mainImage.url} alt="Main" className="h-28 w-48 object-cover rounded-xl border border-gray-200" />
                      <button type="button" onClick={() => setMainImage(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setPickerFor("main")}
                      className="relative inline-block group">
                      {categoryDefaultImage ? (
                        <img src={categoryDefaultImage} alt="Default" className="h-28 w-48 object-cover rounded-xl border border-gray-200" />
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-emerald-500 hover:text-emerald-700 transition-colors">
                          <ImagePlus className="w-4 h-4" />
                          Select Main Image
                        </div>
                      )}
                      <span className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Change Image
                      </span>
                    </button>
                  )}
                  <Hint>No image? The store shows the category image from Settings (or a branded placeholder).</Hint>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Gallery Images</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img.url} alt="" className="h-24 w-32 object-cover rounded-xl border border-gray-200" />
                        <button type="button" onClick={() => setGalleryImages((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setPickerFor("gallery")}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-emerald-500 hover:text-emerald-700 transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    Add Gallery Images
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-6 min-w-0">
            {/* Live Price */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <CardHeader icon={CircleDollarSign} title="Live Price" />

              {isEditing && (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-3xl font-black text-[#041a12]">
                      {formatRs(form.price, form.unit)}
                    </p>
                    <div className="text-right">
                      {original?.trend === "up" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                          <TrendingUp className="w-3.5 h-3.5" /> {original.price_change}
                        </span>
                      )}
                      {original?.trend === "down" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <TrendingDown className="w-3.5 h-3.5" /> {original.price_change}
                        </span>
                      )}
                      {(!original?.trend || original?.trend === "stable") && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">vs last 30 days</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[11px] text-gray-400">Last Updated</p>
                      <p className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {latestEntry ? formatDateFull(latestEntry.recorded_on?.slice(0, 10)) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">Source</p>
                      <p className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800 mt-0.5 capitalize">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {latestEntry?.source || "—"}
                      </p>
                    </div>
                  </div>

                  {stats30 && (
                    <div className="grid grid-cols-3 divide-x divide-gray-100 bg-emerald-50/50 rounded-xl mt-4">
                      {[
                        ["Average (30 Days)", stats30.avg],
                        ["Highest (30 Days)", stats30.high],
                        ["Lowest (30 Days)", stats30.low],
                      ].map(([label, value]) => (
                        <div key={label} className="px-3 py-2.5">
                          <p className="text-[10px] text-gray-400 font-medium leading-tight">{label}</p>
                          <p className="text-[13px] font-black text-gray-900 mt-0.5">{formatRs(value, form.unit)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Price (Rs.)</label>
                  <input name="price" type="number" step="0.01" min="0" value={form.price}
                    onChange={handleChange} className={inputCls} />
                  <Hint>{hints.price} Shown on the store and in exports.</Hint>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Effective date</label>
                  <input name="price_date" type="date" value={form.price_date} onChange={handleChange} className={inputCls} />
                </div>
              </div>

              <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                <label className="block text-xs font-bold text-gray-600 mb-1">Internal Price (Rs.)</label>
                <input name="internal_price" type="number" step="0.01" min="0" value={form.internal_price}
                  onChange={handleChange} className={inputCls} />
                <Hint>
                  Internal use only — never shown on the store or in exports.
                  {form.price !== "" && (
                    <> Store price after 5% discount: <b>{formatRs(parseFloat(form.price) * 0.95, form.unit)}</b>.</>
                  )}
                </Hint>
              </div>

              {priceChanged && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-3">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Price change detected: {formatRs(original.price, form.unit)} → {formatRs(form.price, form.unit)}.
                    On save this is added to the price history for <b>{form.price_date}</b> and the trend updates.
                  </p>
                </div>
              )}
              {!isEditing && (
                <Hint>The first trend point for a new product is recorded on the effective date (default: today).</Hint>
              )}
            </div>

            {/* Price History */}
            {isEditing && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                <CardHeader
                  icon={Calendar}
                  title={`Price History (${history.length} entries)`}
                  right={
                    <button
                      type="button"
                      onClick={() => setAddingPrice(!addingPrice)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Entry
                    </button>
                  }
                />

                {addingPrice && (
                  <div className="flex flex-wrap items-end gap-2 mb-4 bg-gray-50 rounded-xl p-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Price (Rs.)</label>
                      <input type="number" step="0.01" min="0" value={newPrice.price} autoFocus
                        onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                        className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Internal (Rs.)</label>
                      <input type="number" step="0.01" min="0" value={newPrice.internal_price} placeholder="optional"
                        onChange={(e) => setNewPrice({ ...newPrice, internal_price: e.target.value })}
                        className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-0.5">On date</label>
                      <input type="date" value={newPrice.recorded_on}
                        onChange={(e) => setNewPrice({ ...newPrice, recorded_on: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 bg-white" />
                    </div>
                    <button type="button" onClick={addPricePoint} disabled={!newPrice.price}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold disabled:opacity-40">
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <Hint>Backfill or correct the trend — e.g. a rate from an old list with its original date.</Hint>
                  </div>
                )}

                {history.length === 0 ? (
                  <p className="text-sm text-gray-300 italic py-3">No price entries yet.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Price (Rs.)</th>
                          <th className="px-3 py-2">Internal (Rs.)</th>
                          <th className="px-3 py-2">Source</th>
                          <th className="px-3 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...history].reverse().map((h) => (
                          <tr key={h.id} className="border-b border-gray-50 last:border-0">
                            {editingPriceId === h.id ? (
                              <>
                                <td className="px-3 py-2">
                                  <input type="date" value={editPriceForm.recorded_on}
                                    onChange={(e) => setEditPriceForm({ ...editPriceForm, recorded_on: e.target.value })}
                                    className="w-full px-2 py-1 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" />
                                </td>
                                <td className="px-3 py-2">
                                  <input type="number" step="0.01" min="0" value={editPriceForm.price}
                                    onChange={(e) => setEditPriceForm({ ...editPriceForm, price: e.target.value })}
                                    className="w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" />
                                </td>
                                <td className="px-3 py-2">
                                  <input type="number" step="0.01" min="0" value={editPriceForm.internal_price} placeholder="—"
                                    onChange={(e) => setEditPriceForm({ ...editPriceForm, internal_price: e.target.value })}
                                    className="w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" />
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-400 capitalize">{h.source}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-end gap-1">
                                    <button type="button" onClick={saveEditPrice}
                                      className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 inline-flex items-center justify-center text-emerald-600">
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button type="button" onClick={() => setEditingPriceId(null)}
                                      className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 inline-flex items-center justify-center text-gray-500">
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                                  {formatDateFull(h.recorded_on?.slice(0, 10))}
                                </td>
                                <td className="px-3 py-2 font-bold text-[#041a12] whitespace-nowrap">
                                  {formatRs(h.price, form.unit)}
                                </td>
                                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                                  {h.internal_price != null ? formatRs(h.internal_price, form.unit) : "—"}
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-400 capitalize">{h.source}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingPriceId(h.id);
                                        setEditPriceForm({ price: h.price, internal_price: h.internal_price ?? "", recorded_on: h.recorded_on?.slice(0, 10) || "" });
                                      }}
                                      className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 inline-flex items-center justify-center text-blue-600"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button type="button" onClick={() => deletePricePoint(h.id)}
                                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 inline-flex items-center justify-center text-red-500">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Publishing */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <CardHeader icon={Globe} title="Publishing" />
              <label className="flex items-center justify-between cursor-pointer">
                <span>
                  <span className={`flex items-center gap-1.5 text-sm font-black ${form.is_published ? "text-emerald-700" : "text-gray-500"}`}>
                    <span className={`w-2 h-2 rounded-full ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`} />
                    {form.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    {form.is_published
                      ? "This product is visible on the store."
                      : "Hidden from the store — price history is kept."}
                  </span>
                </span>
                <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${form.is_published ? "bg-emerald-600" : "bg-gray-200"}`}>
                  <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="sr-only" />
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.is_published ? "left-[1.375rem]" : "left-0.5"}`} />
                </span>
              </label>

              {isEditing && original && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[11px] text-gray-400">Last Updated</p>
                    <p className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {original.updated_at ? formatDateFull(original.updated_at) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Created On</p>
                    <p className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {original.created_at ? formatDateFull(original.created_at) : "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- Sticky save bar ---- */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 max-w-7xl">
            <span className="flex items-center gap-2 text-[13px] font-medium text-gray-500 min-w-0">
              {savedFlash ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-bold truncate">Changes saved</span>
                </>
              ) : dirty ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">You have unsaved changes</span>
                </>
              ) : (
                <span className="text-gray-300 truncate">All changes saved</span>
              )}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => navigate("/store")}
                className="px-4 sm:px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              {isEditing && (
                <button type="button" onClick={openPreview}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" /> Preview
                </button>
              )}
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={Boolean(pickerFor)}
        onClose={() => setPickerFor(null)}
        onSelect={(file) => {
          if (pickerFor === "main") setMainImage(file);
          else if (pickerFor === "gallery") setGalleryImages((prev) => [...prev, file]);
          setPickerFor(null);
        }}
      />
    </div>
  );
}
