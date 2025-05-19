// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../store/userSlice";
// import {
//   FaSearch,
//   FaUser,
//   FaShoppingCart,
//   FaMapMarkerAlt,
//   FaHeart,
//   FaClipboardCheck,
//   FaStar,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import ProductService from "../../services/ProductService";

// const Header = () => {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Lấy trạng thái user từ Redux
//   const { isLoggedIn, name } = useSelector((state) => state.user);

//   // Xử lý tìm kiếm sản phẩm
//   const fetchSuggestions = useCallback(async () => {
//     if (!search.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     try {
//       const response = await ProductService.getFilteredProducts({
//         search,
//         size: 5,
//       });
//       setSuggestions(response.content || []);
//     } catch (error) {
//       console.error("Lỗi khi tìm kiếm sản phẩm:", error);
//     }
//   }, [search]);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchSuggestions();
//     }, 300);
//     return () => clearTimeout(delayDebounceFn);
//   }, [fetchSuggestions]);

//   // Xử lý đăng xuất
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <header className="border-b border-red-400 p-3 shadow-md bg-white">
//       {/* Thanh trên cùng */}
//       <div className="flex items-center justify-between max-w-7xl mx-auto">
//         {/* Bên trái - Chào mừng */}
//         <div className="flex items-center gap-4">
//           <span className="text-sm font-medium text-red-500">
//             {isLoggedIn ? `Xin chào, ${name}!` : "The Boys xin chào!"}
//           </span>
//           <Link to="/" className="flex items-center gap-3">
//             <img
//               src="/src/assets/logo.jpg"
//               alt="Logo"
//               className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
//             />
//           </Link>
//         </div>

//         {/* Logo chính giữa */}
//         <div className="flex justify-center flex-1">
//           <h1 className="text-5xl font-extrabold text-black">
//             The<span className="text-red-600">Boys</span>
//           </h1>
//         </div>

//         {/* Bên phải - Hiển thị tuỳ theo trạng thái đăng nhập */}
//         <div className="flex items-center gap-3">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/personal"
//                 className="bg-green-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700 transition"
//               >
//                 <FaUser /> {name}
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="bg-gray-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-700 transition"
//               >
//                 <FaSignOutAlt /> Đăng xuất
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-red-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-red-700 transition"
//               >
//                 <FaUser /> Đăng nhập
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-gray-200 text-black px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-300 transition"
//               >
//                 + Đăng ký
//               </Link>
//             </>
//           )}
//           <Link
//             to="/stores"
//             className="bg-blue-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700 transition"
//           >
//             <FaMapMarkerAlt /> Cửa hàng
//           </Link>
//         </div>
//       </div>

//       {/* Thanh tìm kiếm */}
//       <div className="flex justify-center mt-3">
//         <div className="relative w-1/2 flex items-center border border-gray-400 rounded-full px-4 py-2 bg-white">
//           <input
//             type="text"
//             placeholder="Bạn muốn tìm gì?"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-1 focus:outline-none"
//           />
//           <FaSearch className="text-gray-600 cursor-pointer" />
//           {suggestions.length > 0 && (
//             <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto z-50">
//               {suggestions.map((product) => (
//                 <div
//                   key={product.id}
//                   className="flex items-center p-2 hover:bg-gray-100 border-b cursor-pointer"
//                   onClick={() => {
//                     navigate(`/view-product/${product.id}`);
//                     setSuggestions([]);
//                   }}
//                 >
//                   <img
//                     src={product.photo}
//                     alt={product.nameProduct}
//                     className="w-14 h-14 object-cover mr-3 rounded-md"
//                   />
//                   <div>
//                     <p className="text-sm font-semibold">
//                       {product.nameProduct}
//                     </p>
//                     <p className="text-xs text-red-500 font-bold">
//                       {product.salePrice}đ
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Menu nhỏ dưới */}
//       <div className="flex justify-center max-w-7xl mx-auto mt-4 gap-8 text-sm">
//         <div className="flex flex-col items-center cursor-pointer hover:text-red-600">
//           <FaClipboardCheck size={20} />
//           <span>Kiểm tra</span>
//         </div>
//         <Link
//           to="/favorites"
//           className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//         >
//           <FaHeart size={20} />
//           <span>Yêu thích</span>
//         </Link>
//         <Link
//           to="/cart"
//           className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//         >
//           <FaShoppingCart size={20} />
//           <span>Giỏ hàng</span>
//         </Link>
//         <Link
//           to="/Products"
//           className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//         >
//           <FaStar size={20} />
//           <span>Sản Phẩm</span>
//         </Link>
//         {isLoggedIn && (
//           <Link
//             to="/personal"
//             className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//           >
//             <FaUser size={20} />
//             <span>Cá nhân</span>
//           </Link>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../store/userSlice";
// import {
//   FaSearch,
//   FaUser,
//   FaShoppingCart,
//   FaMapMarkerAlt,
//   FaHeart,
//   FaClipboardCheck,
//   FaStar,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import ProductService from "../../services/ProductService";

