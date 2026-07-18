import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react";

function EditableList({ title, hint, items, onAdd, onRename, onDelete }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="font-black text-[#041a12]">{title}</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-4">{hint}</p>

      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newName.trim() && submit(async () => { await onAdd(newName.trim()); setNewName(""); })}
          placeholder={`Add new ${title.toLowerCase().replace(/ies$/, "y").replace(/s$/, "")}…`}
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#d4ff00] focus:ring-2 focus:ring-[#d4ff00]/20 outline-none"
        />
        <button
          disabled={!newName.trim() || busy}
          onClick={() => submit(async () => { await onAdd(newName.trim()); setNewName(""); })}
          className="flex items-center gap-1.5 bg-[#d4ff00] text-[#041a12] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#c5f000] disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {error && <p className="text-xs font-bold text-red-500 mb-3">{error}</p>}

      <ul className="divide-y divide-gray-50">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 py-2.5">
            {editingId === item.id ? (
              <>
                <input
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit(async () => { await onRename(item, editValue.trim()); setEditingId(null); })}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#d4ff00]"
                />
                <button
                  onClick={() => submit(async () => { await onRename(item, editValue.trim()); setEditingId(null); })}
                  className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {item.products_count} product{item.products_count === 1 ? "" : "s"}
                </span>
                <button
                  onClick={() => { setEditingId(item.id); setEditValue(item.name); }}
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600"
                  title="Rename (updates all its products too)"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => submit(() => onDelete(item))}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500"
                  title="Delete (only when no products use it)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Catalog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    axios.get("/api/catalog").then(({ data }) => setData(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#041a12] mb-1">Brands &amp; Categories</h1>
      <p className="text-sm text-gray-500 mb-6">
        These power the dropdowns in the product editor, the store filters and import validation.
        Renaming updates every product that uses the old name.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <EditableList
          title="Categories"
          hint="Shown as filter pills on the store, in their listed order."
          items={data.categories}
          onAdd={async (name) => { await axios.post("/api/categories", { name }); await load(); }}
          onRename={async (item, name) => { await axios.put(`/api/categories/${item.id}`, { name }); await load(); }}
          onDelete={async (item) => {
            if (!confirm(`Delete category "${item.name}"?`)) return;
            await axios.delete(`/api/categories/${item.id}`);
            await load();
          }}
        />
        <EditableList
          title="Brands"
          hint="Shown in the store's brand filter and the product editor dropdown."
          items={data.brands}
          onAdd={async (name) => { await axios.post("/api/brands", { name }); await load(); }}
          onRename={async (item, name) => { await axios.put(`/api/brands/${item.id}`, { name }); await load(); }}
          onDelete={async (item) => {
            if (!confirm(`Delete brand "${item.name}"?`)) return;
            await axios.delete(`/api/brands/${item.id}`);
            await load();
          }}
        />
      </div>
    </div>
  );
}
