import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MediaPickerModal from "../../components/admin/MediaPickerModal";
import {
  Loader2, ImagePlus, X, Plus, Trash2, TrendingUp, TrendingDown, Minus, Info,
} from "lucide-react";
import { Sparkline } from "../../components/store/PriceCharts";
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
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none";

function Hint({ children, style }) {
  return <p className="text-[11px] text-gray-400 mt-1 leading-snug" style={style}>{children}</p>;
}

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    brand: "",
    price: "",
    price_date: new Date().toISOString().slice(0, 10),
    unit: "",
    warranty: "",
    phase: "",
    power_kw: "",
    whatsapp_number: "",
    specs: [],
    description: "",
    is_published: true,
  });

  const [original, setOriginal] = useState(null);
  const [catalog, setCatalog] = useState({ categories: [], brands: [] });
  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [history, setHistory] = useState([]);
  const [newPrice, setNewPrice] = useState({ price: "", recorded_on: new Date().toISOString().slice(0, 10) });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);

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
    if (isEditing) {
      setLoading(true);
      axios
        .get(`/api/products/${id}`)
        .then((res) => {
          const p = res.data;
          setOriginal(p);
          setForm({
            name: p.name || "",
            slug: p.slug || "",
            category: p.category || "",
            brand: p.brand || "",
            price: p.price || "",
            price_date: new Date().toISOString().slice(0, 10),
            unit: p.unit || "",
            warranty: p.warranty || "",
            phase: p.phase || "",
            power_kw: p.power_kw ?? "",
            whatsapp_number: p.whatsapp_number || "",
            specs: p.specs || [],
            description: p.description || "",
            is_published: p.is_published ?? true,
          });
          setHistory(p.price_histories || []);
          const media = p.media || [];
          setMainImage(media.find((m) => m.pivot.type === "main") || null);
          setGalleryImages(media.filter((m) => m.pivot.type === "gallery"));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      specs: form.specs.map((s) => s.trim()).filter(Boolean),
      price: form.price !== "" ? parseFloat(form.price) : null,
      power_kw: form.power_kw !== "" ? parseFloat(form.power_kw) : null,
      phase: form.phase || null,
      main_image_id: mainImage?.id || null,
      gallery_ids: galleryImages.map((m) => m.id),
    };

    try {
      if (isEditing) {
        await axios.put(`/api/products/${id}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }
      navigate("/store");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const addPricePoint = async () => {
    if (!newPrice.price) return;
    const { data } = await axios.post(`/api/products/${id}/prices`, {
      price: parseFloat(newPrice.price),
      recorded_on: newPrice.recorded_on,
    });
    setHistory(data);
    setNewPrice({ price: "", recorded_on: new Date().toISOString().slice(0, 10) });
  };

  const deletePricePoint = async (priceId) => {
    if (!confirm("Remove this price point from the trend history?")) return;
    const { data } = await axios.delete(`/api/products/${id}/prices/${priceId}`);
    setHistory(data);
  };

  const priceChanged =
    isEditing && original && form.price !== "" &&
    parseFloat(form.price) !== parseFloat(original.price);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#041a12] mb-6">
        {isEditing ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Basic Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="e.g. Goodwe 10kW 1-Ph Hybrid Inverter" className={inputCls} />
              <Hint>Brand + capacity + type — this is what customers search for.</Hint>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} />
              <Hint>Leave empty to generate automatically from the name.</Hint>
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
              <Hint>Manage the list in Brands &amp; Categories. Field tips below adapt to your choice.</Hint>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Brand</label>
              {addingBrand ? (
                <div className="flex gap-2">
                  <input value={newBrand} autoFocus onChange={(e) => setNewBrand(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBrand(); } }}
                    placeholder="New brand name" className={inputCls} />
                  <button type="button" onClick={addBrand}
                    className="px-3 rounded-xl bg-[#d4ff00] text-[#041a12] text-sm font-bold">Add</button>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Capacity (display)</label>
              <input name="unit" value={form.unit} onChange={handleChange}
                placeholder={form.category === "Solar Panels" ? "Per Watt" : "e.g. 10kW"} className={inputCls} />
              <Hint>{hints.unit}</Hint>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Capacity (number)</label>
              <input name="power_kw" type="number" step="0.01" min="0" value={form.power_kw}
                onChange={handleChange} placeholder="e.g. 10" className={inputCls} />
              <Hint>{hints.power_kw} Used by the store&apos;s capacity filter and sorting.</Hint>
            </div>
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
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Pricing</h3>
            {isEditing && original && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                {original.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-red-500" />}
                {original.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-green-600" />}
                {(!original.trend || original.trend === "stable") && <Minus className="w-3.5 h-3.5" />}
                {original.price_change || "Stable"} · trend is calculated automatically from history
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Price (Rs.)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price}
                onChange={handleChange} className={inputCls} />
              <Hint>{hints.price}</Hint>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Price effective date</label>
              <input name="price_date" type="date" value={form.price_date} onChange={handleChange} className={inputCls} />
              <Hint>
                {isEditing
                  ? "If you change the price, it's recorded in the trend history on this date (default: today)."
                  : "The first trend point for a new product is recorded on this date (default: today)."}
              </Hint>
            </div>
          </div>

          {priceChanged && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                Price change detected: {formatRs(original.price, form.unit)} → {formatRs(form.price, form.unit)}.
                On save this is added to the price history for <b>{form.price_date}</b> and the trend updates.
              </p>
            </div>
          )}

          {/* Price history */}
          {isEditing && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-gray-600">
                  Price history ({history.length} points)
                </label>
                <Sparkline
                  history={history.map((h) => [h.recorded_on?.slice(0, 10), Number(h.price)])}
                  trend={original?.trend}
                  width={140}
                  height={32}
                />
              </div>

              <div className="flex flex-wrap items-end gap-2 mb-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Add price (Rs.)</label>
                  <input type="number" step="0.01" min="0" value={newPrice.price}
                    onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                    className="w-32 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#d4ff00]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-0.5">On date</label>
                  <input type="date" value={newPrice.recorded_on}
                    onChange={(e) => setNewPrice({ ...newPrice, recorded_on: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#d4ff00]" />
                </div>
                <button type="button" onClick={addPricePoint} disabled={!newPrice.price}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#041a12] text-[#d4ff00] text-sm font-bold disabled:opacity-40">
                  <Plus className="w-4 h-4" /> Add point
                </button>
              </div>
              <Hint>Backfill or correct the trend — e.g. a rate from an old WhatsApp list with its original date.</Hint>

              {history.length > 0 && (
                <div className="mt-3 max-h-52 overflow-y-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-sm">
                    <tbody>
                      {[...history].reverse().map((h) => (
                        <tr key={h.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-3 py-2 text-gray-500">{formatDateFull(h.recorded_on?.slice(0, 10))}</td>
                          <td className="px-3 py-2 font-bold text-[#041a12]">{formatRs(h.price, form.unit)}</td>
                          <td className="px-3 py-2 text-xs text-gray-400">{h.source}</td>
                          <td className="px-3 py-2 text-right">
                            <button type="button" onClick={() => deletePricePoint(h.id)}
                              className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 inline-flex items-center justify-center text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Contact</h3>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp / call number for this product</label>
            <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange}
              placeholder="Leave empty to use the default number" className={inputCls} />
            <Hint>
              Only set this when a specific product is handled on a different number.
              Empty = the default number from Settings. Format: 03XXXXXXXXX.
            </Hint>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Media</h3>

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
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-[#d4ff00] hover:text-[#041a12] transition-colors">
                <ImagePlus className="w-4 h-4" />
                Select Main Image
              </button>
            )}
            <Hint>No image? The store shows the default image from Settings (or a branded placeholder).</Hint>
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
              className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-[#d4ff00] hover:text-[#041a12] transition-colors">
              <ImagePlus className="w-4 h-4" />
              Add Gallery Images
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Details</h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Leave empty to use the default description from Settings" className={`${inputCls} resize-none`} />
            <Hint>Empty = the default description from Settings is shown on the store.</Hint>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Specifications (one per line)</label>
            <textarea value={form.specs.join("\n")} onChange={(e) => handleSpecsChange(e.target.value)} rows={5}
              placeholder={hints.specsPlaceholder} className={`${inputCls} resize-none`} />
            <Hint style={{ whiteSpace: "pre-line" }}>{hints.specs} Customers can search these on the store.</Hint>
          </div>
        </div>

        {/* Publish */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-[#d4ff00] focus:ring-[#d4ff00]" />
            <span className="text-sm font-bold text-gray-700">Published</span>
          </label>
          <Hint>Unpublished products stay hidden from the store but keep their price history.</Hint>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-6 py-3 rounded-xl font-bold hover:bg-[#c5f000] transition-colors disabled:opacity-50">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/store")}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
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
