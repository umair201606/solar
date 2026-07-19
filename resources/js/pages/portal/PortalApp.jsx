import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader2, LogOut, MapPin, Calendar, ChevronRight, ArrowLeft, Megaphone,
  Layers, CircleCheck, CircleX, Clock, TrendingUp, AlertTriangle, Sun,
  Briefcase, Info, MessageCircle, ClipboardList,
} from "lucide-react";
import { statusMeta } from "../../lib/crmStatus";
import { formatDateFull } from "../../lib/format";
import Footer from "../../components/Footer";

const LOGO = "/brand-logos/android-chrome-192x192.png";
const MANAGER_WHATSAPP = "https://wa.me/923066575943";

const STATUS_ICONS = {
  "starting-soon": Clock,
  "in-progress": TrendingUp,
  "delayed": AlertTriangle,
  "called-off": CircleX,
  "completed": CircleCheck,
};

/* Scrolling ticker of important project updates. */
function Ticker({ messages }) {
  if (!messages?.length) return null;
  const line = messages.join("   •   ");
  return (
    <div className="bg-[#041a12] text-white rounded-2xl overflow-hidden">
      <div className="flex items-center">
        <span className="flex items-center gap-1.5 bg-[#d4ff00] text-[#041a12] text-[11px] font-black uppercase tracking-wider px-3 py-2.5 shrink-0">
          <Megaphone className="w-3.5 h-3.5" /> Updates
        </span>
        <div className="relative flex-1 overflow-hidden py-2.5">
          <div className="portal-ticker whitespace-nowrap text-sm font-medium">
            <span className="px-6">{line}</span>
            <span className="px-6" aria-hidden="true">{line}</span>
          </div>
        </div>
      </div>
      <style>{`
        .portal-ticker { display: inline-block; animation: portal-ticker-scroll ${Math.max(messages.length * 8, 14)}s linear infinite; }
        .portal-ticker:hover { animation-play-state: paused; }
        @keyframes portal-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ status, size = "sm" }) {
  const meta = statusMeta(status);
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-full whitespace-nowrap ${meta.chip} ${
      size === "lg" ? "text-xs px-3.5 py-2" : "text-[11px] px-3 py-1.5"
    }`}>
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  );
}

function ProgressBar({ value, thick = false }) {
  return (
    <div className={`w-full ${thick ? "h-3" : "h-2"} bg-gray-200/70 rounded-full overflow-hidden`}>
      <div
        className={`h-full rounded-full transition-all ${value >= 100 ? "bg-emerald-500" : "bg-[#041a12]"}`}
        style={{ width: `${Math.min(value ?? 0, 100)}%` }}
      />
    </div>
  );
}

/* Donut showing overall completion. */
function ProgressRing({ value }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const filled = (Math.min(value ?? 0, 100) / 100) * c;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 84 84" className="w-full h-full -rotate-90">
        <circle cx="42" cy="42" r={r} fill="none" stroke="#eef1f0" strokeWidth="7" />
        <circle
          cx="42" cy="42" r={r} fill="none"
          stroke={value >= 100 ? "#10b981" : "#d4ff00"}
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-[#041a12]">
        {value ?? 0}%
      </span>
    </div>
  );
}

