import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaHeart,
  FaClipboardCheck,
  FaTag,
  FaFire,
  FaStar,
} from "react-icons/fa";
import ProductService from "../../services/ProductService";

const Header = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = useCallback(async () => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await ProductService.getFilteredProducts({
        search,
        size: 5,
      });
      setSuggestions(response.content || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  }, [search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchSuggestions]);

  return (
    <header className="border-b border-red-400 p-3 shadow-md bg-white">
      {/* Thanh trên cùng */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Bên trái - Chào mừng */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-red-500">
            The Boys xin chào!
          </span>
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/src/assets/logo.jpg"
              alt="Logo"
              className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
            />
          </Link>
        </div>

        {/* Logo chính giữa */}
        <div className="flex justify-center flex-1">
          <h1 className="text-5xl font-extrabold text-black">
            The<span className="text-red-600">Boys</span>
          </h1>
        </div>

        {/* Bên phải - Đăng nhập, Đăng ký, Cửa hàng */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="bg-red-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-red-700 transition"
          >
            <FaUser /> Đăng nhập
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-black px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-300 transition"
          >
            + Đăng ký
          </Link>
          <Link
            to="/stores"
            className="bg-blue-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700 transition"
          >
            <FaMapMarkerAlt /> Cửa hàng
          </Link>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-center mt-3">
        <div className="relative w-1/2 flex items-center border border-gray-400 rounded-full px-4 py-2 bg-white">
          <input
            type="text"
            placeholder="Bạn muốn tìm gì?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1 focus:outline-none"
          />
          <FaSearch className="text-gray-600 cursor-pointer" />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center p-2 hover:bg-gray-100 border-b cursor-pointer"
                  onClick={() => {
                    navigate(`/view-product/${product.id}`);
                    setSuggestions([]);
                  }}
                >
                  <img
                    src={product.photo}
                    alt={product.nameProduct}
                    className="w-14 h-14 object-cover mr-3 rounded-md"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {product.nameProduct}
                    </p>
                    <p className="text-xs text-red-500 font-bold">
                      {product.salePrice}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu nhỏ dưới */}
      <div className="flex justify-center max-w-7xl mx-auto mt-4 gap-8 text-sm">
        <div className="flex flex-col items-center cursor-pointer hover:text-red-600">
          <FaClipboardCheck size={20} />
          <span>Kiểm tra</span>
        </div>
        <Link
          to="/favorites"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaHeart size={20} />
          <span>Yêu thích</span>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            0
          </span>
        </Link>
        <Link
          to="/cart"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaShoppingCart size={20} />
          <span>Giỏ hàng</span>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            0
          </span>
        </Link>
        <Link
          to="/Products"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaStar size={20} />
          <span>Sản Phẩm</span>
        </Link>
        <Link
          to="/personal"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaUser size={20} />
          <span>Cá nhân</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
