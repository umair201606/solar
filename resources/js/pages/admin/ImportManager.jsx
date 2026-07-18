import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Loader2, Upload, FileSpreadsheet, ArrowLeft, Check, AlertTriangle,
  ChevronDown, Sparkles, RefreshCw, CircleCheck, CircleX,
} from "lucide-react";
import { formatRs } from "../../lib/format";

const TEMPLATE_TYPES = [
  { id: "batteries", label: "Batteries template" },
  { id: "inverters", label: "Inverters template" },
  { id: "panels", label: "Solar Panels template" },
  { id: "generic", label: "Generic template" },
];

const MODES = [
  { id: "create-update", label: "Create new + update rates", hint: "New rows become products, matched rows get the new price" },
  { id: "update-only", label: "Update rates only", hint: "Only existing products are touched — nothing new is created" },
  { id: "create-only", label: "Create new only", hint: "Rows matching existing products are skipped" },
];

const STATUS_STYLE = {
  "new": "bg-blue-50 text-blue-700",
  "price-change": "bg-amber-50 text-amber-700",
  "duplicate": "bg-gray-100 text-gray-500",
};

export default function ImportManager() {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState([]);
  const [mode, setMode] = useState("create-update");
  const [acceptedCategories, setAcceptedCategories] = useState([]);
  const [acceptedBrands, setAcceptedBrands] = useState([]);
  const [catalog, setCatalog] = useState({ categories: [], brands: [] });
  const [committing, setCommitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/catalog").then(({ data }) =>
      setCatalog({
        categories: data.categories.map((c) => c.name),
        brands: data.brands.map((b) => b.name),
      })
    );
  }, []);

  const upload = async (file) => {
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axios.post("/api/products/import/preview", form);
      setPreview(data);
      setRows(data.rows);
      setAcceptedCategories([]);
      setAcceptedBrands([]);
    } catch (e) {
      setError(e.response?.data?.message || "Could not read that file. Use .xlsx or .csv from a template.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, data: { ...row.data, [field]: value } } : row
      )
    );
  };

  const toggleInclude = (index) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, include: !row.include } : row)));

  const includedRows = rows.filter((r) => r.include);

  const pendingCategories = (preview?.new_categories || []).filter((c) =>
    includedRows.some((r) => r.data.category === c)
  );
  const pendingBrands = (preview?.new_brands || []).filter((b) =>
    includedRows.some((r) => r.data.brand === b)
  );
  const unapprovedCategories = pendingCategories.filter((c) => !acceptedCategories.includes(c));

  const commit = async () => {
    setCommitting(true);
    setError("");
    try {
      const { data } = await axios.post("/api/products/import/commit", {
        mode,
        add_categories: acceptedCategories,
        add_brands: acceptedBrands,
        rows: includedRows,
      });
      setResult(data);
      setPreview(null);
      setRows([]);
    } catch (e) {
      setError(e.response?.data?.message || "Import failed — check the rows and try again.");
    } finally {
      setCommitting(false);
    }
  };

  const allCategoryOptions = [...new Set([...catalog.categories, ...acceptedCategories, ...pendingCategories])];
  const allBrandOptions = [...new Set([...catalog.brands, ...acceptedBrands, ...pendingBrands])];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/store" className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#041a12]">Batch Import</h1>
          <p className="text-sm text-gray-500">
            Upload a filled template — review every row before anything is saved.
          </p>
        </div>
      </div>

      {/* Step 1: upload */}
      {!preview && !result && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
            <div>
              <h2 className="font-black text-[#041a12]">1 · Get a template</h2>
              <p className="text-xs text-gray-400 mt-1">
                Each template has the right columns for that product type. Row 2 explains what to enter in every column.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setTemplateOpen(!templateOpen)}
                className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
              >
                <FileSpreadsheet className="w-4 h-4" /> Download template <ChevronDown className="w-4 h-4" />
              </button>
              {templateOpen && (
                <div className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl p-1.5">
                  {TEMPLATE_TYPES.map((t) => (
                    <a
                      key={t.id}
                      href={`/api/products/template?type=${t.id}`}
                      onClick={() => setTemplateOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      {t.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h2 className="font-black text-[#041a12] mb-1">2 · Upload the filled file</h2>
          <p className="text-xs text-gray-400 mb-4">
            Works for both jobs: adding new products and batch-updating rates of existing ones
            (rows are matched to products by name). Accepts .xlsx and .csv.
          </p>

          <label className="border-2 border-dashed border-gray-200 hover:border-[#d4ff00] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-600">Click to choose your file</p>
                <p className="text-xs text-gray-400 mt-1">Nothing is imported until you review and confirm</p>
              </>
            )}
          </label>
          {error && <p className="text-sm font-bold text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {/* Step 2: review */}
      {preview && (
        <div className="space-y-4">
          {/* Summary + mode */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-black text-[#041a12]">
                {preview.summary.total} rows read
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE["new"]}`}>
                {preview.summary.new} new
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE["price-change"]}`}>
                {preview.summary.price_changes} rate changes
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE["duplicate"]}`}>
                {preview.summary.duplicates} unchanged duplicates
              </span>
              <button
                onClick={() => { setPreview(null); setRows([]); }}
                className="ml-auto flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Start over
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-2">
              {MODES.map((m) => (
                <label
                  key={m.id}
                  className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                    mode === m.id ? "border-[#041a12] bg-[#041a12] text-white" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input type="radio" className="hidden" checked={mode === m.id} onChange={() => setMode(m.id)} />
                  <p className="text-sm font-bold">{m.label}</p>
                  <p className={`text-xs mt-0.5 ${mode === m.id ? "text-white/60" : "text-gray-400"}`}>{m.hint}</p>
                </label>
              ))}
            </div>
          </div>

          {/* New categories / brands approval */}
          {(pendingCategories.length > 0 || pendingBrands.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="flex items-center gap-2 text-sm font-black text-amber-800 mb-3">
                <AlertTriangle className="w-4 h-4" />
                This file uses categories/brands that don&apos;t exist yet
              </p>
              <div className="space-y-3">
                {pendingCategories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Categories:</span>
                    {pendingCategories.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setAcceptedCategories((prev) =>
                            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                          )
                        }
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                          acceptedCategories.includes(c)
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                        }`}
                      >
                        {acceptedCategories.includes(c) ? <CircleCheck className="w-3.5 h-3.5" /> : <CircleX className="w-3.5 h-3.5" />}
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                {pendingBrands.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Brands:</span>
                    {pendingBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() =>
                          setAcceptedBrands((prev) =>
                            prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
                          )
                        }
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                          acceptedBrands.includes(b)
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                        }`}
                      >
                        {acceptedBrands.includes(b) ? <CircleCheck className="w-3.5 h-3.5" /> : <CircleX className="w-3.5 h-3.5" />}
                        {b}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setAcceptedCategories(pendingCategories); setAcceptedBrands(pendingBrands); }}
                    className="text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-full"
                  >
                    Accept all as new
                  </button>
                  <span className="text-xs text-amber-700 self-center">
                    …or change the category/brand on those rows below to an existing one.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rows table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["Use", "Status", "Product", "Category", "Brand", "Price (Rs.)", "Price Date", "Notes"].map((h) => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-50 ${row.include ? "" : "opacity-40"}`}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={row.include}
                          onChange={() => toggleInclude(i)}
                          className="w-4 h-4 accent-[#041a12]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLE[row.status]}`}>
                          {row.status === "price-change" ? "rate change" : row.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 min-w-[220px]">
                        <input
                          value={row.data.name}
                          onChange={(e) => updateRow(i, "name", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-transparent hover:border-gray-200 focus:border-[#d4ff00] text-sm font-medium outline-none bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={row.data.category || ""}
                          onChange={(e) => updateRow(i, "category", e.target.value)}
                          className={`px-2 py-1.5 rounded-lg border text-sm outline-none bg-white ${
                            row.data.category && !allCategoryOptions.includes(row.data.category)
                              ? "border-amber-300"
                              : "border-gray-200"
                          }`}
                        >
                          <option value="">— pick —</option>
                          {allCategoryOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={row.data.brand || ""}
                          onChange={(e) => updateRow(i, "brand", e.target.value || null)}
                          className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm outline-none bg-white"
                        >
                          <option value="">—</option>
                          {allBrandOptions.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={row.data.price ?? ""}
                          onChange={(e) => updateRow(i, "price", e.target.value === "" ? null : Number(e.target.value))}
                          className="w-28 px-2 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4ff00]"
                        />
                        {row.status === "price-change" && (
                          <p className="text-[11px] text-amber-600 mt-0.5 whitespace-nowrap">
                            was {formatRs(row.existing_price)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={row.data.price_date ?? ""}
                          onChange={(e) => updateRow(i, "price_date", e.target.value || null)}
                          className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4ff00]"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-400">
                        {row.issues.join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          <div className="flex items-center justify-between gap-4 pb-6">
            <p className="text-sm text-gray-500">
              <span className="font-black text-[#041a12]">{includedRows.length}</span> of {rows.length} rows selected
              {unapprovedCategories.length > 0 && (
                <span className="text-amber-600 font-bold"> · approve or remap new categories first</span>
              )}
            </p>
            <button
              onClick={commit}
              disabled={committing || includedRows.length === 0 || unapprovedCategories.length > 0}
              className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#c5f000] disabled:opacity-50"
            >
              {committing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Apply Import
            </button>
          </div>
        </div>
      )}

      {/* Step 3: result */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <Sparkles className="w-10 h-10 text-[#a8c400] mx-auto mb-3" />
          <h2 className="text-xl font-black text-[#041a12] mb-2">Import complete</h2>
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-bold text-blue-700">{result.created} created</span> ·{" "}
            <span className="font-bold text-amber-700">{result.updated} updated</span> ·{" "}
            <span className="font-bold text-gray-500">{result.skipped} skipped</span>
          </p>
          {result.errors?.length > 0 && (
            <div className="text-left max-w-xl mx-auto bg-red-50 rounded-xl p-4 mb-5">
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-600">{e}</p>
              ))}
            </div>
          )}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setResult(null)}
              className="border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
            >
              Import another file
            </button>
            <Link
              to="/store"
              className="bg-[#d4ff00] text-[#041a12] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c5f000]"
            >
              Go to Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
