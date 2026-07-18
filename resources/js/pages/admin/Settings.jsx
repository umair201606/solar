import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Save, MessageCircle, FileText, Image as ImageIcon, Megaphone } from "lucide-react";

const FIELDS = [
  {
    key: "whatsapp_default_number",
    label: "Default WhatsApp / Call Number",
    icon: MessageCircle,
    type: "input",
    hint: "Used for every product unless a product sets its own number. Format: 03XXXXXXXXX — converted to +92 automatically for links.",
    placeholder: "e.g. 03066575943",
  },
  {
    key: "store_announcements",
    label: "Store Announcements",
    icon: Megaphone,
    type: "textarea",
    rows: 4,
    hint: "Shown in the banner on top of the store. One announcement per line — e.g. discounts, delivery info.",
    placeholder: "🎉 Exclusive discounts — call us!\n🚚 Delivery available all over Pakistan",
  },
  {
    key: "default_product_description",
    label: "Default Product Description",
    icon: FileText,
    type: "textarea",
    rows: 4,
    hint: "Shown on products that have no description of their own.",
    placeholder: "Genuine product with official warranty…",
  },
  {
    key: "default_product_image",
    label: "Default Product Image URL",
    icon: ImageIcon,
    type: "input",
    hint: "Shown on products without a photo. Paste an image URL (upload it in Media first), or leave empty for the branded placeholder.",
    placeholder: "https://…/storage/media/default.jpg",
  },
];

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-[#041a12] mb-1">Store Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Defaults applied across the store unless a product overrides them.</p>

      <div className="space-y-5">
        {FIELDS.map(({ key, label, icon: Icon, type, hint, placeholder, rows }) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-bold text-[#041a12] mb-1.5">
              <Icon className="w-4 h-4 text-gray-400" /> {label}
            </label>
            {type === "textarea" ? (
              <textarea
                rows={rows}
                value={settings[key] ?? ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none"
              />
            ) : (
              <input
                value={settings[key] ?? ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none"
              />
            )}
            <p className="text-xs text-gray-400 mt-1.5">{hint}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#c5f000] disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
        {saved && <span className="text-sm font-bold text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}