// const Header = () => {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Lấy trạng thái user từ Redux
//   const { isLoggedIn, name } = useSelector((state) => state.user);

//   // Xử lý tìm kiếm sản phẩm
//   const fetchSuggestions = useCallback(async () => {
//     if (!search.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     try {
//       const response = await ProductService.getFilteredProducts({
//         search,
//         size: 5,
//       });
//       setSuggestions(response.content || []);
//     } catch (error) {
//       console.error("Lỗi khi tìm kiếm sản phẩm:", error);
//     }
//   }, [search]);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchSuggestions();
//     }, 300);
//     return () => clearTimeout(delayDebounceFn);
//   }, [fetchSuggestions]);

//   // Xử lý đăng xuất
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   // Xử lý điều hướng đến trang chi tiết sản phẩm
//   const handleViewProduct = async (productId) => {
//     try {
//       const productDetails = await ProductService.getProductById(productId);
//       if (productDetails && productDetails.productCode) {
//         navigate(`/view-product/${productDetails.productCode}`);
//       } else {
//         alert("Không thể tìm thấy mã sản phẩm.");
//       }
//     } catch (error) {
//       console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
//       alert("Không thể xem chi tiết sản phẩm. Vui lòng thử lại.");
//     }
//   };

//   return (
//     <header className="border-b border-red-400 p-3 shadow-md bg-white">
//       {/* Thanh trên cùng */}
//       <div className="flex items-center justify-between max-w-7xl mx-auto">
//         {/* Bên trái - Chào mừng */}
//         <div className="flex items-center gap-4">
//           <span className="text-sm font-medium text-red-500">
//             {isLoggedIn ? `Xin chào, ${name}!` : "The Boys xin chào!"}
//           </span>
//           <Link to="/" className="flex items-center gap-3">
//             <img
//               src="/src/assets/logo.jpg"
//               alt="Logo"
//               className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
//             />
//           </Link>
//         </div>

//         {/* Logo chính giữa */}
//         <div className="flex justify-center flex-1">
//           <h1 className="text-5xl font-extrabold text-black">
//             The<span className="text-sky-900">Boys</span>
//           </h1>
//         </div>

//         {/* Bên phải - Hiển thị tuỳ theo trạng thái đăng nhập */}
//         <div className="flex items-center gap-3">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 to="/personal"
//                 className="bg-green-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700 transition"
//               >
//                 <FaUser /> {name}
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="bg-gray-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-700 transition"
//               >
//                 <FaSignOutAlt /> Đăng xuất
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-red-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-red-700 transition"
//               >
//                 <FaUser /> Đăng nhập
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-gray-200 text-black px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-300 transition"
//               >
//                 + Đăng ký
//               </Link>
//             </>
//           )}
//           <Link
//             to="/stores"
//             className="bg-blue-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700 transition"
//           >
//             <FaMapMarkerAlt /> Cửa hàng
//           </Link>
//         </div>
//       </div>

//       {/* Thanh tìm kiếm */}
//       <div className="flex justify-center mt-3">
//         <div className="relative w-1/2 flex items-center border border-gray-400 rounded-full px-4 py-2 bg-white">
//           <input
//             type="text"
//             placeholder="Bạn muốn tìm gì?"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-1 focus:outline-none"
//           />
//           <FaSearch className="text-gray-600 cursor-pointer" />
//           {search && suggestions.length > 0 && (
//             <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto z-50">
//               {suggestions.map((product) => (
//                 <div
//                   key={product.id}
//                   className="flex items-center p-2 hover:bg-gray-100 border-b cursor-pointer group relative"
//                 >
//                   <img
//                     src={product.photo}
//                     alt={product.nameProduct}
//                     className="w-14 h-14 object-cover mr-3 rounded-md"
//                   />
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold">
//                       {product.nameProduct}
//                     </p>
//                     <p className="text-xs text-red-500 font-bold">
//                       {product.salePrice}đ
//                     </p>
//                   </div>
//                   <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
//                     <button
//                       onClick={() => handleViewProduct(product.id)}
//                       className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105 hover:shadow-lg"
//                     >
//                       🛒 Mua Ngay
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Menu nhỏ dưới */}
//       <div className="flex justify-center max-w-7xl mx-auto mt-4 gap-8 text-sm">
//         <div className="flex flex-col items-center cursor-pointer hover:text-red-600">
//           <FaClipboardCheck size={20} />
//           <span>Kiểm tra</span>
//         </div>
//         <Link
//           to="/favorites"
//           className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//         >
//           <FaHeart size={20} />
//           <span>Yêu thích</span>
//         </Link>
//         <Link
//           to="/cart"
//           className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//         >
//           <FaShoppingCart size={20} />
//           <span>Giỏ hàng</span>
//         </Link>
//         <Link
//           to="/products"
//           className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//         >
//           <FaStar size={20} />
//           <span>Sản Phẩm</span>
//         </Link>
//         {isLoggedIn && (
//           <Link
//             to="/personal"
//             className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
//           >
//             <FaUser size={20} />
//             <span>Cá nhân</span>
//           </Link>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaHeart,
  FaClipboardCheck,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";
