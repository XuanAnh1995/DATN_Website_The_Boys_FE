import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main>
      <Outlet /> {/* Giúp hiển thị nội dung động */}
    </main>
  );
};

export default Layout;
