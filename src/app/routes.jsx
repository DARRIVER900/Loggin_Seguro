import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import PublicRoute from "../components/routes/PublicRoute";
import RoleRoute from "../components/routes/RoleRoute";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MusicPage from "../pages/MusicPage";
import TrackDetailPage from "../pages/TrackDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/music/:trackId" element={<TrackDetailPage />} />
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
