import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Loader2, Save, MessageCircle, FileText, Image as ImageIcon, Megaphone,
  Upload, Trash2, Battery, Zap, Sun, HelpCircle, Check, Package,
} from "lucide-react";
import MediaPickerModal from "../../components/admin/MediaPickerModal";

const IMAGE_FIELDS = [
  {
    key: "category_image_batteries",
    icon: Battery,
    label: "Batteries",
    hint: "Card image for battery products",
  },
  {
    key: "category_image_inverters",
    icon: Zap,
    label: "Inverters",
    hint: "Card image for inverter products",
  },
  {
    key: "category_image_panels",
    icon: Sun,
    label: "Solar Panels",
    hint: "Card image for solar panel products",
  },
  {
    key: "default_product_image",
    icon: Package,
    label: "Fallback (all categories)",
    hint: "Used when no category image matches",
  },
];

const SECTIONS = [
  { id: "images", icon: ImageIcon, label: "Images", sub: "Default images for products" },
  { id: "contact", icon: MessageCircle, label: "Contact & Communication", sub: "WhatsApp number & announcements" },
  { id: "product-info", icon: FileText, label: "Product Information", sub: "Default product description" },
];

function SectionCard({ id, icon: Icon, title, subtitle, children, innerRef }) {
  return (
    <div ref={innerRef} id={id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 scroll-mt-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-emerald-600" />
        </span>
        <div>
          <h2 className="font-black text-[15px] text-[#041a12]">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [active, setActive] = useState("images");
  const [pickerFor, setPickerFor] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    axios.get("/api/settings").then(({ data }) => setSettings(data));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await axios.put("/api/settings", { settings });
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const goTo = (id) => {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  const set = (key, value) => setSettings({ ...settings, [key]: value });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-bold text-gray-400 mb-1">Settings</p>
          <h1 className="text-2xl font-black text-[#041a12]">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5 max-w-2xl">
            Manage your store defaults and preferences. These settings apply across the
            store unless overridden at the product level.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60 transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved" : "Save Settings"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* ---- Section nav ---- */}
        <div className="hidden lg:block sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400 px-2 mb-2">
              Setting Sections
            </p>
            <div className="space-y-1">
              {SECTIONS.map(({ id, icon: Icon, label, sub }) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border-l-2 ${
                    active === id
                      ? "bg-emerald-50 border-emerald-600"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    active === id ? "bg-white" : "bg-gray-50"
                  }`}>
                    <Icon className={`w-4 h-4 ${active === id ? "text-emerald-600" : "text-gray-400"}`} />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[13px] font-bold truncate ${active === id ? "text-emerald-800" : "text-gray-700"}`}>
                      {label}
                    </span>
                    <span className="block text-[11px] text-gray-400 truncate">{sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
            <HelpCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-black text-gray-800">Need help?</p>
              <p className="text-xs text-gray-400 leading-snug mt-0.5">
                Image defaults show on product cards without photos; contact defaults
                power WhatsApp and call buttons.
              </p>
            </div>
          </div>
        </div>

        {/* ---- Sections ---- */}
        <div className="space-y-6 min-w-0">
          <SectionCard
            id="images"
            innerRef={(el) => (sectionRefs.current.images = el)}
            icon={ImageIcon}
            title="Default Images"
            subtitle="Set default images for products when no image is uploaded."
          >
            <div className="divide-y divide-gray-50">
              {IMAGE_FIELDS.map(({ key, icon: Icon, label, hint }) => (
                <div key={key} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-emerald-600" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-gray-800">{label}</span>
                      <span className="block text-[11px] text-gray-400 truncate">{hint}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {settings[key] ? (
                      <img
                        src={settings[key]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                    ) : null}
                    <input
                      value={settings[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder="No image set — click Change to pick one"
                      className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setPickerFor(key)}
                      className="flex items-center gap-1.5 border border-gray-200 bg-white px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-gray-600 hover:border-emerald-500 hover:text-emerald-700 transition-colors shrink-0"
                    >
                      <Upload className="w-4 h-4" /> Change
                    </button>
                    <button
                      type="button"
                      onClick={() => set(key, "")}
                      title="Clear image"
                      className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="contact"
            innerRef={(el) => (sectionRefs.current.contact = el)}
            icon={MessageCircle}
            title="Contact & Communication"
            subtitle="Manage your store contact details and announcements."
          >
            <div className="space-y-5">
              <div className="grid sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 sm:items-start">
                <div>
                  <p className="text-sm font-bold text-gray-800">Default WhatsApp / Call Number</p>
                  <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                    Used for every product unless a product sets its own number.
                  </p>
                </div>
                <div>
                  <input
                    value={settings.whatsapp_default_number ?? ""}
                    onChange={(e) => set("whatsapp_default_number", e.target.value)}
                    placeholder="e.g. 03066575943"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Format: 03XXXXXXXXX — converted to +92 automatically for links.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 sm:items-start">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                    <Megaphone className="w-3.5 h-3.5 text-gray-400" /> Store Announcements
                  </p>
                  <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                    Shown in the banner on top of the store. One announcement per line.
                  </p>
                </div>
                <textarea
                  rows={4}
                  value={settings.store_announcements ?? ""}
                  onChange={(e) => set("store_announcements", e.target.value)}
                  placeholder={"🎉 Exclusive discounts — call us!\n🚚 Delivery available all over Pakistan"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="product-info"
            innerRef={(el) => (sectionRefs.current["product-info"] = el)}
            icon={FileText}
            title="Product Information"
            subtitle="Set default description for products."
          >
            <div className="grid sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 sm:items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">Default Product Description</p>
                <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                  Shown on products that have no description of their own.
                </p>
              </div>
              <textarea
                rows={4}
                value={settings.default_product_description ?? ""}
                onChange={(e) => set("default_product_description", e.target.value)}
                placeholder="Genuine product with official warranty…"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </SectionCard>
        </div>
      </div>

      <MediaPickerModal
        isOpen={Boolean(pickerFor)}
        onClose={() => setPickerFor(null)}
        onSelect={(file) => {
          if (pickerFor) set(pickerFor, file.url);
          setPickerFor(null);
        }}
      />
    </div>
  );
}
