import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MessageCircle, Phone, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import { formatRs } from "../../lib/format";

export default function Leads() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = (p = page) => {
    setLoading(true);
    axios
      .get(`/api/leads?page=${p}`)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await axios.delete(`/api/leads/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#041a12]">Customer Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            Every WhatsApp or call tap on a store product lands here with the product link.
          </p>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
        </div>
      ) : !data?.data?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-lg font-medium">No leads yet</p>
          <p className="text-sm mt-1">When visitors tap WhatsApp or Call on a product, it shows up here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["When", "Product", "Channel", "Number Used", "Link", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleString("en-GB", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#041a12] text-sm">{lead.product_name}</p>
                      {lead.product && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {lead.product.category} · {formatRs(lead.product.price)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lead.channel === "call" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                          <Phone className="w-3 h-3" /> Call
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{lead.phone_used}</td>
                    <td className="px-4 py-3">
                      {lead.product_url && (
                        <a
                          href={lead.product_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
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
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-400">
              {data.total} lead{data.total === 1 ? "" : "s"} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={!data.prev_page_url}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={!data.next_page_url}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
