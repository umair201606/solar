import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus, Pencil, Trash2, Loader2, Search, Filter, Upload, Download, ChevronDown,
  FileSpreadsheet, FileText,
} from "lucide-react";
import { Sparkline } from "../../components/store/PriceCharts";
import { formatRs } from "../../lib/format";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const [exportOpen, setExportOpen] = useState(false);

  const exportUrl = (format) => {
    const params = new URLSearchParams({ format });
    if (search) params.set("q", search);
    if (categoryFilter !== "All") params.set("category", categoryFilter);
    return `/api/products/export?${params.toString()}`;
  };

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["All", ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    return result;
  }, [products, search, categoryFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-[#041a12]">Products</h1>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
            >
              <Download className="w-4 h-4" /> Export <ChevronDown className="w-4 h-4" />
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-20 mt-2 w-60 bg-white rounded-xl border border-gray-100 shadow-xl p-1.5">
                <a
                  href={exportUrl("xlsx")}
                  onClick={() => setExportOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" /> Excel (.xlsx)
                </a>
                <a
                  href={exportUrl("pdf")}
                  onClick={() => setExportOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <FileText className="w-4 h-4 text-red-500" /> PDF price list
                </a>
                <p className="px-3 py-1.5 text-[11px] text-gray-400">Exports respect your current search &amp; category filter.</p>
              </div>
            )}
          </div>
          <Link
            to="/store/import"
            className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300"
          >
            <Upload className="w-4 h-4" /> Batch Import
          </Link>
          <Link
            to="/store/new"
            className="flex items-center justify-center gap-2 bg-[#d4ff00] text-[#041a12] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c5f000] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none appearance-none bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-lg font-medium">
            {products.length === 0 ? "No products yet" : "No products match your search"}
          </p>
          <p className="text-sm mt-1">
            {products.length === 0
              ? "Add your first product to the store."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-14">
                    Image
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Brand
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Warranty
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Trend
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const mainImage = product.media?.find(
                    (m) => m.pivot.type === "main"
                  );
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {mainImage ? (
                            <img
                              src={mainImage.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">
                              —
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#041a12] text-sm leading-tight">
                          {product.name}
                        </p>
                        {product.unit && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {product.unit}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                        {product.category ? (
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                            {product.category}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {product.brand || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        {product.warranty ? (
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-green-50 text-xs font-medium text-green-700 border border-green-200">
                            {product.warranty}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-[#041a12] whitespace-nowrap">
                        {formatRs(product.price, product.unit)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Sparkline
                            history={(product.price_histories || []).map((h) => [
                              h.recorded_on?.slice(0, 10),
                              Number(h.price),
                            ])}
                            trend={product.trend}
                            width={72}
                            height={22}
                          />
                          {product.price_change && (
                            <span
                              className={`text-[11px] font-bold ${
                                product.trend === "up"
                                  ? "text-red-600"
                                  : product.trend === "down"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {product.price_change}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            product.is_published
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                          title={product.is_published ? "Published" : "Draft"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/store/${product.id}/edit`)
                            }
                            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-400">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      )}
    </div>
  );
}
