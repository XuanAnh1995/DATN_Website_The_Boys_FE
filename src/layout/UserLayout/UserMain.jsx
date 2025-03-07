import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Layout from "./Layout";
import { Outlet } from "react-router-dom";

const UserMain = () => {
  const fixedProducts = [
    {
      id: 1,
      productName: "Áo Polo Nam Cotton",
      productCode: "POLO-01",
      salePrice: "199,000",
      photo:
        "https://th.bing.com/th/id/OIP.cI0Mh-X9K8oNz84ylitqAgHaHa?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      productName: "Áo Thun Basic Unisex",
      productCode: "THUN-02",
      salePrice: "150,000",
      photo:
        "https://th.bing.com/th/id/OIP.rOK_Z_mL_9X6H--chwcLPAHaHl?w=1172&h=1200&rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      productName: "Áo Sơ Mi Trắng Công Sở",
      productCode: "SOMI-03",
      salePrice: "299,000",
      photo:
        "https://th.bing.com/th/id/OIP.vdeGZFtyM44aazUXo8VTPwHaHa?rs=1&pid=ImgDetMain",
    },
    {
      id: 4,
      productName: "Áo Hoodie Nỉ Dày",
      productCode: "HOODIE-04",
      salePrice: "350,000",
      photo:
        "https://dynamic.zacdn.com/R-jnOF9eS6maOOWhgwr82SFKZ6s=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/burberry-8862-0571514-1.jpg",
    },
  ];
  return (
    <div>
      <Header />
      <Layout />
      <main className="bg-blue-50 text-gray-900 p-8 flex justify-center">
        <div className="w-full max-w-7xl px-6">
          {" "}
          {/* Mở rộng lên 7xl và thêm padding ngang */}
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Danh Sách Áo Thời Trang
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {" "}
            {/* Tăng gap */}
            {fixedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-5 rounded-lg shadow-lg border border-gray-300 text-center"
              >
                <img
                  src={product.photo}
                  alt={product.productName}
                  className="w-full h-52 object-cover rounded-lg" /* Tăng chiều cao ảnh */
                />
                <h3 className="text-lg font-semibold mt-3">
                  {product.productName}
                </h3>
                <p className="text-gray-600 text-sm">
                  Mã: {product.productCode}
                </p>
                <p className="text-red-600 font-bold">
                  {product.salePrice} VND
                </p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-800 transition">
                  Mua ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Outlet /> {/* Hiển thị nội dung động ở đây */}
      <Footer />
    </div>
  );
};

export default UserMain;
