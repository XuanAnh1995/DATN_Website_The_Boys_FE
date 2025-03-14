import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import ProductService from "../../services/ProductService";

const Header = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate(); // Hook điều hướng

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
    <header className="bg-sky-900 text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/src/assets/logo.jpg"
            alt="Logo"
            className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
          />
        </Link>

        <div className="relative flex-1 max-w-lg mx-4 flex items-center bg-white rounded-full">
          <input
            type="text"
            placeholder="Tìm sản phẩm bạn mong muốn"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-gray-800 focus:outline-none"
          />
          <FaSearch className="text-gray-500 absolute right-3" />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center p-2 hover:bg-gray-100 border-b border-gray-200 cursor-pointer"
                  onClick={() => {
                    navigate(`/view-product/${product.id}`);
                    setSuggestions([]); // Ẩn danh sách gợi ý sau khi click
                  }}
                >
                  <img
                    src={product.photo}
                    alt={product.nameProduct}
                    className="w-14 h-14 object-cover mr-3 rounded-md"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {product.nameProduct}
                    </p>
                    <p className="text-xs text-red-500 font-bold">
                      {product.salePrice}đ
                      <span className="text-gray-400 line-through ml-2">
                        {product.salePrice}đ
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
