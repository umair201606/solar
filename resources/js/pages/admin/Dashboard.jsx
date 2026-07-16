import { useEffect, useState } from "react";
import axios from "axios";
import { FolderOpen, Package, Image } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, products: 0, media: 0 });
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
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Projects", count: stats.projects, icon: FolderOpen, color: "bg-blue-500", to: "/projects" },
    { label: "Products", count: stats.products, icon: Package, color: "bg-emerald-500", to: "/store" },
    { label: "Media Files", count: stats.media, icon: Image, color: "bg-amber-500", to: "/media" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-[#041a12] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.to}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-black text-[#041a12]">
                {loading ? (
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  card.count
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-1">{card.label}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
