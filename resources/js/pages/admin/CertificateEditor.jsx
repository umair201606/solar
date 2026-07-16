import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle2, Download, ExternalLink, ArrowLeft, Check, X } from "lucide-react";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none";

export default function CertificateEditor() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    certificate_type: "Building Fitness Certificate",
    reference: "",
    issue_date: today,
    client_name: "",
    address: "",
    valid_years: 2,
  });
  const [saving, setSaving] = useState(false);
  const [issued, setIssued] = useState(null);
  const [refStatus, setRefStatus] = useState(null); // null | "checking" | "available" | "taken"

  // Suggest the next reference number for the selected date's year.
  useEffect(() => {
    if (form.reference) return;
    axios
      .get("/api/certificates/next-ref", { params: { date: form.issue_date } })
      .then((res) => setForm((p) => (p.reference ? p : { ...p, reference: res.data.reference })))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.issue_date]);

  // Debounced uniqueness check for the reference number.
  useEffect(() => {
    const ref = form.reference.trim();
    if (!ref) {
      setRefStatus(null);
      return;
    }
    setRefStatus("checking");
    const t = setTimeout(() => {
      axios
        .get("/api/certificates/check-ref", { params: { reference: ref } })
        .then((res) => setRefStatus(res.data.available ? "available" : "taken"))
        .catch(() => setRefStatus(null));
    }, 450);
    return () => clearTimeout(t);
  }, [form.reference]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post("/api/certificates", form);
      setIssued(res.data);
    } catch (err) {
      if (err.response?.status === 422) {
        const msg = err.response.data?.errors?.reference?.[0];
        if (msg) {
          setRefStatus("taken");
          alert(msg);
        } else {
          alert("Please check the form and try again.");
        }
      } else {
        console.error(err);
        alert("Failed to issue certificate");
      }
    } finally {
      setSaving(false);
    }
  };

  // ---- Success screen ----
  if (issued) {
    return (
      <div className="max-w-xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-[#041a12]">Certificate Issued</h1>
          <p className="text-gray-500 text-sm mt-1">
            {issued.reference} · {issued.client_name}
          </p>

          <img src={issued.qr} alt="Verification QR" className="w-52 h-52 mx-auto mt-6" />
          <p className="text-xs text-gray-400 mt-2 break-all">{issued.verify_url}</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <a
              href={`/verify/${issued.uuid}/download`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#d4ff00] text-[#041a12] font-bold py-3 rounded-xl text-sm hover:bg-[#c5f000] transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
            <a
              href={issued.verify_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Verify Page
            </a>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => {
                setIssued(null);
                setForm({ certificate_type: "Building Fitness Certificate", reference: "", issue_date: today, client_name: "", address: "", valid_years: 2 });
              }}
              className="flex-1 text-sm font-bold text-[#041a12] py-2 hover:underline"
            >
              Issue Another
            </button>
            <button onClick={() => navigate("/certificates")} className="flex-1 text-sm font-bold text-gray-500 py-2 hover:underline">
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Form ----
  return (
    <div>
      <button onClick={() => navigate("/certificates")} className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#041a12] mb-4">
        <ArrowLeft className="w-4 h-4" /> Certificates
      </button>
      <h1 className="text-2xl font-black text-[#041a12] mb-6">Issue Certificate</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Certificate Details</h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Certificate Type</label>
            <input name="certificate_type" value={form.certificate_type} onChange={handleChange} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Date *</label>
              <input type="date" name="issue_date" value={form.issue_date} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Reference No.</label>
              <div className="relative">
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  placeholder="SK/BFC/2026/0011"
                  className={`${inputCls} pr-9 ${
                    refStatus === "taken"
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : refStatus === "available"
                        ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                        : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {refStatus === "checking" && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                  {refStatus === "available" && <Check className="w-4 h-4 text-green-600" />}
                  {refStatus === "taken" && <X className="w-4 h-4 text-red-500" />}
                </span>
              </div>
              {refStatus === "taken" && (
                <p className="text-xs font-medium text-red-500 mt-1">This reference number is already used. Choose another.</p>
              )}
              {refStatus === "available" && (
                <p className="text-xs font-medium text-green-600 mt-1">Reference number is available.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Client / School Name *</label>
            <input name="client_name" value={form.client_name} onChange={handleChange} required placeholder="e.g. Jamali School" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. 349-15-B1 Township Lahore" className={inputCls} />
          </div>

          <div className="max-w-[180px]">
            <label className="block text-xs font-bold text-gray-600 mb-1">Valid For (years)</label>
            <input type="number" name="valid_years" value={form.valid_years} onChange={handleChange} min={1} max={50} className={inputCls} />
          </div>
        </div>

        <div className="bg-[#041a12]/[0.03] border border-[#041a12]/10 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed">
          The header, certified body text, engineer details, signature, stamp and footer are fixed.
          A unique QR code linking to a public verification page is generated automatically on issue.
        </div>

        <div className="flex items-center gap-3 pb-8">
          <button type="submit" disabled={saving || refStatus === "taken" || refStatus === "checking"}
            className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-6 py-3 rounded-xl font-bold hover:bg-[#c5f000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Issuing..." : "Issue Certificate"}
          </button>
          <button type="button" onClick={() => navigate("/certificates")}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
