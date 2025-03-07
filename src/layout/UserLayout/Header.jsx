import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-4 flex items-center justify-between shadow-md">
      {/* Logo + Tên thương hiệu */}
      <div className="flex items-center gap-6">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/src/assets/logo.jpg"
            alt="Logo"
            className="w-16 h-16 object-cover rounded-full shadow-lg border-2 border-white drop-shadow-lg"
          />
          <span className="text-2xl font-bold tracking-wide">The Boys</span>
        </a>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative flex-1 max-w-lg">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full px-4 py-2 rounded-full bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700 transition">
          <FaSearch size={18} />
        </button>
      </div>

      {/* Điều hướng */}
      <nav className="flex items-center gap-6 text-gray-200">
        <a
          href="/store"
          className="flex items-center gap-1 hover:text-white transition transform hover:scale-105"
        >
          <FaMapMarkerAlt /> Cửa hàng
        </a>
        <a
          href="/login"
          className="flex items-center gap-1 hover:text-white transition transform hover:scale-105"
        >
          <FaUser /> Đăng nhập
        </a>
        <a
          href="/cart"
          className="relative flex items-center gap-1 hover:text-white transition transform hover:scale-105"
        >
          <FaShoppingCart />
          <span>Giỏ hàng</span>
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold rounded-full px-2 shadow-md">
            0
          </span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
