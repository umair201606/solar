import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FolderOpen, Package, Image, Eye, MessageCircle, PhoneCall, Search, SlidersHorizontal,
} from "lucide-react";

const PERIODS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

function KpiCard({ icon: Icon, color, value, label, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-2.5`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="text-2xl font-black text-[#041a12]">
        {loading ? <div className="w-10 h-7 bg-gray-200 rounded animate-pulse" /> : value}
      </div>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

function TopList({ title, hint, rows, valueLabel, empty }) {
  const max = rows?.length ? Math.max(...rows.map((r) => r.count ?? r.n)) : 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-black text-sm text-[#041a12]">{title}</h3>
      <p className="text-xs text-gray-400 mb-3">{hint}</p>
      {!rows?.length ? (
        <p className="text-sm text-gray-300 italic py-4">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row, i) => {
            const count = row.count ?? row.n;
            return (
              <li key={i}>
                <div className="flex items-center justify-between text-sm mb-0.5">
                  <span className="font-medium text-gray-700 truncate pr-3">
                    {row.value ?? row.name}
                  </span>
                  <span className="font-bold text-[#041a12] shrink-0">
                    {count} <span className="text-[10px] text-gray-400 font-medium">{valueLabel}</span>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4ff00] rounded-full"
                    style={{ width: `${max ? (count / max) * 100 : 0}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DailyBars({ daily }) {
  if (!daily?.length) {
    return <p className="text-sm text-gray-300 italic py-6">Activity will appear once visitors use the store.</p>;
  }
  const max = Math.max(...daily.map((d) => d.views + d.calls), 1);
  return (
    <div>
      <div className="flex items-end gap-1 h-28">
        {daily.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col justify-end gap-px group relative" title={`${d.day}: ${d.views} views, ${d.calls} contacts`}>
            <div className="bg-[#041a12] rounded-t" style={{ height: `${(d.calls / max) * 100}%`, minHeight: d.calls ? 3 : 0 }} />
            <div className="bg-[#d4ff00] rounded-t" style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#d4ff00] inline-block" /> Product views</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#041a12] inline-block" /> WhatsApp + calls</span>
      </div>
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-black text-[#041a12]">Dashboard</h1>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                days === p.days ? "bg-[#041a12] text-[#d4ff00]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Store KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard icon={Eye} color="bg-emerald-500" value={t?.product_views ?? 0} label="Product views" loading={loading} />
        <KpiCard icon={MessageCircle} color="bg-green-600" value={t?.whatsapp_clicks ?? 0} label="WhatsApp contacts" loading={loading} />
        <KpiCard icon={PhoneCall} color="bg-blue-500" value={t?.call_clicks ?? 0} label="Phone calls" loading={loading} />
        <KpiCard icon={Search} color="bg-violet-500" value={t?.searches ?? 0} label="Searches" loading={loading} />
        <KpiCard icon={SlidersHorizontal} color="bg-amber-500" value={t?.filter_uses ?? 0} label="Filter uses" loading={loading} />
      </div>

      {/* Daily activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h3 className="font-black text-sm text-[#041a12]">Store activity — last {days} days</h3>
        <p className="text-xs text-gray-400 mb-4">Daily product views vs contact taps.</p>
        <DailyBars daily={analytics?.daily} />
      </div>

      {/* Top lists */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <TopList
          title="Top products by contact"
          hint="Products customers called / WhatsApped about"
          rows={analytics?.top_called_products}
          valueLabel="contacts"
          empty="No contacts yet"
        />
        <TopList
          title="Most viewed products"
          hint="Detail views on the store"
          rows={analytics?.top_viewed_products}
          valueLabel="views"
          empty="No views yet"
        />
        <TopList
          title="Brands customers filter"
          hint="Brand filter usage on the store"
          rows={analytics?.top_filtered_brands}
          valueLabel="uses"
          empty="No brand filters yet"
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
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
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
