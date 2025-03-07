import React from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-6">
        <h1 className="text- font-bold text-white">
          <img
            src="/src/assets/logo.jpg"
            alt="Logo"
            className="w-20 h-20 object-contain rounded-lg shadow-lg border-white border-2"
          />
        </h1>
        <span className="text-xl font-semibold">The Boys</span>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Bạn đang tìm gì..."
            className="w-full px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
            <FaSearch />
          </button>
        </div>
      </div>
      <nav className="flex items-center gap-6 text-gray-300">
        <a
          href="/store"
          className="flex items-center gap-1 hover:text-white transition-colors duration-300"
        >
          <FaMapMarkerAlt /> Cửa hàng
        </a>
        <a
          href="/login"
          className="flex items-center gap-1 hover:text-white transition-colors duration-300"
        >
          <FaUser /> Đăng nhập
        </a>
        <a
          href="/cart"
          className="relative flex items-center gap-1 hover:text-white transition-colors duration-300"
        >
          <FaShoppingCart /> Giỏ hàng
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2">
            0
          </span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
