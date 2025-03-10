import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Layout from "./Layout";
import { Outlet } from "react-router-dom";

const UserMain = () => {
  return (
    <div>
      <Header />
      <Layout />
      <Outlet /> {/* ✅ Nội dung động hiển thị ở đây */}
      <Footer />
    </div>
  );
};

export default UserMain;