function PortalShell({ client, children }) {
  const handleLogout = async () => {
    await axios.post("/portal/logout");
    window.location.href = "/portal/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#041a12] text-white">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Solarkon logo" className="w-11 h-11 object-contain" />
            <div>
              <p className="text-lg font-extrabold tracking-tight leading-none">
                Solarkon<span className="text-[#d4ff00]">.</span>
              </p>
              <p className="text-[11px] text-white/50 mt-0.5">Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {client && (
              <p className="text-sm text-white/70 hidden sm:block">
                Welcome, <span className="font-bold text-[#d4ff00]">{client.name}</span>
              </p>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white border border-white/25 hover:border-white/50 px-3.5 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-7">{children}</main>
      <Footer />
    </div>
  );
}

function ProjectsList() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/portal/projects")
      .then(({ data }) => setData(data))
      .catch(() => setError("Could not load your projects. Please refresh or sign in again."));
  }, []);

  if (error) {
    return <PortalShell client={null}><p className="text-sm font-bold text-red-500 py-10 text-center">{error}</p></PortalShell>;
  }
  if (!data) {
    return (
      <PortalShell client={null}>
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      </PortalShell>
    );
  }

  return (
    <PortalShell client={data.client}>
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="w-14 h-14 rounded-2xl bg-[#041a12] flex items-center justify-center shrink-0">
          <Briefcase className="w-6 h-6 text-[#d4ff00]" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-[#041a12] leading-tight">Your Projects</h1>
          <p className="text-sm text-gray-400">
            {data.projects.length === 0
              ? "No projects have been assigned to your account yet."
              : "Live progress of every project Solarkon is running for you."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.projects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="block bg-white rounded-2xl border border-gray-100 hover:border-[#d4ff00] hover:shadow-lg hover:shadow-[#d4ff00]/10 transition-all p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-4 min-w-0">
                <span className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Sun className="w-6 h-6 text-emerald-600" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-[#041a12] leading-snug">{p.title}</h2>
                  <p className="text-xs text-gray-400 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    {p.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{p.location}</span>}
                    {p.start_date && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateFull(p.start_date)}{p.expected_end_date ? ` – ${formatDateFull(p.expected_end_date)}` : ""}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" />{p.stages.length} stage{p.stages.length === 1 ? "" : "s"}</span>
                  </p>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1"><ProgressBar value={p.total_progress} thick /></div>
              <span className="text-base font-black text-[#041a12] w-12 text-right">{p.total_progress}%</span>
              <span className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </span>
            </div>

            {p.ticker.length > 0 && (
              <p className="text-[11px] text-gray-400 truncate mt-3">
                <Megaphone className="w-3 h-3 inline-block mr-1.5 text-[#041a12]" />
                {p.ticker[0]}
              </p>
            )}
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/portal/projects").then(({ data }) => setClient(data.client)).catch(() => {});
    axios.get(`/api/portal/projects/${id}`)
      .then(({ data }) => setProject(data))
      .catch(() => setError("This project could not be found."));
  }, [id]);

  if (error) {
    return (
      <PortalShell client={client}>
        <p className="text-sm font-bold text-red-500 py-10 text-center">{error}</p>
        <button onClick={() => navigate("/")} className="mx-auto block text-sm font-bold text-[#041a12] underline">
          Back to your projects
        </button>
      </PortalShell>
    );
  }
  if (!project) {
    return (
      <PortalShell client={client}>
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      </PortalShell>
    );
  }

  return (
    <PortalShell client={client}>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-[#041a12] mb-5">
        <ArrowLeft className="w-4 h-4" /> All projects
      </Link>

      {/* Project header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-4 min-w-0">
          <span className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Sun className="w-7 h-7 text-emerald-600" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-[#041a12] leading-snug">{project.title}</h1>
            <p className="text-sm text-gray-400 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {project.location && (
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{project.location}</span>
              )}
              {project.location && project.start_date && <span className="text-gray-200">|</span>}
              {project.start_date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDateFull(project.start_date)}{project.expected_end_date ? ` – ${formatDateFull(project.expected_end_date)}` : ""}
                </span>
              )}
            </p>
          </div>
        </div>
        <StatusBadge status={project.status} size="lg" />
      </div>

      <div className="space-y-4">
        <Ticker messages={project.ticker} />

        {/* Overall progress */}
        <div className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-emerald-500 p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[220px]">
              <h2 className="text-lg font-black text-[#041a12]">Overall Progress</h2>
              <p className="text-sm text-gray-400 mt-1 mb-4">Track the overall progress of your solar project.</p>
              <ProgressBar value={project.total_progress} thick />
            </div>
            <ProgressRing value={project.total_progress} />
          </div>
          {project.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-4 whitespace-pre-line">{project.description}</p>
          )}
        </div>

        {/* Stages */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3.5 mb-5">
            <span className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
            </span>
            <div>
              <h2 className="text-lg font-black text-[#041a12]">Project Stages</h2>
              {project.stages.length === 0 && (
                <p className="text-sm text-gray-400 mt-0.5">Stages will appear here once planning is complete.</p>
              )}
            </div>
          </div>
          {project.stages.length === 0 ? (
            <div className="border-t border-dashed border-gray-200 pt-2" />
          ) : (
            <div className="space-y-5">
              {project.stages.map((s, i) => (
                <div key={s.id} className="flex gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                    s.progress >= 100 ? "bg-emerald-500 text-white" : s.progress > 0 ? "bg-[#041a12] text-[#d4ff00]" : "bg-gray-100 text-gray-400"
                  }`}>
                    {s.progress >= 100 ? <CircleCheck className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-bold text-[#041a12]">
                        {s.name}
                        <span className="ml-2 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full align-middle">
                          {s.weight}% of project
                        </span>
                      </p>
                      <span className="text-sm font-black text-[#041a12]">{s.progress}%</span>
                    </div>
                    <ProgressBar value={s.progress} />
                    {s.note && <p className="text-[11px] text-gray-400 mt-1.5">{s.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center gap-4">
          <span className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-emerald-600" />
          </span>
          <p className="flex-1 min-w-[220px] text-sm text-gray-500 leading-relaxed">
            Progress is updated by the Solarkon team.<br className="hidden sm:block" />
            Questions? Contact your project manager.
          </p>
          <a
            href={MANAGER_WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Contact Manager
          </a>
        </div>
      </div>
    </PortalShell>
  );
}

const PortalLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin w-8 h-8 border-4 border-[#d4ff00] border-t-transparent rounded-full" />
  </div>
);

export default function PortalApp() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <PortalLoader />;
  }

  return (
    <BrowserRouter basename="/portal">
      <Routes>
        <Route path="/" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="*" element={<ProjectsList />} />
      </Routes>
    </BrowserRouter>
  );
}

PortalApp.layout = (page) => page;
