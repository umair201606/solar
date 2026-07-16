import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MediaPickerModal from "../../components/admin/MediaPickerModal";
import { Loader2, ImagePlus, X } from "lucide-react";

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
    price_change: "",
    trend: "stable",
    unit: "",
    specs: [],
    description: "",
    is_published: true,
  });

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);

  const categories = ["PV Solar Panels", "Off-Grid Inverters", "On-Grid Inverters", "Hybrid Inverters"];

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios
        .get(`/api/products/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name || "",
            slug: p.slug || "",
            category: p.category || "",
            brand: p.brand || "",
            price: p.price || "",
            price_change: p.price_change || "",
            trend: p.trend || "stable",
            unit: p.unit || "",
            specs: p.specs || [],
            description: p.description || "",
            is_published: p.is_published ?? true,
          });

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
    setForm((prev) => ({ ...prev, specs: value.split("\n").filter(Boolean) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
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
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

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
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Unit</label>
              <input name="unit" value={form.unit} onChange={handleChange} placeholder="e.g. watt"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Pricing</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Price ($)</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Price Change</label>
              <input name="price_change" value={form.price_change} onChange={handleChange} placeholder="e.g. +5.2%"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Trend</label>
              <select name="trend" value={form.trend} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none">
                <option value="stable">Stable</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Media</h3>

          {/* Main Image */}
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
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Gallery Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img.url} alt="" className="h-24 w-32 object-cover rounded-xl border border-gray-200" />
                  <button type="button" onClick={() => removeGalleryImage(i)}
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
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Specifications (one per line)</label>
            <textarea value={form.specs.join("\n")} onChange={(e) => handleSpecsChange(e.target.value)} rows={5} placeholder="e.g. 450W Power Output&#10;24% Efficiency&#10;12-Year Warranty"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none resize-none" />
          </div>
        </div>

        {/* Publish */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-[#d4ff00] focus:ring-[#d4ff00]" />
            <span className="text-sm font-bold text-gray-700">Published</span>
          </label>
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
