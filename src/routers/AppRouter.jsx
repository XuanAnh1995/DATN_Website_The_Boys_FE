import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../layout/Layout";
import adminRoutes from "./AdminRouter";
import AppUserRouter from "./AppUserRouter"; // Thêm router cho user

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Router dành cho người dùng */}
          <Route path="/*" element={<AppUserRouter />} />

          {/* Router dành cho admin */}
          <Route path="/admin" element={<Layout />}>
            {adminRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>

          {/* Trang 404 */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
