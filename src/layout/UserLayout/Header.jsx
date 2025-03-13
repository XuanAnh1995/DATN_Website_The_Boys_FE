import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaPhoneAlt,
  FaAngleDown,
} from "react-icons/fa";

const Header = () => {
  // Danh sách banner thay đổi tự động
  const images = [
    "https://static.vecteezy.com/system/resources/previews/002/294/859/original/flash-sale-web-banner-design-e-commerce-online-shopping-header-or-footer-banner-free-vector.jpg",
    "https://cdn.shopify.com/s/files/1/0021/0970/2202/files/150_New_Arrivals_Main_Banner_1370X600_a54e428c-0030-4078-9a2f-20286f12e604_1920x.jpg?v=1628065313",
    "https://file.hstatic.net/1000253775/file/new_banner_pc_copy.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Hàm tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Tự động đổi ảnh banner mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-green-900 text-white shadow-md">
      {/* Phần trên: Logo + Tìm kiếm + Đăng nhập + Giỏ hàng */}
      <div className="flex items-center justify-between p-4">
        {/* Logo hình tròn */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/src/assets/logo.jpg" // Đảm bảo đường dẫn logo đúng
            alt="Logo"
            className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
          />
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="relative flex-1 max-w-lg mx-4 flex items-center bg-white rounded-full">
          <select className="bg-gray-200 px-3 py-2 rounded-l-full text-gray-700 focus:outline-none">
            <option value="all">Tất cả</option>
            <option value="men">Thời trang Nam</option>
            <option value="women">Thời trang Nữ</option>
          </select>
          <input
            type="text"
            placeholder="Tìm sản phẩm bạn mong muốn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-3 py-2 text-gray-800 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 px-4 py-2 rounded-r-full text-white"
          >
            <FaSearch />
          </button>
        </div>

        {/* Đăng nhập & Giỏ hàng */}
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="flex items-center gap-2 hover:text-gray-300"
          >
            <FaUser />
            <span>Đăng nhập / Đăng ký</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center gap-2 hover:text-gray-300"
          >
            <FaShoppingCart />
            <span>Giỏ hàng</span>
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold rounded-full px-2">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Phần dưới: Menu điều hướng */}
      <div className="bg-amber-50 text-green-900 py-2 flex justify-between px-10 items-center">
        <nav className="flex gap-6 text-lg font-medium">
          <Link
            to="/"
            className="text-orange-500 border-b-2 border-orange-500 pb-1"
          >
            Trang chủ
          </Link>
          <Link
            to="/men"
            className="flex items-center gap-1 hover:text-orange-500"
          >
            Thời trang Nam <FaAngleDown />
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-1 hover:text-orange-500"
          >
            Sản phẩm <FaAngleDown />
          </Link>
          <Link to="/boy" className="hover:text-orange-500">
            Bé trai
          </Link>
          <Link to="/girl" className="hover:text-orange-500">
            Bé gái
          </Link>
          <Link to="/news" className="hover:text-orange-500">
            Tin tức
          </Link>
          <Link to="/contact" className="hover:text-orange-500">
            Liên hệ
          </Link>
        </nav>

        {/* Hotline */}
        <div className="flex items-center gap-2 text-lg font-medium">
          <FaPhoneAlt />
          <span>
            Hotline: <strong>1900 6750</strong>
          </span>
        </div>
      </div>

      {/* Banner tự động thay đổi */}
      <div className="relative w-screen h-[40vh] overflow-hidden mt-2 border border-gray-300 shadow-lg">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
      </div>
    </header>
  );
};

export default Header;
