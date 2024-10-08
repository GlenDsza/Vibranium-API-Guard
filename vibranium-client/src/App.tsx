import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route
        path="/"
        element={
          localStorage.getItem("persist") ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
};
export default App;
