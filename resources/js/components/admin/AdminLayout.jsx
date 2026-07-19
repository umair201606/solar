import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { router } from "@inertiajs/react";
import { useState } from "react";
import {
  LayoutDashboard, FolderOpen, Package, Image, Award, LogOut, Menu, X,
  PhoneCall, Tags, Settings as SettingsIcon, Handshake, Bell,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/store", label: "Store", icon: Package },
  { to: "/leads", label: "Leads", icon: PhoneCall },
  { to: "/push-alerts", label: "Price Alerts", icon: Bell },
  { to: "/crm", label: "CRM", icon: Handshake },
  { to: "/catalog", label: "Brands & Categories", icon: Tags },
  { to: "/certificates", label: "Certificates", icon: Award },
  { to: "/media", label: "Media", icon: Image },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    router.post("/admin/logout", {}, {
      onSuccess: () => navigate("/admin/login"),
    });
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-[#041a12] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-xl font-black tracking-tight">
              Solarkon<span className="text-[#d4ff00]">.</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-[#d4ff00] text-[#041a12]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-gray-500 capitalize">
            {location.pathname.split("/").filter(Boolean).join(" / ") || "Dashboard"}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
