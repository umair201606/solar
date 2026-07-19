import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2, Bell, Users, Clock, Send, Zap, CalendarClock,
  CheckCircle2, AlertTriangle, Megaphone,
} from "lucide-react";

function StatCard({ icon: Icon, tile, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-3.5">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tile}`}>
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-gray-500 font-medium">{label}</span>
        <span className="block text-2xl font-black text-[#041a12] leading-tight">{value}</span>
      </span>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition shrink-0 ${on ? "bg-emerald-600" : "bg-gray-300"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`}
      />
    </button>
  );
}

function TriggerRow({ icon: Icon, label, hint, on, onToggle, children }) {
  return (
    <div className={`rounded-2xl border p-4 transition ${on ? "border-emerald-600/40 bg-emerald-600/5" : "border-gray-200"}`}>
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${on ? "bg-emerald-600/10 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
          <Icon className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#041a12]">{label}</p>
          <p className="text-xs text-gray-500 leading-snug">{hint}</p>
        </div>
        <Toggle on={on} onChange={onToggle} />
      </div>
      {on && children ? <div className="pl-[52px] mt-3">{children}</div> : null}
    </div>
  );
}

export default function PushAlerts() {
  const [data, setData] = useState(null);
  const [onChange, setOnChange] = useState(true);
  const [scheduled, setScheduled] = useState(false);
  const [time, setTime] = useState("18:00");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sending, setSending] = useState("");
  const [flash, setFlash] = useState(null); // {type, text}

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const load = () =>
    axios.get("/api/push/alerts").then(({ data }) => {
      setData(data);
      setOnChange(data.on_change);
      setScheduled(data.scheduled);
      setTime(data.time || "18:00");
    });

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await axios.put("/api/push/alerts", { on_change: onChange, scheduled, time });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      load();
    } finally {
      setSaving(false);
    }
  };

  const send = async (payload, key) => {
    setSending(key);
    setFlash(null);
    try {
      const { data: res } = await axios.post("/api/push/alerts/send", payload);
      const recips = res.recipients ?? 0;
      const sent = res.sent ?? 0;
      setFlash({
        type: "ok",
        text: recips === 0
          ? "No matching subscribers to notify right now."
          : `Sent to ${sent} of ${recips} subscriber${recips === 1 ? "" : "s"}.`,
      });
      if (key === "broadcast") { setTitle(""); setBody(""); }
      load();
    } catch (e) {
      setFlash({ type: "err", text: e?.response?.data?.message || "Failed to send." });
    } finally {
      setSending("");
    }
  };

  if (!data) {
    return (
      <div className="grid place-items-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#041a12]">Price Alerts</h1>
        <p className="text-sm text-gray-500">
          Web push notifications to store visitors when product prices change.
        </p>
      </div>

      {!data.configured && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            Push is not configured. Generate VAPID keys with{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded">php artisan webpush:vapid</code> and
            add them to your <code className="bg-amber-100 px-1.5 py-0.5 rounded">.env</code>.
          </p>
        </div>
      )}

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} tile="bg-emerald-600/10 text-emerald-600" value={data.subscribers} label="Active subscribers" />
        <StatCard icon={Bell} tile="bg-amber-500/10 text-amber-600" value={data.pending} label="Pending changes" />
        <StatCard
          icon={Clock}
          tile="bg-sky-500/10 text-sky-600"
          value={data.last_sent_at ? new Date(data.last_sent_at).toLocaleDateString() : "—"}
          label="Last sent"
        />
      </div>

      {/* delivery triggers */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 className="font-black text-[#041a12]">When to notify</h2>
          <p className="text-sm text-gray-500">
            Two independent triggers — turn on either, both, or neither.
          </p>
        </div>

        <div className="space-y-3">
          <TriggerRow
            icon={Zap}
            label="Notify on price change"
            hint="Push instantly whenever a matching product's price changes."
            on={onChange}
            onToggle={setOnChange}
          />
          <TriggerRow
            icon={CalendarClock}
            label="Scheduled daily digest"
            hint="Once a day, push a summary of that day's price changes."
            on={scheduled}
            onToggle={setScheduled}
          >
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-600">Send daily at</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
              <span className="text-xs text-gray-400">server time</span>
            </div>
          </TriggerRow>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save settings
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* manual send */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <h2 className="font-black text-[#041a12]">Send now</h2>
          <p className="text-sm text-gray-500">Push immediately, regardless of the schedule above.</p>
        </div>

        {flash && (
          <p className={`text-sm rounded-xl px-4 py-3 ${flash.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {flash.text}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pb-2 border-b border-gray-100">
          <button
            onClick={() => send({ type: "pending" }, "pending")}
            disabled={!data.configured || sending === "pending"}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2"
          >
            {sending === "pending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send {data.pending} pending change{data.pending === 1 ? "" : "s"}
          </button>
          <span className="text-xs text-gray-400">
            Notifies subscribers whose filters match a changed product.
          </span>
        </div>

        {/* custom broadcast */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-600 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-gray-400" /> Custom announcement
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="Title (e.g. Big price drop this week!)"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={180}
            rows={2}
            placeholder="Message body"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none resize-none"
          />
          <button
            onClick={() => send({ type: "broadcast", title, body }, "broadcast")}
            disabled={!data.configured || !title.trim() || !body.trim() || sending === "broadcast"}
            className="px-5 py-2.5 rounded-xl bg-[#041a12] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-40 flex items-center gap-2"
          >
            {sending === "broadcast" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
            Send to all {data.subscribers} subscribers
          </button>
        </div>
      </div>
    </div>
  );
}
