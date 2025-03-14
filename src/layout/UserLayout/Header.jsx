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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Hàm tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-sky-900 text-white shadow-md">
      {/* Phần trên: Logo + Tìm kiếm + Đăng nhập + Giỏ hàng */}
      <div className="flex items-center justify-between p-4">
        {/* Logo hình tròn */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/src/assets/logo.jpg"
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
    </header>
  );
};

export default Header;
