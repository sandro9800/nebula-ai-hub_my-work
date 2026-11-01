import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { PublicLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/AdminLayout";
import { DataProvider, useData } from "@/lib/DataContext";
import { ToastProvider } from "@/components/Toast";
import { FullScreenLoader, Spinner } from "@/components/UI";

import { HomePage } from "@/pages/HomePage";
import { ClientsPage } from "@/pages/ClientsPage";
import { ModsAndMacrosPage } from "@/pages/ModsAndMacrosPage";
import { ItemDetailPage } from "@/pages/ItemDetailPage";
import { SearchPage } from "@/pages/SearchPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { LoginPage } from "@/pages/admin/LoginPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { ManageItemsPage } from "@/pages/admin/ManageItemsPage";
import { EditItemPage } from "@/pages/admin/EditItemPage";
import { MediaPage } from "@/pages/admin/MediaPage";
import { AnalyticsPage } from "@/pages/admin/AnalyticsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { isAuthenticated } from "@/lib/auth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: loc }} />;
  }
  return <>{children}</>;
}

function AppShell() {
  const { loading, error } = useData();
  if (loading) {
    return <FullScreenLoader message="Connecting to Premium MC Hub…" />;
  }
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/mods-and-macros" element={<ModsAndMacrosPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/:type/:id" element={<ItemDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ManageItemsPage />} />
          <Route path="tools" element={<ManageItemsPage />} />
          <Route path="edit/:type" element={<EditItemPage />} />
          <Route path="edit/:type/:id" element={<EditItemPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      {error && (
        <div className="fixed bottom-3 right-3 z-50 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 max-w-xs">
          Storage: {error}
        </div>
      )}
    </>
  );
}

export default function App() {
  // Track if we are running in standalone preview where /api/data does
  // not exist. In that case we still want to render the UI.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // small grace period so the data context gets a chance to mount
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);
  if (!ready) return <Spinner />;
  return (
    <BrowserRouter>
      <DataProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
