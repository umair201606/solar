import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Loader2, MessageCircle, Phone, Trash2, ExternalLink, RefreshCw, Users,
  TrendingUp, TrendingDown, Minus, Search, Clock, ChevronDown, Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { formatRs } from "../../lib/format";
import { categoryImageFrom } from "../../lib/categoryImage";

function StatCard({ icon: Icon, tile, value, label, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-3.5">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tile}`}>
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-gray-500 font-medium">{label}</span>
        <span className="block text-2xl font-black text-[#041a12] leading-tight">{value}</span>
        <span className="block text-[11px] text-gray-400 mt-0.5">{sub}</span>
      </span>
    </div>
  );
}

export default function Leads() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [channel, setChannel] = useState("all");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchTimer = useRef(null);

  useEffect(() => {
    axios.get("/api/settings").then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  const load = (p = page) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, per_page: perPage });
    if (channel !== "all") params.set("channel", channel);
    if (q.trim()) params.set("q", q.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    axios
      .get(`/api/leads?${params}`)
      .then(({ data }) => {
        setData(data.leads);
        setStats(data.stats);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page, perPage, channel, from, to]);

  // Debounced server-side search.
  const onSearch = (value) => {
    setQ(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setPage(1); load(1); }, 500);
  };

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await axios.delete(`/api/leads/${id}`);
    load();
  };

  const todayPct = stats
    ? stats.yesterday > 0
      ? Math.round(((stats.today - stats.yesterday) / stats.yesterday) * 100)
      : stats.today > 0 ? 100 : 0
    : 0;

  const pageItems = useMemo(() => {
    const totalPages = data?.last_page || 1;
    const current = data?.current_page || 1;
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const around = [current - 1, current, current + 1].filter((p) => p > 1 && p < totalPages);
    const items = [1, ...around, totalPages];
    const out = [];
    items.forEach((p, i) => {
      if (i > 0 && p - items[i - 1] > 1) out.push("…");
      out.push(p);
    });
    return out;
  }, [data?.last_page, data?.current_page]);

  const pctOf = (n) => (stats?.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-bold text-gray-400 mb-1">
            <span className="text-emerald-600">Leads</span> › Customer Leads
          </p>
          <h1 className="text-2xl font-black text-[#041a12]">Customer Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Every WhatsApp or call tap on a store product lands here with the product link.
          </p>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            tile="bg-emerald-50 text-emerald-600"
            label="Total Leads"
            value={stats.total}
            sub="All time"
          />
          <StatCard
            icon={MessageCircle}
            tile="bg-[#25D366]/10 text-[#1fa855]"
            label="WhatsApp Leads"
            value={stats.whatsapp}
            sub={`${pctOf(stats.whatsapp)}% of total`}
          />
          <StatCard
            icon={Phone}
            tile="bg-violet-50 text-violet-600"
            label="Call Leads"
            value={stats.call}
            sub={`${pctOf(stats.call)}% of total`}
          />
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-gray-500 font-medium">Today&apos;s Leads</span>
              <span className="block text-2xl font-black text-[#041a12] leading-tight">{stats.today}</span>
              <span className={`flex items-center gap-1 text-[11px] font-bold mt-0.5 ${
                todayPct > 0 ? "text-emerald-600" : todayPct < 0 ? "text-red-500" : "text-gray-400"
              }`}>
                {todayPct > 0 ? <TrendingUp className="w-3 h-3" /> : todayPct < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                {todayPct > 0 ? "+" : ""}{todayPct}% vs yesterday
              </span>
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-2.5 px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date" value={from} onChange={(e) => changeFilter(setFrom)(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-600 outline-none focus:border-emerald-500 bg-white"
            />
            <span className="text-gray-300 text-sm">–</span>
            <input
              type="date" value={to} onChange={(e) => changeFilter(setTo)(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-600 outline-none focus:border-emerald-500 bg-white"
            />
          </div>
          <div className="relative">
            <select
              value={channel}
              onChange={(e) => changeFilter(setChannel)(e.target.value)}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-600 outline-none focus:border-emerald-500 bg-white cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Call</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative lg:w-64">
            <input
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search leads…"
              className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {loading && !data ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
          </div>
        ) : !data?.data?.length ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg font-medium">No leads found</p>
            <p className="text-sm mt-1">
              {q || channel !== "all" || from || to
                ? "Try widening the filters above."
                : "When visitors tap WhatsApp or Call on a product, it shows up here."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["When", "Product", "Channel", "Number Used", "Link", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${
                          i === 5 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((lead) => {
                    const mainImage = lead.product?.media?.find((m) => m.pivot?.type === "main");
                    const imageUrl = mainImage?.url || categoryImageFrom(settings, lead.product?.category);
                    const dt = new Date(lead.created_at);
                    return (
                      <tr key={lead.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                            <span>
                              <span className="block text-sm font-bold text-gray-800">
                                {dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <span className="block text-xs text-gray-400">
                                {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                              {imageUrl ? (
                                <img src={imageUrl} alt="" className="w-full h-full object-contain p-0.5" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-bold text-[#041a12] text-sm truncate">{lead.product_name}</span>
                              {lead.product && (
                                <span className="block text-xs text-gray-400 mt-0.5 truncate">
                                  {lead.product.category} · {formatRs(lead.product.price, lead.product.unit)}
                                </span>
                              )}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {lead.channel === "call" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
                              <Phone className="w-3 h-3" /> Call
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-700 whitespace-nowrap">{lead.phone_used}</td>
                        <td className="px-4 py-3">
                          {lead.product_url && (
                            <a
                              href={lead.product_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline whitespace-nowrap"
                            >
                              Open product <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 inline-flex items-center justify-center text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                Showing {data.from ?? 0} to {data.to ?? 0} of {data.total} lead{data.total === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(data.current_page - 1)}
                  disabled={data.current_page === 1}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-emerald-500 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                {pageItems.map((p, i) =>
                  p === "…" ? (
                    <span key={`e${i}`} className="px-1 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[2rem] h-8 px-2 rounded-lg text-sm font-bold transition-colors ${
                        p === data.current_page
                          ? "bg-emerald-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-500"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(data.current_page + 1)}
                  disabled={data.current_page === data.last_page}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-emerald-500 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="ml-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 outline-none focus:border-emerald-500"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
