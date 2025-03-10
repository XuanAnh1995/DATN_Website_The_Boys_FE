import { Routes, Route } from "react-router-dom";
import UserMain from "../layout/UserLayout/UserMain";

import ViewProductDetail from "../../src/pages/Users/ViewProductDetail";

const AppUserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserMain />}>
        {/* Trang danh sách sản phẩm */}

        {/* Trang chi tiết sản phẩm */}
        <Route path="san-pham/:id" element={<ViewProductDetail />} />
      </Route>
    </Routes>
  );
};

export default AppUserRouter;
