import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FolderOpen, Package, Image, Eye, MessageCircle, PhoneCall, Search, SlidersHorizontal,
  TrendingUp, TrendingDown, Minus, ChevronRight,
} from "lucide-react";
import { formatDate } from "../../lib/format";

const PERIODS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

function ChangeChip({ current, previous, days }) {
  if (previous === undefined || previous === null) return null;
  const pct = previous > 0
    ? Math.round(((current - previous) / previous) * 100)
    : current > 0 ? 100 : 0;
  const up = pct > 0;
  const flat = pct === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
        flat ? "bg-gray-100 text-gray-500" : up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {flat ? <Minus className="w-3 h-3" /> : up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {flat ? "0%" : `${up ? "+" : ""}${pct}%`} vs last {days} days
    </span>
  );
}

function KpiCard({ icon: Icon, color, value, label, current, previous, days, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-black text-[#041a12] leading-none">
            {loading ? <div className="w-10 h-6 bg-gray-200 rounded animate-pulse" /> : value}
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1 truncate">{label}</p>
        </div>
      </div>
      <div className="mt-3 min-h-[1.5rem]">
        {!loading && <ChangeChip current={current} previous={previous} days={days} />}
      </div>
    </div>
  );
}

/** Dual-series area/line chart: product views (bright) vs contacts (dark). */
function ActivityChart({ daily }) {
  const W = 920, H = 230, PADL = 42, PADR = 12, PADT = 12, PADB = 26;

  const { viewsPath, viewsArea, callsPath, points, ticks } = useMemo(() => {
    if (!daily?.length) return { points: [] };
    const max = Math.max(...daily.map((d) => Math.max(d.views, d.calls)), 4);
    const niceMax = Math.ceil(max / 4) * 4;
    const x = (i) => PADL + (i / Math.max(daily.length - 1, 1)) * (W - PADL - PADR);
    const y = (v) => H - PADB - (v / niceMax) * (H - PADT - PADB);

    const path = (key) =>
      daily.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");

    return {
      viewsPath: path("views"),
      viewsArea: `${path("views")} L${x(daily.length - 1)},${H - PADB} L${x(0)},${H - PADB} Z`,
      callsPath: path("calls"),
      points: daily.map((d, i) => ({ ...d, x: x(i), yv: y(d.views), yc: y(d.calls) })),
      ticks: [0, 0.25, 0.5, 0.75, 1].map((f) => ({
        y: y(niceMax * f),
        value: Math.round(niceMax * f),
      })),
    };
  }, [daily]);

  if (!daily?.length) {
    return <p className="text-sm text-gray-300 italic py-6">Activity will appear once visitors use the store.</p>;
  }

  const labelEvery = Math.max(Math.ceil(daily.length / 6), 1);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        {ticks.map((t) => (
          <g key={t.value}>
            <line x1={PADL} x2={W - PADR} y1={t.y} y2={t.y} stroke="#eef1f0" strokeWidth="1" />
            <text x={PADL - 8} y={t.y + 3.5} textAnchor="end" fontSize="11" fill="#9ca3af" fontWeight="600">
              {t.value}
            </text>
          </g>
        ))}
        <defs>
          <linearGradient id="dash-views" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={viewsArea} fill="url(#dash-views)" />
        <path d={viewsPath} fill="none" stroke="#84cc16" strokeWidth="2" strokeLinejoin="round" />
        <path d={callsPath} fill="none" stroke="#0b3d2c" strokeWidth="2" strokeLinejoin="round" />
        {points.map((p) => (
          <g key={p.day}>
            <circle cx={p.x} cy={p.yv} r="2.4" fill="#84cc16">
              <title>{`${p.day}: ${p.views} views`}</title>
            </circle>
            <circle cx={p.x} cy={p.yc} r="2.4" fill="#0b3d2c">
              <title>{`${p.day}: ${p.calls} contacts`}</title>
            </circle>
          </g>
        ))}
        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={p.day} x={p.x} y={H - 8} textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600">
              {formatDate(p.day)}
            </text>
          ) : null
        )}
      </svg>
      <div className="flex items-center gap-5 mt-3 text-xs text-gray-500 font-medium">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] inline-block" /> Product views</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0b3d2c] inline-block" /> WhatsApp + calls</span>
      </div>
    </div>
  );
}

