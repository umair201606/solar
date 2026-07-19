import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Loader2, Plus, Pencil, Trash2, X, Check, Briefcase, LayoutDashboard,
  CircleCheck, CircleX, ExternalLink, KeyRound, User, Mail, Lock, Phone,
  Building2, FileText, Users, CalendarClock, Calendar, TrendingUp, Sun,
  FolderOpen, ChevronRight, FolderKanban,
} from "lucide-react";
import { CRM_STATUSES, statusMeta } from "../../lib/crmStatus";
import { formatDateFull } from "../../lib/format";

/* ---------- shared design pieces (mockup language) ---------- */

const TINTS = {
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
};

function IconTile({ icon: Icon, tint = "emerald", size = "md" }) {
  return (
    <span className={`${size === "lg" ? "w-12 h-12 rounded-2xl" : "w-10 h-10 rounded-xl"} ${TINTS[tint]} flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5" />
    </span>
  );
}

function CardTitle({ icon, tint, title, sub, right }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3.5 min-w-0">
        <IconTile icon={icon} tint={tint} size="lg" />
        <div className="min-w-0">
          <h3 className="font-black text-[#041a12] text-[15px]">{title}</h3>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

function IconInput({ icon: Icon, textarea = false, className = "", ...props }) {
  const cls =
    "w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none bg-white " + className;
  return (
    <div className="relative">
      <Icon className={`absolute left-3.5 ${textarea ? "top-3.5" : "top-1/2 -translate-y-1/2"} w-4 h-4 text-gray-400 pointer-events-none`} />
      {textarea ? <textarea className={cls} {...props} /> : <input className={cls} {...props} />}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-emerald-600" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Avatar({ name }) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black flex items-center justify-center shrink-0">
      {initials}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = statusMeta(status);
  return (
    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${meta.chip}`}>
      {meta.label}
    </span>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[70px]">
        <div className="h-full bg-[#041a12] rounded-full transition-all" style={{ width: `${Math.min(value ?? 0, 100)}%` }} />
      </div>
      <span className="text-xs font-bold text-[#041a12] w-9 text-right">{value ?? 0}%</span>
    </div>
  );
}

