import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Trash2, Download, ExternalLink, ShieldCheck, ShieldOff, Loader2, QrCode } from "lucide-react";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrView, setQrView] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("/api/certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to load certificates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate? The verification link will stop working.")) return;
    try {
      await axios.delete(`/api/certificates/${id}`);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRevoke = async (id) => {
    try {
      const res = await axios.post(`/api/certificates/${id}/revoke`);
      setCertificates((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#041a12]">Certificates</h1>
        <Link
          to="/certificates/new"
          className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c5f000] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Issue Certificate
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-lg font-medium">No certificates yet</p>
          <p className="text-sm mt-1">Issue your first building fitness certificate.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#041a12] text-sm">{c.reference}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.certificate_type}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700 font-medium">{c.client_name}</p>
                    <p className="text-xs text-gray-400">{c.address}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">{c.issue_date}</td>
                  <td className="px-5 py-4">
                    {c.status === "valid" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" /> Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                        <ShieldOff className="w-3.5 h-3.5" /> Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setQrView(c)} title="Show QR"
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                        <QrCode className="w-4 h-4" />
                      </button>
                      <a href={c.verify_url} target="_blank" rel="noreferrer" title="Open verify page"
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a href={`/verify/${c.uuid}/download`} title="Download PDF"
                        className="w-8 h-8 rounded-lg bg-[#d4ff00]/20 hover:bg-[#d4ff00]/40 flex items-center justify-center text-[#041a12] transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                      <button onClick={() => toggleRevoke(c.id)} title={c.status === "valid" ? "Revoke" : "Restore"}
                        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
                        {c.status === "valid" ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(c.id)} title="Delete"
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
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

      {/* QR modal */}
      {qrView && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setQrView(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-[#041a12] mb-1">{qrView.reference}</h3>
            <p className="text-sm text-gray-500 mb-4">{qrView.client_name}</p>
            <img src={qrView.qr} alt="QR" className="w-56 h-56 mx-auto" />
            <p className="text-xs text-gray-400 mt-3 break-all">{qrView.verify_url}</p>
            <div className="flex gap-2 mt-5">
              <a href={`/verify/${qrView.uuid}/download`}
                className="flex-1 bg-[#d4ff00] text-[#041a12] font-bold py-2.5 rounded-xl text-sm hover:bg-[#c5f000] transition-colors">
                Download PDF
              </a>
              <button onClick={() => setQrView(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