import ProductService from "../../services/ProductService";

const Header = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy trạng thái user từ Redux
  const { isLoggedIn, name } = useSelector((state) => state.user);
  console.log("Redux user state:", { isLoggedIn, name });

  // Xử lý tìm kiếm sản phẩm
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
      console.log("Dữ liệu gợi ý tìm kiếm:", response.content);
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

  // Xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Xử lý điều hướng đến trang chi tiết sản phẩm
  const handleViewProduct = async (productId) => {
    try {
      console.log("Lấy chi tiết sản phẩm với productId:", productId);
      const productDetails = await ProductService.getProductById(productId);
      console.log("Chi tiết sản phẩm:", productDetails);
      if (productDetails && productDetails.productCode) {
        navigate(`/view-product/${productDetails.productCode}`);
      } else {
        alert("Không thể tìm thấy mã sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      alert("Không thể xem chi tiết sản phẩm. Vui lòng thử lại.");
    }
  };

  return (
    <header className="border-b border-red-400 p-3 shadow-md bg-white">
      {/* Thanh trên cùng */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Bên trái - Chào mừng */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-red-500">
            {isLoggedIn ? `Xin chào, ${name}!` : "The Boys xin chào!"}
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
            The<span className="text-sky-900">Boys</span>
          </h1>
        </div>

        {/* Bên phải - Hiển thị tuỳ theo trạng thái đăng nhập */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to={`/personal`}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700 transition"
              >
                <FaUser /> {name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-700 transition"
              >
                <FaSignOutAlt /> Đăng xuất
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
          <Link
            to="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+Cao+%C4%91%E1%BA%B3ng+FPT+Polytechnic+c%C6%A1+s%E1%BB%9F+H%C3%A0+Nam/@20.8253938,105.6755226,68081m/data=!3m1!1e3!4m10!1m2!2m1!1sfpt+poly!3m6!1s0x3135cf62d752dc67:0xd79f03899b4e83d8!8m2!3d20.6037973!4d105.9344136!15sCghmcHQgcG9seZIBBnNjaG9vbKoBSgoKL20vMDVjMjc4aBABKgwiCGZwdCBwb2x5KAAyHhABIhqQapc8vU_g4dG5nBOkX18DtUJSeB7d1I6lAzIMEAIiCGZwdCBwb2x54AEA!16s%2Fg%2F11v3mhrlb3?entry=ttu&g_ep=EgoyMDI1MDUwNS4wIKXMDSoASAFQAw%3D%3D"
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
          {search && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center p-2 hover:bg-gray-100 border-b cursor-pointer group relative"
                >
                  <img
                    src={product.photo}
                    alt={product.nameProduct}
                    className="w-14 h-14 object-cover mr-3 rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {product.nameProduct}
                    </p>
                    <p className="text-xs text-red-500 font-bold">
                      {product.salePrice}đ
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105 hover:shadow-lg"
                    >
                      🛒 Mua Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu nhỏ dưới */}
      <div className="flex justify-center max-w-7xl mx-auto mt-4 gap-8 text-sm">
        <Link
          to="/collection"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaHeart size={20} />
          <span>Bộ sưu tập</span>
        </Link>
        <Link
          to="/order"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaClipboardCheck size={20} />
          <span>Đơn hàng</span>
        </Link>
        <Link
          to="/cart"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaShoppingCart size={20} />
          <span>Giỏ hàng</span>
        </Link>
        <Link
          to="/products"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaStar size={20} />
          <span>Sản Phẩm</span>
        </Link>
        {isLoggedIn && (
          <Link
            to={`/personal`}
            className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
          >
            <FaUser size={20} />
            <span>Cá nhân</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
