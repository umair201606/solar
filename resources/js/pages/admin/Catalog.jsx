import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Loader2, Plus, Pencil, Trash2, Check, X, Search, FolderOpen, ShieldCheck,
  GripVertical, Lightbulb, Info,
} from "lucide-react";

function CatalogCard({
  icon: Icon, title, description, addLabel, searchPlaceholder, items,
  onAdd, onRename, onDelete, onReorder, footerHint,
}) {
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Local order while dragging; null = follow incoming items.
  const [dragList, setDragList] = useState(null);
  const dragIndex = useRef(null);

  const list = dragList ?? items;
  const visible = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((i) => i.name.toLowerCase().includes(q));
  }, [list, query]);

  const canDrag = Boolean(onReorder) && !query.trim();

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

  const handleDrop = () => {
    if (dragList) {
      onReorder(dragList);
      setDragList(null);
    }
    dragIndex.current = null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
      <div className="p-5 sm:p-6 pb-0 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-emerald-600" />
          </span>
          <div>
            <h2 className="font-black text-lg text-[#041a12]">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</p>
          </div>
        </div>
        <button
          onClick={() => { setAdding(!adding); setError(""); }}
          className="shrink-0 flex items-center gap-1.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> {addLabel}
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col">
        {adding && (
          <div className="flex gap-2">
            <input
              value={newName}
              autoFocus
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && newName.trim() &&
                submit(async () => { await onAdd(newName.trim()); setNewName(""); setAdding(false); })}
              placeholder={`New ${title.toLowerCase().replace(/ies$/, "y").replace(/s$/, "")} name…`}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
            <button
              disabled={!newName.trim() || busy}
              onClick={() => submit(async () => { await onAdd(newName.trim()); setNewName(""); setAdding(false); })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" /> Save
            </button>
            <button
              onClick={() => { setAdding(false); setNewName(""); }}
              className="px-3 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>

        {error && <p className="text-xs font-bold text-red-500">{error}</p>}

        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden flex-1">
          {visible.length === 0 && (
            <p className="text-sm text-gray-300 italic px-4 py-6 text-center">Nothing found.</p>
          )}
          {visible.map((item, idx) => (
            <div
              key={item.id}
              draggable={canDrag && editingId !== item.id}
              onDragStart={() => { dragIndex.current = idx; setDragList(list); }}
              onDragOver={(e) => {
                e.preventDefault();
                if (!canDrag || dragIndex.current === null || dragIndex.current === idx) return;
                const next = [...(dragList ?? list)];
                const [moved] = next.splice(dragIndex.current, 1);
                next.splice(idx, 0, moved);
                dragIndex.current = idx;
                setDragList(next);
              }}
              onDrop={handleDrop}
              onDragEnd={handleDrop}
              className={`flex items-center gap-2.5 px-3.5 py-3 bg-white hover:bg-gray-50/70 transition-colors ${
                canDrag ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            >
              {canDrag && <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />}
              {editingId === item.id ? (
                <>
                  <input
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && editValue.trim() &&
                      submit(async () => { await onRename(item, editValue.trim()); setEditingId(null); })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => submit(async () => { await onRename(item, editValue.trim()); setEditingId(null); })}
                    className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-bold text-gray-800 truncate">{item.name}</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                    {item.products_count} product{item.products_count === 1 ? "" : "s"}
                  </span>
                  <button
                    onClick={() => { setEditingId(item.id); setEditValue(item.name); }}
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"
                    title="Rename (updates all its products too)"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => submit(() => onDelete(item))}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 shrink-0"
                    title="Delete (only when no products use it)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {footerHint && (
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5 shrink-0" /> {footerHint}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    axios.get("/api/catalog").then(({ data }) => setData(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const reorderCategories = async (ordered) => {
    // Optimistic local order, then persist each changed sort_order.
    setData((prev) => ({ ...prev, categories: ordered }));
    await Promise.all(
      ordered.map((cat, i) =>
        cat.sort_order === i + 1
          ? null
          : axios.put(`/api/categories/${cat.id}`, { name: cat.name, sort_order: i + 1 })
      )
    );
    load();
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#041a12]">Brands &amp; Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5 max-w-2xl">
            Manage your store&apos;s brands and categories. These power the dropdowns in the
            product editor, store filters and import validation.
          </p>
        </div>
        <div className="hidden lg:flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 max-w-xs shadow-sm">
          <Lightbulb className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-black text-gray-800">How it works</p>
            <p className="text-xs text-gray-400 leading-snug mt-0.5">
              Renaming updates every product that uses the old name.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <CatalogCard
          icon={FolderOpen}
          title="Categories"
          description="Shown as filter pills on the store, in their listed order."
          addLabel="Add Category"
          searchPlaceholder="Search categories…"
          items={data.categories}
          onAdd={async (name) => { await axios.post("/api/categories", { name }); await load(); }}
          onRename={async (item, name) => { await axios.put(`/api/categories/${item.id}`, { name }); await load(); }}
          onDelete={async (item) => {
            if (!confirm(`Delete category "${item.name}"?`)) return;
            await axios.delete(`/api/categories/${item.id}`);
            await load();
          }}
          onReorder={reorderCategories}
          footerHint="Drag and drop to reorder categories."
        />
        <CatalogCard
          icon={ShieldCheck}
          title="Brands"
          description="Shown in the store's brand filter and product editor dropdown."
          addLabel="Add Brand"
          searchPlaceholder="Search brands…"
          items={data.brands}
          onAdd={async (name) => { await axios.post("/api/brands", { name }); await load(); }}
          onRename={async (item, name) => { await axios.put(`/api/brands/${item.id}`, { name }); await load(); }}
          onDelete={async (item) => {
            if (!confirm(`Delete brand "${item.name}"?`)) return;
            await axios.delete(`/api/brands/${item.id}`);
            await load();
          }}
          footerHint="Brands are sorted alphabetically."
        />
      </div>
    </div>
  );
}