function TopList({ title, hint, rows, valueLabel, empty, viewAll }) {
  const max = rows?.length ? Math.max(...rows.map((r) => r.count ?? r.n)) : 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <h3 className="font-black text-sm text-[#041a12]">{title}</h3>
      <p className="text-xs text-gray-400 mb-3">{hint}</p>
      {!rows?.length ? (
        <p className="text-sm text-gray-300 italic py-4 flex-1">{empty}</p>
      ) : (
        <ul className="space-y-2.5 flex-1">
          {rows.slice(0, 3).map((row, i) => {
            const count = row.count ?? row.n;
            return (
              <li key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-bold text-gray-700 truncate pr-3">
                    {row.value ?? row.name}
                  </span>
                  <span className="font-black text-[#041a12] shrink-0">
                    {count} <span className="text-[10px] text-gray-400 font-medium">{valueLabel}</span>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#84cc16] rounded-full"
                    style={{ width: `${max ? (count / max) * 100 : 0}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {viewAll && rows?.length > 0 && (
        <Link
          to={viewAll}
          className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-emerald-600 hover:text-emerald-700"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, products: 0, media: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/projects").catch(() => ({ data: [] })),
      axios.get("/api/products").catch(() => ({ data: [] })),
      axios.get("/media").catch(() => ({ data: [] })),
    ]).then(([projects, products, media]) => {
      setStats({
        projects: projects.data.length,
        products: products.data.length,
        media: media.data.length,
      });
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/analytics/store?days=${days}`)
      .then(({ data }) => setAnalytics(data))
      .finally(() => setLoading(false));
  }, [days]);

  const t = analytics?.totals;
  const pt = analytics?.prev_totals;

  const kpis = [
    { key: "product_views", icon: Eye, color: "bg-emerald-500", label: "Product views" },
    { key: "whatsapp_clicks", icon: MessageCircle, color: "bg-[#25D366]", label: "WhatsApp contacts" },
    { key: "call_clicks", icon: PhoneCall, color: "bg-blue-500", label: "Phone calls" },
    { key: "searches", icon: Search, color: "bg-violet-500", label: "Searches" },
    { key: "filter_uses", icon: SlidersHorizontal, color: "bg-amber-500", label: "Filter uses" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#041a12]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                days === p.days ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Store KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((k) => (
          <KpiCard
            key={k.key}
            icon={k.icon}
            color={k.color}
            label={k.label}
            value={t?.[k.key] ?? 0}
            current={t?.[k.key] ?? 0}
            previous={pt?.[k.key]}
            days={days}
            loading={loading}
          />
        ))}
      </div>

      {/* Daily activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-6">
        <h3 className="font-black text-sm text-[#041a12]">Store activity — last {days} days</h3>
        <p className="text-xs text-gray-400 mb-4">Daily product views vs contact taps.</p>
        <ActivityChart daily={analytics?.daily} />
      </div>

      {/* Top lists */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <TopList
          title="Top products by contact"
          hint="Products customers called / WhatsApped about"
          rows={analytics?.top_called_products}
          valueLabel="contacts"
          empty="No contacts yet"
          viewAll="/leads"
        />
        <TopList
          title="Most viewed products"
          hint="Detail views on the store"
          rows={analytics?.top_viewed_products}
          valueLabel="views"
          empty="No views yet"
          viewAll="/store"
        />
        <TopList
          title="Brands customers filter"
          hint="Brand filter usage on the store"
          rows={analytics?.top_filtered_brands}
          valueLabel="uses"
          empty="No brand filters yet"
          viewAll="/catalog"
        />
        <TopList
          title="Top searches"
          hint="What visitors type in store search"
          rows={analytics?.top_searches}
          valueLabel="times"
          empty="No searches yet"
        />
      </div>

      {/* Content shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Projects", count: stats.projects, icon: FolderOpen, color: "bg-blue-500", to: "/projects" },
          { label: "Products", count: stats.products, icon: Package, color: "bg-emerald-500", to: "/store" },
          { label: "Media Files", count: stats.media, icon: Image, color: "bg-amber-500", to: "/media" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-black text-[#041a12]">{card.count}</div>
              <p className="text-sm text-gray-500 font-medium mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
