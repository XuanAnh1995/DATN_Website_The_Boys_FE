import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 flex items-center justify-between shadow-lg">
      {/* Logo + Tên thương hiệu */}
      <div className="flex items-center gap-4">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/src/assets/logo.jpg"
            alt="Logo"
            className="w-14 h-14 object-cover rounded-full shadow-lg border-2 border-white"
          />
          <span className="text-2xl font-bold tracking-wide">The Boys</span>
        </a>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative flex-1 max-w-lg mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full px-4 py-2 rounded-full bg-white text-gray-800 shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition">
          <FaSearch size={18} />
        </button>
      </div>

      {/* Điều hướng */}
      <nav className="flex items-center gap-6">
        <a
          href="/store"
          className="flex items-center gap-2 text-gray-200 hover:text-white transition transform hover:scale-110"
        >
          <FaMapMarkerAlt className="text-xl" />{" "}
          <span className="hidden sm:inline">Cửa hàng</span>
        </a>
        <a
          href="/login"
          className="flex items-center gap-2 text-gray-200 hover:text-white transition transform hover:scale-110"
        >
          <FaUser className="text-xl" />{" "}
          <span className="hidden sm:inline">Đăng nhập</span>
        </a>
        <a
          href="/cart"
          className="relative flex items-center gap-2 text-gray-200 hover:text-white transition transform hover:scale-110"
        >
          <FaShoppingCart className="text-xl" />
          <span className="hidden sm:inline">Giỏ hàng</span>
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold rounded-full px-2 shadow-md">
            0
          </span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
