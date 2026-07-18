import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const Dashboard = lazy(() => import("./Dashboard"));
const MediaManager = lazy(() => import("./MediaManager"));
const Projects = lazy(() => import("./Projects"));
const ProjectEditor = lazy(() => import("./ProjectEditor"));
const Store = lazy(() => import("./Store"));
const ProductEditor = lazy(() => import("./ProductEditor"));
const Certificates = lazy(() => import("./Certificates"));
const CertificateEditor = lazy(() => import("./CertificateEditor"));
const ImportManager = lazy(() => import("./ImportManager"));
const Leads = lazy(() => import("./Leads"));
const Catalog = lazy(() => import("./Catalog"));
const Settings = lazy(() => import("./Settings"));

const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin w-8 h-8 border-4 border-[#d4ff00] border-t-transparent rounded-full" />
  </div>
);

export default function AdminApp() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <AdminLoader />;
  }

  return (
    <BrowserRouter basename="/admin">
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id/edit" element={<ProjectEditor />} />
            <Route path="store" element={<Store />} />
            <Route path="store/new" element={<ProductEditor />} />
            <Route path="store/:id/edit" element={<ProductEditor />} />
            <Route path="store/import" element={<ImportManager />} />
            <Route path="leads" element={<Leads />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="settings" element={<Settings />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="certificates/new" element={<CertificateEditor />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

AdminApp.layout = (page) => page;
