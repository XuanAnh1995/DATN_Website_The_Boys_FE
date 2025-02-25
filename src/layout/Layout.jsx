import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Menu bên trái */}
      <Sidebar />

      {/* Phần bên phải gồm Header + Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Trải dài toàn bộ phần còn lại */}
        <Header />

        {/* Content - Khu vực chính của trang */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
