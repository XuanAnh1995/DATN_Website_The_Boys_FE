import { useEffect, useState } from "react";
import Header from "../../layout/UserLayout/Header";
import { Outlet } from "react-router-dom";

const ViewProductDetail = () => {
  return (
    <div>
      <Header />
      <h1>Chi tiết sản phẩmphẩm</h1>
      <p>chi tiet san pham áo</p>
      <Outlet />
    </div>
  );
};

export default ViewProductDetail;