function EmptyState({ icon: Icon, tint = "emerald", title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-5">
      <span className={`w-16 h-16 rounded-full ${TINTS[tint]} flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7" />
      </span>
      <p className="text-sm font-bold text-[#041a12]">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ChangeChip({ count }) {
  return count > 0 ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
      <TrendingUp className="w-3 h-3" /> +{count} vs last 30 days
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400">
      <TrendingUp className="w-3 h-3" /> No change
    </span>
  );
}

function KpiTile({ icon, tint, value, label, chip }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-3.5">
        <IconTile icon={icon} tint={tint} size="lg" />
        <div className="min-w-0">
          <div className="text-2xl font-black text-[#041a12] leading-none">{value}</div>
          <p className="text-xs text-gray-500 font-medium mt-1 truncate">{label}</p>
        </div>
      </div>
      <div className="mt-3 min-h-[1rem]">{chip}</div>
    </div>
  );
}

/* ---------- client modal ---------- */

const emptyClient = {
  name: "", email: "", password: "", phone: "", company: "", notes: "", is_active: true,
};

function ClientModal({ client, onClose, onSaved }) {
  const editing = Boolean(client?.id);
  const [form, setForm] = useState(
    client?.id ? { ...emptyClient, ...client, password: "" } : emptyClient
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      const { data } = editing
        ? await axios.put(`/api/crm/clients/${client.id}`, payload)
        : await axios.post("/api/crm/clients", payload);
      onSaved(data);
    } catch (e) {
      const errs = e.response?.data?.errors;
      setError(errs ? Object.values(errs).flat().join(" ") : "Could not save the client.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <IconTile icon={User} tint="emerald" size="lg" />
            <div>
              <h3 className="text-lg font-black text-[#041a12]">{editing ? "Edit Client" : "New Client"}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {editing ? "Update details or reset the portal password." : "Add a new client and share portal access."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#041a12] mb-1.5">Name *</label>
            <IconInput icon={User} value={form.name} onChange={set("name")} placeholder="e.g. Ahmad Raza" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Email (login) *</label>
              <IconInput icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="client@email.com" />
              <p className="text-[11px] text-gray-400 mt-1.5">The client signs in to the portal with this email.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Password {editing ? "" : "*"}</label>
              <IconInput icon={Lock} type="text" value={form.password} onChange={set("password")}
                placeholder={editing ? "Leave blank to keep current" : "Min 6 characters"} />
              <p className="text-[11px] text-gray-400 mt-1.5">
                {editing ? "Only fill this to reset the client's password." : "Share these credentials with the client."}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Phone</label>
              <IconInput icon={Phone} value={form.phone || ""} onChange={set("phone")} placeholder="03xx XXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#041a12] mb-1.5">Company</label>
              <IconInput icon={Building2} value={form.company || ""} onChange={set("company")} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#041a12] mb-1.5">Notes</label>
            <IconInput icon={FileText} textarea rows={2} value={form.notes || ""} onChange={set("notes")}
              placeholder="Internal notes — the client never sees these" />
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 p-4">
            <Toggle checked={form.is_active} onChange={(v) => setForm((prev) => ({ ...prev, is_active: v }))} />
            <div>
              <p className="text-sm font-bold text-[#041a12]">
                Active <span className="font-medium text-gray-500">— client can sign in to the portal</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">You can change this later at any time.</p>
            </div>
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 p-6 pt-5 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-bold text-[#041a12] border border-gray-200 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !form.name || !form.email || (!editing && form.password.length < 6)}
            className="flex items-center gap-2 bg-[#041a12] hover:bg-[#0a2b1f] text-white px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-40"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {editing ? "Save Changes" : "Create Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- insights ---------- */

function InsightsSection({ stats }) {
  if (!stats) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  const { counts } = stats;
  const new30 = stats.new_last_30 || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile icon={Briefcase} tint="emerald" value={counts.continuing} label="Continuing projects"
          chip={<ChangeChip count={new30.continuing || 0} />} />
        <KpiTile icon={CircleCheck} tint="emerald" value={counts.by_status["completed"]} label="Completed projects"
          chip={<ChangeChip count={new30.completed || 0} />} />
        <KpiTile icon={CalendarClock} tint="amber" value={counts.by_status["starting-soon"]} label="Starting soon"
          chip={<ChangeChip count={new30.starting_soon || 0} />} />
        <KpiTile icon={Users} tint="violet" value={counts.clients} label="Clients"
          chip={
            <span className="text-[11px] font-bold text-gray-400">
              {counts.active_clients} active portal account{counts.active_clients === 1 ? "" : "s"}
            </span>
          } />
      </div>

      {/* Status distribution — labeled chips, color never alone */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-black text-[#041a12] mb-3">All projects by status</h3>
        <div className="flex flex-wrap gap-2">
          {CRM_STATUSES.map((s) => (
            <span key={s.id} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${s.chip}`}>
              {s.label}
              <span className="opacity-70">{counts.by_status[s.id] ?? 0}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Continuing projects progress */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-[#041a12]">Continuing projects progress</h3>
        </div>
        {stats.continuing_projects.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No projects are currently in progress."
            sub="Once projects are active, their progress will appear here." />
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.continuing_projects.map((p) => (
              <Link key={p.id} to={`/crm/projects/${p.id}/edit`}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                <div className="min-w-[200px] flex-1">
                  <p className="text-sm font-bold text-[#041a12]">{p.title}</p>
                  <p className="text-xs text-gray-400">
                    {p.client || "No client assigned"}
                    {p.expected_end_date ? ` · due ${formatDateFull(p.expected_end_date)}` : ""}
                  </p>
                </div>
                <StatusBadge status={p.status} />
                <ProgressBar value={p.total_progress} className="w-48" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Starting soon */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <IconTile icon={Calendar} tint="blue" />
            <h3 className="text-sm font-black text-[#041a12]">Starting soon</h3>
          </div>
          {stats.upcoming_projects.length === 0 ? (
            <EmptyState icon={Calendar} tint="blue" title="Nothing queued up."
              sub="Projects with the Starting Soon status appear here." />
          ) : (
            <div className="space-y-2.5">
              {stats.upcoming_projects.map((p) => (
                <Link key={p.id} to={`/crm/projects/${p.id}/edit`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 hover:border-[#d4ff00] p-3.5 transition-colors">
                  <IconTile icon={Sun} tint="blue" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#041a12] truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.client || "No client assigned"}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    {p.start_date ? `Starts ${formatDateFull(p.start_date)}` : "No date yet"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recently completed */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <IconTile icon={CircleCheck} tint="emerald" />
            <h3 className="text-sm font-black text-[#041a12]">Recently completed</h3>
          </div>
          {stats.recently_completed.length === 0 ? (
            <EmptyState icon={Check} title="No completed projects yet."
              sub="Completed projects will appear here." />
          ) : (
            <div className="space-y-2.5">
              {stats.recently_completed.map((p) => (
                <Link key={p.id} to={`/crm/projects/${p.id}/edit`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 hover:border-[#d4ff00] p-3.5 transition-colors">
                  <IconTile icon={CircleCheck} tint="emerald" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#041a12] truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.client || "No client assigned"}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function Crm() {
  const [tab, setTab] = useState("manage");
  const [clients, setClients] = useState(null);
  const [projects, setProjects] = useState(null);
  const [stats, setStats] = useState(null);
  const [clientModal, setClientModal] = useState(null); // null | {} | client

  const load = () => {
    axios.get("/api/crm/clients").then(({ data }) => setClients(data));
    axios.get("/api/crm/projects").then(({ data }) => setProjects(data));
    axios.get("/api/crm/dashboard").then(({ data }) => setStats(data));
  };

  useEffect(load, []);

  const onClientSaved = (saved) => {
    setClients((prev) => {
      const exists = prev?.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...(prev || [])];
    });
    setClientModal(null);
    axios.get("/api/crm/dashboard").then(({ data }) => setStats(data));
  };

  const deleteClient = async (client) => {
    if (!confirm(`Delete client "${client.name}"? Their projects stay but become unassigned, and their portal login stops working.`)) return;
    await axios.delete(`/api/crm/clients/${client.id}`);
    load();
  };

  const deleteProject = async (project) => {
    if (!confirm(`Delete project "${project.title}" and all its stages? The client will no longer see it.`)) return;
    await axios.delete(`/api/crm/projects/${project.id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header + tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#041a12]">CRM</h1>
          <p className="text-sm text-gray-400">Client portal accounts, their projects, and progress insights.</p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {[["manage", "Clients & Projects", Briefcase], ["insights", "Insights", LayoutDashboard]].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                tab === id ? "bg-[#041a12] text-white" : "text-gray-500 hover:text-[#041a12]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "insights" ? (
        <InsightsSection stats={stats} />
      ) : (
        <div className="space-y-5">
          {/* Clients */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <CardTitle
                icon={Users}
                tint="emerald"
                title="Clients"
                sub="Portal login credentials — share the portal link and these credentials directly with the client."
                right={
                  <button
                    onClick={() => setClientModal({})}
                    className="flex items-center gap-1.5 bg-[#041a12] hover:bg-[#0a2b1f] text-white px-4 py-2.5 rounded-xl text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" /> Add Client
                  </button>
                }
              />
            </div>
            {!clients ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : clients.length === 0 ? (
              <EmptyState icon={Users} title="No clients yet."
                sub="Add one to give them portal access." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {["Client", "Login Email", "Phone", "Projects", "Portal Access", "Actions"].map((h, i) => (
                        <th key={h} className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={c.name} />
                            <div>
                              <p className="text-sm font-bold text-[#041a12]">{c.name}</p>
                              {c.company && <p className="text-xs text-gray-400">{c.company}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{c.phone || "—"}</td>
                        <td className="px-4 py-3 text-sm font-bold text-[#041a12]">{c.crm_projects_count}</td>
                        <td className="px-4 py-3">
                          {c.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <CircleCheck className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                              <CircleX className="w-3 h-3" /> Disabled
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setClientModal(c)} title="Edit client / reset password"
                              className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 inline-flex items-center justify-center text-blue-600">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteClient(c)} title="Delete client"
                              className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 inline-flex items-center justify-center text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <CardTitle
                icon={FolderOpen}
                tint="violet"
                title="Client Projects"
                sub="Each project's stages, weights and progress are edited inside the project."
                right={
                  <Link
                    to="/crm/projects/new"
                    className="flex items-center gap-1.5 bg-[#d4ff00] hover:bg-[#c5f000] text-[#041a12] px-4 py-2.5 rounded-xl text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </Link>
                }
              />
            </div>
            {!projects ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : projects.length === 0 ? (
              <EmptyState icon={FolderOpen} tint="violet" title="No client projects yet."
                sub="Create one and assign it to a client." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {["Project", "Client", "Status", "Progress", "Stages", "Timeline", "Actions"].map((h, i) => (
                        <th key={h} className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <Link to={`/crm/projects/${p.id}/edit`} className="text-sm font-bold text-[#041a12] hover:underline">
                            {p.title}
                          </Link>
                          {p.location && <p className="text-xs text-gray-400">{p.location}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {p.client?.name || <span className="text-gray-300 italic">Unassigned</span>}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3 min-w-[150px]"><ProgressBar value={p.total_progress} /></td>
                        <td className="px-4 py-3 text-sm text-gray-500">{p.stages?.length ?? 0}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {(p.start_date || p.expected_end_date) ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {p.start_date ? formatDateFull(p.start_date) : "…"}
                              {p.expected_end_date ? ` → ${formatDateFull(p.expected_end_date)}` : ""}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link to={`/crm/projects/${p.id}/edit`} title="Edit project"
                              className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 inline-flex items-center justify-center text-blue-600">
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteProject(p)} title="Delete project"
                              className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 inline-flex items-center justify-center text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Portal link banner */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-5 flex flex-wrap items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-emerald-600" />
            </span>
            <div className="flex-1 min-w-[220px]">
              <p className="text-sm font-black text-[#041a12]">Client portal link</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Not shown anywhere on the website — share it directly with clients along with their credentials.
              </p>
            </div>
            <a href="/portal/login" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold text-[#041a12] bg-white border border-emerald-200 hover:border-emerald-400 px-4 py-2.5 rounded-xl">
              /portal/login <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {clientModal !== null && (
        <ClientModal
          client={clientModal.id ? clientModal : null}
          onClose={() => setClientModal(null)}
          onSaved={onClientSaved}
        />
      )}
    </div>
  );
}
