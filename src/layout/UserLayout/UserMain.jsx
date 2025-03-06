import Header from "./Header";
import Footer from "./Footer";
import Layout from "./Layout";
import { Outlet } from "react-router-dom";

const UserMain = () => {
  return (
    <div>
      <Header />
      <Layout />
      <Outlet /> {/* Hiển thị nội dung động ở đây */}
      <Footer />
    </div>
  );
};

export default UserMain;
