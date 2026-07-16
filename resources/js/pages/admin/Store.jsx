import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#041a12]">Store Products</h1>
        <Link
          to="/store/new"
          className="flex items-center gap-2 bg-[#d4ff00] text-[#041a12] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c5f000] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm mt-1">Add your first product to the store.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Brand</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#041a12] text-sm">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {product.media?.find((m) => m.pivot.type === "main") ? "Has image" : "No image"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">
                    {product.category || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {product.brand || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell text-right">
                    {product.price ? `$${product.price}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/store/${product.id}/edit`)}
                        className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                      >
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
  );
}
