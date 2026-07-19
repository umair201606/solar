import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Loader2, ArrowLeft, Plus, Trash2, Check, ChevronUp, ChevronDown,
  AlertTriangle, Megaphone, Layers, ClipboardList, FileText, User, MapPin,
  Calendar, Info,
} from "lucide-react";
import { CRM_STATUSES, statusMeta } from "../../lib/crmStatus";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none bg-white";

function IconInput({ icon: Icon, textarea = false, ...props }) {
  const cls =
    "w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none bg-white";
  return (
    <div className="relative">
      <Icon className={`absolute left-3.5 ${textarea ? "top-3.5" : "top-1/2 -translate-y-1/2"} w-4 h-4 text-gray-400 pointer-events-none`} />
      {textarea ? <textarea className={cls} {...props} /> : <input className={cls} {...props} />}
    </div>
  );
}

function IconSelect({ icon: Icon, dot, children, ...props }) {
  return (
    <div className="relative">
      {dot ? (
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full pointer-events-none ${dot}`} />
      ) : (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
      <select
        className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none bg-white appearance-none"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

function Hint({ children }) {
  return <p className="text-[11px] text-gray-400 mt-1.5 leading-snug">{children}</p>;
}

function CardTitle({ icon: Icon, title, sub, right }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3.5 min-w-0">
        <span className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-emerald-600" />
        </span>
        <div className="min-w-0">
          <h3 className="font-black text-[#041a12] text-[15px]">{title}</h3>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

function InfoBanner({ children }) {
  return (
    <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl px-4 py-3.5">
      <span className="w-8 h-8 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0">
        <Info className="w-4 h-4 text-emerald-600" />
      </span>
      <p className="text-sm text-gray-600 leading-relaxed pt-1">{children}</p>
    </div>
  );
}

function OutlineButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
    >
      {children}
    </button>
  );
}

const emptyStage = { name: "", weight: 0, progress: 0, note: "" };

export default function CrmProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    client_id: "",
    status: "starting-soon",
    location: "",
    start_date: "",
    expected_end_date: "",
    description: "",
  });
  const [stages, setStages] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/crm/clients").then(({ data }) => setClients(data));
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    axios
      .get(`/api/crm/projects/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title || "",
          client_id: data.client_id ?? "",
          status: data.status || "starting-soon",
          location: data.location || "",
          start_date: data.start_date?.slice(0, 10) || "",
          expected_end_date: data.expected_end_date?.slice(0, 10) || "",
          description: data.description || "",
        });
        setStages((data.stages || []).map((s) => ({
          id: s.id, name: s.name, weight: s.weight, progress: s.progress, note: s.note || "",
        })));
        setTicker(data.ticker || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setStage = (index, field, value) =>
    setStages((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  const moveStage = (index, dir) =>
    setStages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const weightSum = useMemo(() => stages.reduce((sum, s) => sum + (Number(s.weight) || 0), 0), [stages]);

  const totalProgress = useMemo(() => {
    if (weightSum <= 0) return form.status === "completed" ? 100 : 0;
    const weighted = stages.reduce(
      (sum, s) => sum + (Number(s.weight) || 0) * Math.min(Number(s.progress) || 0, 100), 0
    );
    return Math.round(weighted / weightSum);
  }, [stages, weightSum, form.status]);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        client_id: form.client_id || null,
        start_date: form.start_date || null,
        expected_end_date: form.expected_end_date || null,
        ticker: ticker.filter((t) => t.trim() !== ""),
        stages: stages
          .filter((s) => s.name.trim() !== "")
          .map((s) => ({
            id: s.id ?? null,
            name: s.name,
            weight: Number(s.weight) || 0,
            progress: Number(s.progress) || 0,
            note: s.note || null,
          })),
      };
      if (isEditing) {
        await axios.put(`/api/crm/projects/${id}`, payload);
      } else {
        await axios.post("/api/crm/projects", payload);
      }
      navigate("/crm");
    } catch (e) {
      const errs = e.response?.data?.errors;
      setError(errs ? Object.values(errs).flat().join(" ") : "Could not save the project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/crm" className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#041a12]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-[#041a12]">
              {isEditing ? "Edit Client Project" : "New Client Project"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">What you save here is exactly what the assigned client sees in their portal.</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving || !form.title.trim()}
          className="flex items-center gap-2 bg-[#041a12] hover:bg-[#0a2b1f] text-white px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-40"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {isEditing ? "Save Project" : "Create Project"}
        </button>
      </div>

      {error && <p className="text-sm font-bold text-red-500">{error}</p>}

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <CardTitle icon={ClipboardList} title="Project Details" sub="Define the core information about this project." />
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#041a12] mb-1.5">Title *</label>
            <IconInput icon={FileText} value={form.title} onChange={set("title")}
              placeholder="e.g. 25kW Commercial Installation — Gulberg" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Assigned Client</label>
              <IconSelect icon={User} value={form.client_id} onChange={set("client_id")}>
                <option value="">— Not assigned yet —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
                ))}
              </IconSelect>
              <Hint>Only the assigned client sees this project in their portal.</Hint>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Status</label>
              <IconSelect dot={statusMeta(form.status).dot} value={form.status} onChange={set("status")}>
                {CRM_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </IconSelect>
              <Hint>Shown as a label on the project in the portal.</Hint>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Location</label>
              <IconInput icon={MapPin} value={form.location} onChange={set("location")} placeholder="e.g. Lahore" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#041a12] mb-1.5">Start Date</label>
                <IconInput icon={Calendar} type="date" value={form.start_date} onChange={set("start_date")} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#041a12] mb-1.5">Expected End</label>
                <IconInput icon={Calendar} type="date" value={form.expected_end_date} onChange={set("expected_end_date")} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#041a12] mb-1.5">Description</label>
            <IconInput icon={FileText} textarea rows={3} value={form.description} onChange={set("description")}
              placeholder="Scope summary the client sees — system size, panels, inverter, etc." />
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <CardTitle
          icon={Layers}
          title="Stages & Progress"
          sub="Break down the project into stages and track overall progress."
          right={
            <OutlineButton onClick={() => setStages((prev) => [...prev, { ...emptyStage }])}>
              <Plus className="w-4 h-4" /> Add Stage
            </OutlineButton>
          }
        />

        {/* Live overall progress */}
        <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded-2xl px-4 py-3.5">
          <span className="text-sm font-bold text-[#041a12] whitespace-nowrap">Overall progress</span>
          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#041a12] rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
          </div>
          <span className="text-lg font-black text-[#041a12] w-14 text-right">{totalProgress}%</span>
        </div>

        {stages.length > 0 && weightSum !== 100 && (
          <p className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Weights add up to {weightSum}% — make them total 100% so each stage's share of the project is right.
          </p>
        )}

        {stages.length === 0 ? (
          <InfoBanner>
            No stages yet — e.g. Survey (10%), Design &amp; Approval (15%), Procurement (25%),
            Installation (35%), Testing &amp; Handover (15%).
          </InfoBanner>
        ) : (
          <div className="space-y-2.5">
            {stages.map((s, i) => (
              <div key={s.id ?? `new-${i}`} className="flex flex-wrap items-end gap-2.5 bg-gray-50 rounded-2xl p-3.5">
                <div className="flex flex-col gap-0.5">
                  <button type="button" onClick={() => moveStage(i, -1)} disabled={i === 0}
                    className="text-gray-300 hover:text-[#041a12] disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                  <button type="button" onClick={() => moveStage(i, 1)} disabled={i === stages.length - 1}
                    className="text-gray-300 hover:text-[#041a12] disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Stage {i + 1} name</label>
                  <input value={s.name} onChange={(e) => setStage(i, "name", e.target.value)}
                    className={inputCls} placeholder="e.g. Installation" />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Weight %</label>
                  <input type="number" min="0" max="100" value={s.weight}
                    onChange={(e) => setStage(i, "weight", e.target.value)} className={inputCls} />
                </div>
                <div className="w-40">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Progress: {s.progress}%</label>
                  <input type="range" min="0" max="100" step="5" value={s.progress}
                    onChange={(e) => setStage(i, "progress", e.target.value)}
                    className="w-full accent-[#041a12] h-2.5 mt-2.5" />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Note (client sees this)</label>
                  <input value={s.note} onChange={(e) => setStage(i, "note", e.target.value)}
                    className={inputCls} placeholder="Optional — e.g. panels delivered" />
                </div>
                <button type="button" onClick={() => setStages((prev) => prev.filter((_, x) => x !== i))}
                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Hint>
          Weight is the stage's share of the whole project (e.g. 20% of the total). Progress is how complete that
          stage itself is. Overall progress is calculated from both automatically.
        </Hint>
      </div>

      {/* Ticker */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <CardTitle
          icon={Megaphone}
          title="Ticker Messages"
          sub="Send short updates that scroll across the client portal."
          right={
            <OutlineButton onClick={() => setTicker((prev) => [...prev, ""])}>
              <Plus className="w-4 h-4" /> Add Message
            </OutlineButton>
          }
        />
        {ticker.length === 0 ? (
          <InfoBanner>
            No messages — these scroll across the project in the client portal,
            e.g. "Net metering application submitted to LESCO".
          </InfoBanner>
        ) : (
          <div className="space-y-2.5">
            {ticker.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex-1">
                  <IconInput icon={Megaphone} value={t}
                    onChange={(e) => setTicker((prev) => prev.map((x, xi) => (xi === i ? e.target.value : x)))}
                    placeholder="Important update the client should see" />
                </div>
                <button type="button" onClick={() => setTicker((prev) => prev.filter((_, x) => x !== i))}
                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Hint>Latest news for the client — delivery updates, approvals, payment reminders. Keep each one short.</Hint>
      </div>
    </div>
  );
}
