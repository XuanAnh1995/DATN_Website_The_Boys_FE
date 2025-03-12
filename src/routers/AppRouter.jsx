import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LayoutAdmin from "../layout/Layout";
import adminRoutes from "./AdminRouter"; // Thêm router cho user
import UserMain from "../layout/UserLayout/UserMain";

import UserRouter from "./UserRouter";
function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Router dành cho người dùng */}
          <Route path="/" element={<UserMain />}>
            {UserRouter.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>

          {/* Router dành cho admin */}
          <Route path="/admin" element={<LayoutAdmin />}>
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
