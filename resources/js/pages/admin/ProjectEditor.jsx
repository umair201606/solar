import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MediaPickerModal from "../../components/admin/MediaPickerModal";
import { Loader2, ImagePlus, X, Plus, Trash2 } from "lucide-react";

const ICON_OPTIONS = [
  { value: "zap", label: "Zap (capacity)" },
  { value: "building", label: "Building (sector)" },
  { value: "sun", label: "Sun (solar type)" },
];

const emptyForm = {
  title: "",
  slug: "",
  detail_title: "",
  location: "",
  description: "",
  completion_date: "",
  capacity: "",
  unit: "",
  img: "",
  tags: [],
  overview: "",
  objectives: "",
  objectives_list: [],
  results: [],
  delivered: [],
  impact: "",
  gallery: [],
  testimonial_quote: "",
  testimonial_name: "",
  testimonial_role: "",
  testimonial_img: "",
  is_published: true,
  order: 0,
};

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none";

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios
        .get(`/api/projects/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            ...emptyForm,
            ...p,
            tags: p.tags || [],
            objectives_list: p.objectives_list || [],
            results: p.results || [],
            delivered: p.delivered || [],
            gallery: p.gallery || [],
            is_published: p.is_published ?? true,
            order: p.order ?? 0,
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleArrayField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value.split("\n").filter(Boolean) }));
  };

  // Tags
  const addTag = () => setForm((p) => ({ ...p, tags: [...p.tags, { icon: "zap", text: "" }] }));
  const updateTag = (i, key, val) =>
    setForm((p) => ({ ...p, tags: p.tags.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)) }));
  const removeTag = (i) => setForm((p) => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }));

  // Delivered
  const addDelivered = () =>
    setForm((p) => ({ ...p, delivered: [...p.delivered, { title: "", desc: "" }] }));
  const updateDelivered = (i, key, val) =>
    setForm((p) => ({
      ...p,
      delivered: p.delivered.map((d, idx) => (idx === i ? { ...d, [key]: val } : d)),
    }));
  const removeDelivered = (i) =>
    setForm((p) => ({ ...p, delivered: p.delivered.filter((_, idx) => idx !== i) }));

  const removeGalleryImage = (i) =>
    setForm((p) => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await axios.put(`/api/projects/${id}`, form);
      } else {
        await axios.post("/api/projects", form);
      }
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
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
        {isEditing ? "Edit Project" : "New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Basic Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Slug (auto from title if blank)</label>
              <input name="slug" value={form.slug} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Detail Title (project page heading)</label>
              <input name="detail_title" value={form.detail_title} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Completion Date</label>
              <input name="completion_date" value={form.completion_date} onChange={handleChange} placeholder="e.g. Completed / Ongoing" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Order</label>
              <input name="order" type="number" value={form.order} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#d4ff00] focus:ring-[#d4ff00]" />
                <span className="text-sm font-bold text-gray-700">Published</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Card Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
          </div>
        </div>

        {/* Hero + Tags */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Hero Image &amp; Tags</h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Hero Image</label>
            {form.img ? (
              <div className="relative inline-block">
                <img src={form.img} alt="Hero" className="h-28 w-48 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, img: "" }))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setPickerFor("hero")}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-[#d4ff00] hover:text-[#041a12] transition-colors">
                <ImagePlus className="w-4 h-4" /> Select Hero Image
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Tags (shown on the image badge)</label>
            <div className="space-y-2">
              {form.tags.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <select value={tag.icon} onChange={(e) => updateTag(i, "icon", e.target.value)} className={`${inputCls} max-w-[180px]`}>
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <input value={tag.text} onChange={(e) => updateTag(i, "text", e.target.value)} placeholder="e.g. 5 MWp" className={inputCls} />
                  <button type="button" onClick={() => removeTag(i)} className="shrink-0 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addTag} className="mt-2 flex items-center gap-1.5 text-sm font-bold text-[#041a12] hover:text-[#1a6e3a]">
              <Plus className="w-4 h-4" /> Add Tag
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Gallery</h3>
          <div className="flex flex-wrap gap-3 mb-1">
            {form.gallery.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="h-24 w-32 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => removeGalleryImage(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setPickerFor("gallery")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-[#d4ff00] hover:text-[#041a12] transition-colors">
            <ImagePlus className="w-4 h-4" /> Add Gallery Images
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Content</h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Overview</label>
            <textarea name="overview" value={form.overview} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Objectives (intro paragraph)</label>
            <textarea name="objectives" value={form.objectives} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Objectives List (one per line)</label>
            <textarea value={form.objectives_list.join("\n")} onChange={(e) => handleArrayField("objectives_list", e.target.value)} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Results (one per line)</label>
            <textarea value={form.results.join("\n")} onChange={(e) => handleArrayField("results", e.target.value)} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Impact</label>
            <textarea name="impact" value={form.impact} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
          </div>

          {/* Delivered */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">What We Delivered (cards)</label>
            <div className="space-y-2">
              {form.delivered.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <input value={d.title} onChange={(e) => updateDelivered(i, "title", e.target.value)} placeholder="Title" className={`${inputCls} max-w-[220px]`} />
                  <input value={d.desc} onChange={(e) => updateDelivered(i, "desc", e.target.value)} placeholder="Description" className={inputCls} />
                  <button type="button" onClick={() => removeDelivered(i)} className="shrink-0 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addDelivered} className="mt-2 flex items-center gap-1.5 text-sm font-bold text-[#041a12] hover:text-[#1a6e3a]">
              <Plus className="w-4 h-4" /> Add Delivered Item
            </button>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Testimonial</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Name</label>
              <input name="testimonial_name" value={form.testimonial_name} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Role</label>
              <input name="testimonial_role" value={form.testimonial_role} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Quote</label>
            <textarea name="testimonial_quote" value={form.testimonial_quote} onChange={handleChange} rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">Testimonial Image</label>
            {form.testimonial_img ? (
              <div className="relative inline-block">
                <img src={form.testimonial_img} alt="Testimonial" className="h-20 w-20 object-cover rounded-full border border-gray-200" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, testimonial_img: "" }))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setPickerFor("testimonial")}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-[#d4ff00] hover:text-[#041a12] transition-colors">
                <ImagePlus className="w-4 h-4" /> Select Testimonial Image
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-6 py-3 rounded-xl font-bold hover:bg-[#c5f000] transition-colors disabled:opacity-50">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
          </button>
          <button type="button" onClick={() => navigate("/projects")}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={Boolean(pickerFor)}
        onClose={() => setPickerFor(null)}
        onSelect={(file) => {
          const url = file.url;
          if (pickerFor === "hero") setForm((p) => ({ ...p, img: url }));
          else if (pickerFor === "testimonial") setForm((p) => ({ ...p, testimonial_img: url }));
          else if (pickerFor === "gallery") setForm((p) => ({ ...p, gallery: [...p.gallery, url] }));
          setPickerFor(null);
        }}
      />
    </div>
  );
}
