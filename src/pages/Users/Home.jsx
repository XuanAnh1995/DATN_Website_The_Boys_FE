// import { Outlet, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import VoucherServices from "../../services/VoucherServices";
// import ProductService from "../../services/ProductService";
// import BrandService from "../../services/BrandService";

// const formatCurrency = (amount) => {
//   return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
// };

// const Layout = () => {
//   const [vouchers, setVouchers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [brands, setBrands] = useState([]);
//   const pageSize = 10; // Giữ pageSize là 10 cho Sản Phẩm Hot
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [latestProducts, setLatestProducts] = useState([]);
//   const [bestSellingProducts, setBestSellingProducts] = useState([]);
//   const [showText, setShowText] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showCompareModal, setShowCompareModal] = useState(false);
//   const images = [
//     "/src/assets/banner-thoi-trang-nam-dep-tm-luxury.jpg",
//     "/src/assets/banner-thoi-trang-nam-tinh.jpg",
//     "/src/assets/dung-luong-banner-thoi-trang.jpg",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prevImage) => (prevImage + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     fetchVouchers();
//     fetchBrands();
//     fetchProducts({}); // Sản phẩm Hot
//     fetchBestSellingProducts(); // Sản phẩm Bán Chạy
//     fetchLatestProducts(); // Sản phẩm Mới Nhất
//   }, [currentPage]);

//   const fetchVouchers = async () => {
//     try {
//       const { content } = await VoucherServices.getAllVouchers();
//       setVouchers(content.slice(0, 4));
//     } catch (error) {
//       console.error("Lỗi khi lấy vouchers:", error);
//     }
//   };

//   const fetchBrands = async () => {
//     try {
//       const data = await BrandService.getAllBrands();
//       setBrands(data || []);
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách thương hiệu:", error);
//     }
//   };

//   const fetchProducts = async (filters) => {
//     try {
//       const params = {
//         page: currentPage,
//         size: pageSize,
//         sort: "createdDate,desc", // Sắp xếp theo ngày tạo cho sản phẩm Hot
//       };
//       const response = await ProductService.getFilteredProducts(params);
//       console.log("Danh sách sản phẩm Hot từ API:", response);
//       setProducts(response?.content || response?.data || []);
//       setTotalPages(response?.totalPages || 1);
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách sản phẩm Hot:", error);
//     }
//   };

//   const fetchBestSellingProducts = async () => {
//     try {
//       const params = {
//         page: 0,
//         size: 5, // Lấy 5 sản phẩm bán chạy nhất
//         sort: "quantitySaled,desc", // Sắp xếp theo số lượng bán giảm dần
//       };
//       const response = await ProductService.getFilteredProducts(params);
//       console.log("Danh sách sản phẩm Bán Chạy từ API:", response);
//       setBestSellingProducts(response?.content || response?.data || []);
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách sản phẩm Bán Chạy:", error);
//     }
//   };

//   const fetchLatestProducts = async () => {
//     try {
//       const params = {
//         page: 0,
//         size: 3,
//         sort: "createdDate,desc",
//       };
//       const response = await ProductService.getFilteredProducts(params);
//       console.log("Danh sách sản phẩm mới nhất từ API:", response);
//       setLatestProducts(response?.content || response?.data || []);
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách sản phẩm mới nhất:", error);
//     }
//   };

//   const toggleSelectProduct = (product) => {
//     setSelectedProducts((prevSelected) => {
//       const isSelected = prevSelected.some((p) => p.id === product.id);
//       return isSelected
//         ? prevSelected.filter((p) => p.id !== product.id)
//         : prevSelected.length < 3
//           ? [...prevSelected, product]
//           : prevSelected;
//     });
//   };

//   const handleViewProduct = async (productId) => {
//     try {
//       const productDetails = await ProductService.getProductById(productId);
//       console.log(
//         "Chi tiết sản phẩm từ API /api/products/{id} (Layout):",
//         productDetails
//       );
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

//   const handleAddToCart = (productId) => {
//     console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
//     alert(`Đã thêm sản phẩm ${productId} vào giỏ hàng!`);
//   };

//   const handleBuyNow = (productId) => {
//     console.log(`Mua ngay sản phẩm ${productId}`);
//     alert(`Đã chuyển đến trang thanh toán cho sản phẩm ${productId}!`);
//   };

//   const removeSelectedProduct = (productId) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
//   };

//   return (
//     <main className="bg-gray-50 text-gray-900">
//       {/* Banner */}
//       <div className="relative w-screen h-[40vh] overflow-hidden mt-2 border border-gray-200 shadow-lg">
//         <img
//           src={images[currentImage]}
//           alt="Banner"
//           className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/50 to-transparent flex items-center justify-center">
//           <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
//             Chào mừng đến với TheBoys!
//           </h1>
//         </div>
//       </div>

//       {/* Vouchers Section */}
//       <section className="p-6 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-[#1E3A8A] mb-6 text-center">
//           Ưu Đãi Dành Cho Bạn
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {vouchers.map((voucher) => (
//             <div
//               key={voucher.id}
//               className="relative bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between items-center border border-[#1E3A8A]/30 hover:shadow-xl hover:border-[#1E3A8A] transition-transform transform hover:-translate-y-1 w-full max-w-xs mx-auto"
//             >
//               <div className="bg-[#1E3A8A] px-5 py-4 text-lg font-bold text-white rounded-t-lg w-full text-center border-b-2 border-dashed border-white">
//                 {voucher.voucherCode}
//               </div>
//               <div className="text-center py-4 px-2">
//                 <h3 className="font-bold text-md text-[#1E3A8A]">
//                   {voucher.voucherName}
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   Giảm {voucher.reducedPercent}%
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   Đơn từ {formatCurrency(voucher.minCondition)}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   HSD: {new Date(voucher.endDate).toLocaleDateString()}
//                 </p>
//                 <button className="mt-2 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-md hover:bg-[#163172] transition">
//                   Sử dụng ngay
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Hot Products Section */}
//       <section className="p-6 max-w-7xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-6">
//           Sản Phẩm Hot
//         </h1>
//         <div className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
//           <div className="inline-flex gap-6">
//             {products.length > 0 ? (
//               products.slice(0, 10).map((product) => (
//                 <div
//                   key={product.id}
//                   className="inline-block bg-white w-[220px] h-[400px] p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group relative"
//                 >
//                   <div className="relative">
//                     <img
//                       src={
//                         product.photo || "https://via.placeholder.com/200x250"
//                       }
//                       alt={product.productName || product.nameProduct}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     {product.importPrice &&
//                       product.importPrice > product.salePrice && (
//                         <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-xs font-bold py-1 px-2 rounded-full">
//                           Giảm{" "}
//                           {Math.round(
//                             ((product.importPrice - product.salePrice) /
//                               product.importPrice) *
//                               100
//                           )}
//                           %
//                         </div>
//                       )}
//                     <div className="absolute top-2 right-2 text-[#1E3A8A] hover:text-[#163172]">
//                       ♥
//                     </div>
//                   </div>
//                   <h3 className="text-md font-semibold text-center text-gray-800 mt-2 truncate">
//                     {product.productName ||
//                       product.nameProduct ||
//                       "Tên sản phẩm"}
//                   </h3>
//                   <div className="text-center mt-2">
//                     <span className="text-[#1E3A8A] font-bold text-lg">
//                       {formatCurrency(product.salePrice || 0)}
//                     </span>
//                     {product.importPrice &&
//                       product.importPrice > product.salePrice && (
//                         <span className="text-gray-500 line-through text-sm ml-2">
//                           {formatCurrency(product.importPrice)}
//                         </span>
//                       )}
//                   </div>
//                   {/* Nút sẽ ẩn và chỉ hiện khi hover */}
//                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
//                     <button
//                       onClick={() => handleViewProduct(product.id)}
//                       className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105"
//                     >
//                       📋 Xem
//                     </button>
//                     <button
//                       onClick={() => toggleSelectProduct(product)}
//                       className={`px-3 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 ${
//                         selectedProducts.some((p) => p.id === product.id)
//                           ? "bg-green-600 text-white hover:bg-green-700"
//                           : "bg-gray-300 text-black hover:bg-gray-400"
//                       }`}
//                     >
//                       {selectedProducts.some((p) => p.id === product.id)
//                         ? "✔ Chọn"
//                         : "🔍 So sánh"}
//                     </button>
//                   </div>
//                   <div className="mt-2 mx-auto w-4/5 h-2 bg-gray-200 rounded relative">
//                     <div
//                       className="h-full bg-[#1E3A8A] rounded"
//                       style={{
//                         width: `${Math.min(
//                           (product.quantitySaled / product.quantity) * 100 || 0,
//                           100
//                         )}%`,
//                       }}
//                     />
//                   </div>
//                   <p className="text-center text-gray-500 text-xs mt-1">
//                     Đã bán: {product.quantitySaled || 0}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center w-full">
//                 Không có sản phẩm nào.
//               </p>
//             )}
//           </div>
//           <button
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1E3A8A] text-white p-2 rounded-full hover:bg-[#163172] transition"
//             onClick={() => {
//               const container = document.querySelector(
//                 ".Layout section:nth-child(4) .overflow-x-auto"
//               );
//               container.scrollLeft += 500;
//             }}
//           >
//             ›
//           </button>
//         </div>
//       </section>
//       <section className="p-6 mt-4 bg-[#1E3A8A]/5 rounded-lg shadow-lg max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">
//               Về chúng tôi
//             </h1>
//             <p className="text-gray-700 text-lg">
//               The Boys không chỉ là một nhóm, mà còn là biểu tượng của sự mạnh
//               mẽ, cá tính và tinh thần bất khuất. Với sự đoàn kết và phong cách
//               riêng biệt, chúng tôi đã tạo nên dấu ấn riêng trong thế giới của
//               mình.
//             </p>
//             <p className="text-gray-700 text-lg mt-2">
//               Nếu bạn đang tìm kiếm một cộng đồng mang đậm bản sắc, sự kiên
//               cường và tinh thần chiến đấu, The Boys chính là nơi dành cho bạn.
//             </p>
//             {showText && (
//               <p className="mt-4 text-lg font-bold text-[#1E3A8A]">
//                 TheBoys là thương hiệu shop đẳng cấp, The Boys chính là nơi dành
//                 cho bạn.
//               </p>
//             )}
//             <button
//               className="mt-4 px-6 py-2 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-md hover:bg-[#163172] transition"
//               onClick={() => setShowText(!showText)}
//             >
//               {showText ? "Thu gọn" : "Xem thêm"}
//             </button>
//           </div>
//           <div className="flex justify-center">
//             <h1 className="text-5xl font-extrabold text-gray-800">
//               The<span className="text-[#1E3A8A]">Boys</span>
//             </h1>
//           </div>
//         </div>
//       </section>
//       {/* Best Selling Products Section */}
//       <section className="p-6 max-w-7xl mx-auto mt-8">
//         <h1 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-6">
//           Sản Phẩm Bán Chạy
//         </h1>
//         <div className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
//           <div className="inline-flex gap-6">
//             {bestSellingProducts.length > 0 ? (
//               bestSellingProducts.slice(0, 5).map((product) => (
//                 <div
//                   key={product.id}
//                   className="inline-block bg-white w-[220px] h-[400px] p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group relative"
//                 >
//                   <div className="relative">
//                     <img
//                       src={
//                         product.photo || "https://via.placeholder.com/200x250"
//                       }
//                       alt={product.productName || product.nameProduct}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     {product.importPrice &&
//                       product.importPrice > product.salePrice && (
//                         <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-xs font-bold py-1 px-2 rounded-full">
//                           Giảm{" "}
//                           {Math.round(
//                             ((product.importPrice - product.salePrice) /
//                               product.importPrice) *
//                               100
//                           )}
//                           %
//                         </div>
//                       )}
//                     <div className="absolute top-2 right-2 text-[#1E3A8A] hover:text-[#163172]">
//                       ♥
//                     </div>
//                   </div>
//                   <h3 className="text-md font-semibold text-center text-gray-800 mt-2 truncate">
//                     {product.productName ||
//                       product.nameProduct ||
//                       "Tên sản phẩm"}
//                   </h3>
//                   <div className="text-center mt-2">
//                     <span className="text-[#1E3A8A] font-bold text-lg">
//                       {formatCurrency(product.salePrice || 0)}
//                     </span>
//                     {product.importPrice &&
//                       product.importPrice > product.salePrice && (
//                         <span className="text-gray-500 line-through text-sm ml-2">
//                           {formatCurrency(product.importPrice)}
//                         </span>
//                       )}
//                   </div>
//                   {/* Nút sẽ ẩn và chỉ hiện khi hover */}
//                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
//                     <button
//                       onClick={() => handleViewProduct(product.id)}
//                       className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105"
//                     >
//                       📋 Xem
//                     </button>
//                     <button
//                       onClick={() => toggleSelectProduct(product)}
//                       className={`px-3 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 ${
//                         selectedProducts.some((p) => p.id === product.id)
//                           ? "bg-green-600 text-white hover:bg-green-700"
//                           : "bg-gray-300 text-black hover:bg-gray-400"
//                       }`}
//                     >
//                       {selectedProducts.some((p) => p.id === product.id)
//                         ? "✔ Chọn"
//                         : "🔍 So sánh"}
//                     </button>
//                   </div>
//                   <div className="mt-2 mx-auto w-4/5 h-2 bg-gray-200 rounded relative">
//                     <div
//                       className="h-full bg-[#1E3A8A] rounded"
//                       style={{
//                         width: `${Math.min(
//                           (product.quantitySaled / product.quantity) * 100 || 0,
//                           100
//                         )}%`,
//                       }}
//                     />
//                   </div>
//                   <p className="text-center text-gray-500 text-xs mt-1">
//                     Đã bán: {product.quantitySaled || 0}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center w-full">
//                 Không có sản phẩm nào.
//               </p>
//             )}
//           </div>
//           <button
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1E3A8A] text-white p-2 rounded-full hover:bg-[#163172] transition"
//             onClick={() => {
//               const container = document.querySelector(
//                 ".Layout section:nth-child(5) .overflow-x-auto"
//               );
//               container.scrollLeft += 500;
//             }}
//           >
//             ›
//           </button>
//         </div>
//       </section>
//       {selectedProducts.length > 1 && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => setShowCompareModal(true)}
//             className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:scale-105"
//           >
//             🔍 So Sánh {selectedProducts.length} Sản Phẩm
//           </button>
//         </div>
//       )}
//       <section className="p-6 max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row gap-6 items-start">
//           {/* Left Banner */}
//           <div className="w-full md:w-1/2">
//             <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
//               <img
//                 src="https://via.placeholder.com/600x400?text=Bộ+Sưu+Tập+Mới+Nhất"
//                 alt="Latest Collection Banner"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/50 to-transparent flex items-center justify-center">
//                 <h2 className="text-4xl font-extrabold text-white drop-shadow-lg text-center">
//                   Bộ Sưu Tập Mới Nhất
//                 </h2>
//               </div>
//               <button className="absolute bottom-4 right-4 bg-[#1E3A8A] text-white px-4 py-2 rounded-md hover:bg-[#163172] transition">
//                 Xem ngay
//               </button>
//             </div>
//           </div>

//           {/* Right Product Grid */}
//           <div className="w-full md:w-1/2">
//             <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4 text-center md:text-left">
//               Sản Phẩm Mới Nhất
//             </h2>
//             <p className="text-gray-600 mb-6 text-center md:text-left">
//               Khám phá bộ sưu tập thời trang mới nhất từ The Boys, phong cách
//               hiện đại, phù hợp với mọi dịp.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
//               {latestProducts.slice(0, 3).map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white w-full max-w-[180px] p-3 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group relative"
//                 >
//                   <div className="relative">
//                     <img
//                       src={
//                         product.photo || "https://via.placeholder.com/200x250"
//                       }
//                       alt={product.productName || product.nameProduct}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     {product.salePrice < product.importPrice && (
//                       <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-xs font-bold py-1 px-2 rounded-full">
//                         Giảm{" "}
//                         {Math.round(
//                           ((product.importPrice - product.salePrice) /
//                             product.importPrice) *
//                             100
//                         )}
//                         %
//                       </div>
//                     )}
//                   </div>
//                   <h3 className="text-md font-semibold text-center text-gray-800 mt-2 truncate">
//                     {product.productName ||
//                       product.nameProduct ||
//                       "Tên sản phẩm"}
//                   </h3>
//                   <div className="text-center mt-1">
//                     <span className="text-[#1E3A8A] font-bold text-md">
//                       {formatCurrency(product.salePrice || 0)}
//                     </span>
//                     {product.importPrice &&
//                       product.importPrice > product.salePrice && (
//                         <span className="text-gray-500 line-through text-xs ml-1">
//                           {formatCurrency(product.importPrice)}
//                         </span>
//                       )}
//                   </div>
//                   {/* Nút hover */}
//                   <div className="absolute bottom-3 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-1 px-2">
//                     <button
//                       onClick={() => handleViewProduct(product.id)}
//                       className="bg-[#1E3A8A] text-white text-xs font-semibold py-1 px-2 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105"
//                     >
//                       📋 Xem
//                     </button>
//                     <button
//                       onClick={() => toggleSelectProduct(product)}
//                       className={`px-2 py-1 rounded-md text-xs font-semibold shadow-md transition-all duration-300 hover:scale-105 ${
//                         selectedProducts.some((p) => p.id === product.id)
//                           ? "bg-green-600 text-white hover:bg-green-700"
//                           : "bg-gray-300 text-black hover:bg-gray-400"
//                       }`}
//                     >
//                       {selectedProducts.some((p) => p.id === product.id)
//                         ? "✔ Đã chọn"
//                         : "🔍 So sánh"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 text-center md:text-right">
//               <a
//                 href="#"
//                 className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
//               >
//                 Xem tất cả
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {selectedProducts.length > 1 && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => setShowCompareModal(true)}
//             className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:scale-105"
//           >
//             🔍 So Sánh {selectedProducts.length} Sản Phẩm
//           </button>
//         </div>
//       )}

//       {showCompareModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={() => setShowCompareModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-300"
//             >
//               ✖
//             </button>
//             <h2 className="text-3xl font-bold text-center text-[#1E90FF] mb-6">
//               🏆 So Sánh Sản Phẩm
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full border border-gray-300">
//                 <thead>
//                   <tr className="bg-[#1E90FF]/10 text-gray-700">
//                     <th className="p-3 border">Ảnh</th>
//                     <th className="p-3 border">Tên Sản Phẩm</th>
//                     <th className="p-3 border">Giá Bán</th>
//                     <th className="p-3 border">Đã Bán</th>
//                     <th className="p-3 border">Mô Tả</th>
//                     <th className="p-3 border">Thương Hiệu</th>
//                     <th className="p-3 border">Đánh Giá ⭐</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedProducts.map((product) => (
//                     <tr
//                       key={product.id}
//                       className="text-center bg-gray-50 hover:bg-[#1E90FF]/5 transition-colors duration-200"
//                     >
//                       <td className="p-3 border">
//                         <img
//                           src={product.photo || "/path/to/default-image.jpg"}
//                           alt={product.productName || product.nameProduct}
//                           className="w-20 h-20 object-cover rounded-md"
//                         />
//                       </td>
//                       <td className="p-3 border font-semibold">
//                         {product.productName || product.nameProduct}
//                       </td>
//                       <td className="p-3 border text-[#1E90FF] font-bold">
//                         {formatCurrency(product.salePrice)}
//                       </td>
//                       <td className="p-3 border text-gray-600">
//                         {product.quantitySaled || 0}
//                       </td>
//                       <td className="p-3 border text-gray-500">
//                         {product.description || "Không có mô tả"}
//                       </td>
//                       <td className="p-3 border text-[#1E90FF]">
//                         {product.brand?.brandName ||
//                           product.brand ||
//                           "Không rõ"}
//                       </td>
//                       <td className="p-3 border text-yellow-500 font-semibold">
//                         {product.rating || "Chưa có"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Customer Reviews Section */}
//       <div className="max-w-screen-xl mx-auto p-6 bg-gray-50">
//         <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
//           <div className="md:w-1/2 text-center md:text-left">
//             <div className="text-5xl text-[#1E3A8A] mb-4">“</div>
//             <h1 className="text-4xl font-bold text-[#1E3A8A] mb-4">
//               Khách Hàng Nói Gì Về The Boys
//             </h1>
//             <p className="text-gray-600">Cảm ơn sự tin tưởng của quý khách</p>
//           </div>
//           <div className="md:w-1/2">
//             <div className="bg-[#1E3A8A] text-white p-6 rounded-lg shadow-lg">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <img
//                     src="https://via.placeholder.com/50"
//                     alt="Ảnh đại diện khách hàng"
//                     className="w-12 h-12 rounded-full"
//                   />
//                   <div>
//                     <h3 className="font-bold">Hoàng Dung</h3>
//                     <p className="text-sm text-gray-200">
//                       Khách hàng thân thiết
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex gap-1">
//                   {[...Array(5)].map((_, index) => (
//                     <svg
//                       key={index}
//                       className="w-5 h-5 text-yellow-400"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//               </div>
//               <p className="text-sm">
//                 Đáng giá từng đồng, áo bền đẹp, thiết kế phong cách, giá tốt hơn
//                 chỗ khác. Ủng hộ nhiệt tình!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Latest News Section */}
//       <div className="max-w-screen-xl mx-auto p-6">
//         <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-8">
//           Tin Tức Mới Nhất
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <div className="relative">
//               <img
//                 src="https://via.placeholder.com/300x200"
//                 alt="Tin tức 1"
//                 className="w-full h-48 object-cover"
//               />
//               <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
//                 21/02/2024
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-2">
//                 7 Kiểu Áo Sơ Mi Nam Không Bao Giờ Lỗi Thời, Mặc Quanh Năm Vẫn
//                 Đẹp
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Những món đồ kinh điển như sơ mi cài nút, polo, và flannel không
//                 bao giờ lỗi mốt, giúp bạn luôn lịch lãm...
//               </p>
//               <a
//                 href="#"
//                 className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
//               >
//                 Đọc Tiếp
//               </a>
//             </div>
//           </div>
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <div className="relative">
//               <img
//                 src="https://via.placeholder.com/300x200"
//                 alt="Tin tức 2"
//                 className="w-full h-48 object-cover"
//               />
//               <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
//                 21/02/2024
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-2">
//                 Áo “The Boy” Xuất Hiện Trong Bộ Phim Thời Trang Mới Nhất
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Áo đặc trưng của chúng tôi gây chú ý trong một bộ phim gần đây,
//                 được khen ngợi vì form dáng đẹp và hiện đại...
//               </p>
//               <a
//                 href="#"
//                 className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
//               >
//                 Đọc Tiếp
//               </a>
//             </div>
//           </div>
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <div className="relative">
//               <img
//                 src="https://via.placeholder.com/300x200"
//                 alt="Tin tức 3"
//                 className="w-full h-48 object-cover"
//               />
//               <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
//                 21/02/2024
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-2">
//                 Mẹo Tủ Đồ: Phong Cách Anh Quốc Thanh Lịch Với Áo The Boy
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Sự tinh tế nhẹ nhàng với áo may đo của chúng tôi, lấy cảm hứng
//                 từ phong cách Anh Quốc vượt thời gian...
//               </p>
//               <a
//                 href="#"
//                 className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
//               >
//                 Đọc Tiếp
//               </a>
//             </div>
//           </div>
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <div className="relative">
//               <img
//                 src="https://via.placeholder.com/300x200"
//                 alt="Tin tức 4"
//                 className="w-full h-48 object-cover"
//               />
//               <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
//                 21/02/2024
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-2">
//                 Tủ Đồ Tối Giản Là Gì? Chìa Khóa Chọn Áo Thông Minh
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Xây dựng bộ sưu tập áo đa năng với The Boy—phong cách, tiết
//                 kiệm, phù hợp mọi dịp...
//               </p>
//               <a
//                 href="#"
//                 className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
//               >
//                 Đọc Tiếp
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Outlet />
//     </main>
//   );
// };

// export default Layout;
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VoucherServices from "../../services/VoucherServices";
import ProductService from "../../services/ProductService";
import BrandService from "../../services/BrandService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const Layout = () => {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const pageSize = 10; // Keep pageSize as 10 for Hot Products
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [showText, setShowText] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const images = [
    // "/src/assets/Black and White Vintage Illustration Men's Fashion Banner (1).png",
    // "/src/assets/Facing to camera business man yellow blue Youtube Thumbnail.png",
    "/src/assets/Black and White Vintage Illustration Men's Fashion Banner.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVouchers();
    fetchBrands();
    fetchProducts({}); // Hot Products
    fetchBestSellingProducts(); // Best Selling Products
    fetchLatestProducts(); // Latest Products
  }, [currentPage]);

  const fetchVouchers = async () => {
    try {
      const { content } = await VoucherServices.getAllVouchers();
      setVouchers(content.slice(0, 4));
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await BrandService.getAllBrands();
      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchProducts = async (filters) => {
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: "createdDate,desc", // Sort by creation date for Hot Products
      };
      const response = await ProductService.getFilteredProducts(params);
      console.log("Hot Products from API:", response);
      setProducts(response?.content || response?.data || []);
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching Hot Products:", error);
    }
  };

  const fetchBestSellingProducts = async () => {
    try {
      const params = {
        page: 0,
        size: 5, // Fetch 5 best-selling products
        sort: "quantitySaled,desc", // Sort by quantity sold descending
      };
      const response = await ProductService.getFilteredProducts(params);
      console.log("Best Selling Products from API:", response);
      setBestSellingProducts(response?.content || response?.data || []);
    } catch (error) {
      console.error("Error fetching Best Selling Products:", error);
    }
  };

  const fetchLatestProducts = async () => {
    try {
      const params = {
        page: 0,
        size: 3,
        sort: "id,desc", // Sort by ID descending to show products with highest IDs first
      };
      const response = await ProductService.getFilteredProducts(params);
      console.log("Latest Products from API:", response);
      setLatestProducts(response?.content || response?.data || []);
    } catch (error) {
      console.error("Error fetching Latest Products:", error);
    }
  };

  const toggleSelectProduct = (product) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some((p) => p.id === product.id);
      return isSelected
        ? prevSelected.filter((p) => p.id !== product.id)
        : prevSelected.length < 3
          ? [...prevSelected, product]
          : prevSelected;
    });
  };

  const handleViewProduct = async (productId) => {
    try {
      const productDetails = await ProductService.getProductById(productId);
      console.log(
        "Product details from API /api/products/{id} (Layout):",
        productDetails
      );
      if (productDetails && productDetails.productCode) {
        navigate(`/view-product/${productDetails.productCode}`);
      } else {
        alert("Product code not found.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Unable to view product details. Please try again.");
    }
  };

  const handleAddToCart = (productId) => {
    console.log(`Adding product ${productId} to cart`);
    alert(`Added product ${productId} to cart!`);
  };

  const handleBuyNow = (productId) => {
    console.log(`Buying product ${productId} now`);
    alert(`Proceeding to checkout for product ${productId}!`);
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <main className="bg-gray-50 text-gray-900">
      {/* Banner */}
      <div className="relative w-screen h-screen overflow-hidden border border-gray-200 shadow-lg">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/50 to-transparent flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {/* Thêm nội dung tiêu đề nếu cần */}
          </h1>
        </div>
      </div>

      {/* Vouchers Section */}
      <section className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1E3A8A] mb-6 text-center">
          Ưu Đãi Dành Cho Bạn
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="relative bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between items-center border border-[#1E3A8A]/30 hover:shadow-xl hover:border-[#1E3A8A] transition-transform transform hover:-translate-y-1 w-full max-w-xs mx-auto"
            >
              <div className="bg-[#1E3A8A] px-5 py-4 text-lg font-bold text-white rounded-t-lg w-full text-center border-b-2 border-dashed border-white">
                {voucher.voucherCode}
              </div>
              <div className="text-center py-4 px-2">
                <h3 className="font-bold text-md text-[#1E3A8A]">
                  {voucher.voucherName}
                </h3>
                <p className="text-gray-600 text-sm">
                  Giảm {voucher.reducedPercent}%
                </p>
                <p className="text-gray-600 text-sm">
                  Đơn từ {formatCurrency(voucher.minCondition)}
                </p>
                <p className="text-xs text-gray-500">
                  HSD: {new Date(voucher.endDate).toLocaleDateString()}
                </p>
                <button className="mt-2 px-4 py-2 bg-[#1E3A8A] text-white text-sm font-semibold rounded-md hover:bg-[#163172] transition">
                  Sử dụng ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hot Products Section */}
      <section className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-6">
          Sản Phẩm Hot
        </h1>
        <div className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="inline-flex gap-6">
            {products.length > 0 ? (
              products.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  className="inline-block bg-white w-[220px] h-[400px] p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group relative"
                >
                  <div className="relative">
                    <img
                      src={
                        product.photo || "https://via.placeholder.com/200x250"
                      }
                      alt={product.productName || product.nameProduct}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.importPrice &&
                      product.importPrice > product.salePrice && (
                        <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-xs font-bold py-1 px-2 rounded-full">
                          Giảm{" "}
                          {Math.round(
                            ((product.importPrice - product.salePrice) /
                              product.importPrice) *
                              100
                          )}
                          %
                        </div>
                      )}
                    <div className="absolute top-2 right-2 text-[#1E3A8A] hover:text-[#163172]">
                      ♥
                    </div>
                  </div>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 truncate">
                    {product.productName ||
                      product.nameProduct ||
                      "Tên sản phẩm"}
                  </h3>
                  <div className="text-center mt-2">
                    <span className="text-[#1E3A8A] font-bold text-lg">
                      {formatCurrency(product.salePrice || 0)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105"
                    >
                      📋 Xem
                    </button>
                    <button
                      onClick={() => toggleSelectProduct(product)}
                      className={`px-3 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }`}
                    >
                      {selectedProducts.some((p) => p.id === product.id)
                        ? "✔ Chọn"
                        : "🔍 So sánh"}
                    </button>
                  </div>
                  <div className="mt-2 mx-auto w-4/5 h-2 bg-gray-200 rounded relative">
                    <div
                      className="h-full bg-[#1E3A8A] rounded"
                      style={{
                        width: `${Math.min(
                          (product.quantitySaled / product.quantity) * 100 || 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-1">
                    Đã bán: {product.quantitySaled || 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Không có sản phẩm nào.
              </p>
            )}
          </div>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1E3A8A] text-white p-2 rounded-full hover:bg-[#163172] transition"
            onClick={() => {
              const container = document.querySelector(
                ".Layout section:nth-child(4) .overflow-x-auto"
              );
              container.scrollLeft += 500;
            }}
          >
            ›
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="p-6 mt-4 bg-[#1E3A8A]/5 rounded-lg shadow-lg max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">
              Về chúng tôi
            </h1>
            <p className="text-gray-700 text-lg">
              The Boys không chỉ là một nhóm, mà còn là biểu tượng của sự mạnh
              mẽ, cá tính và tinh thần bất khuất. Với sự đoàn kết và phong cách
              riêng biệt, chúng tôi đã tạo nên dấu ấn riêng trong thế giới của
              mình.
            </p>
            <p className="text-gray-700 text-lg mt-2">
              Nếu bạn đang tìm kiếm một cộng đồng mang đậm bản sắc, sự kiên
              cường và tinh thần chiến đấu, The Boys chính là nơi dành cho bạn.
            </p>
            {showText && (
              <p className="mt-4 text-lg font-bold text-[#1E3A8A]">
                TheBoys là thương hiệu shop đẳng cấp, The Boys chính là nơi dành
                cho bạn.
              </p>
            )}
            <button
              className="mt-4 px-6 py-2 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-md hover:bg-[#163172] transition"
              onClick={() => setShowText(!showText)}
            >
              {showText ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
          <div className="flex justify-center">
            <h1 className="text-5xl font-extrabold text-gray-800">
              The<span className="text-[#1E3A8A]">Boys</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Best Selling Products Section */}
      <section className="p-6 max-w-7xl mx-auto mt-8">
        <h1 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-6">
          Sản Phẩm Bán Chạy
        </h1>
        <div className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="inline-flex gap-6">
            {bestSellingProducts.length > 0 ? (
              bestSellingProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="inline-block bg-white w-[220px] h-[400px] p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group relative"
                >
                  <div className="relative">
                    <img
                      src={
                        product.photo || "https://via.placeholder.com/200x250"
                      }
                      alt={product.productName || product.nameProduct}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.importPrice &&
                      product.importPrice > product.salePrice && (
                        <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-xs font-bold py-1 px-2 rounded-full">
                          Giảm{" "}
                          {Math.round(
                            ((product.importPrice - product.salePrice) /
                              product.importPrice) *
                              100
                          )}
                          %
                        </div>
                      )}
                    <div className="absolute top-2 right-2 text-[#1E3A8A] hover:text-[#163172]">
                      ♥
                    </div>
                  </div>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 truncate">
                    {product.productName ||
                      product.nameProduct ||
                      "Tên sản phẩm"}
                  </h3>
                  <div className="text-center mt-2">
                    <span className="text-[#1E3A8A] font-bold text-lg">
                      {formatCurrency(product.salePrice || 0)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105"
                    >
                      📋 Xem
                    </button>
                    <button
                      onClick={() => toggleSelectProduct(product)}
                      className={`px-3 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }`}
                    >
                      {selectedProducts.some((p) => p.id === product.id)
                        ? "✔ Chọn"
                        : "🔍 So sánh"}
                    </button>
                  </div>
                  <div className="mt-2 mx-auto w-4/5 h-2 bg-gray-200 rounded relative">
                    <div
                      className="h-full bg-[#1E3A8A] rounded"
                      style={{
                        width: `${Math.min(
                          (product.quantitySaled / product.quantity) * 100 || 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-1">
                    Đã bán: {product.quantitySaled || 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Không có sản phẩm nào.
              </p>
            )}
          </div>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1E3A8A] text-white p-2 rounded-full hover:bg-[#163172] transition"
            onClick={() => {
              const container = document.querySelector(
                ".Layout section:nth-child(5) .overflow-x-auto"
              );
              container.scrollLeft += 500;
            }}
          >
            ›
          </button>
        </div>
      </section>

      {selectedProducts.length > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:scale-105"
          >
            🔍 So Sánh {selectedProducts.length} Sản Phẩm
          </button>
        </div>
      )}

      {/* Latest Products Section */}
      <section className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <img
                src="/src/assets/Blue and White T-shirt Products Sale Instagram Post (1).png"
                alt="Latest Collection Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/50 to-transparent flex items-center justify-center">
                <h2 className="text-4xl font-extrabold text-white drop-shadow-lg text-center">
                  Bộ Sưu Tập Mới Nhất
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4 text-center md:text-left">
              Bộ Sưu Tập Đẹp Nhất
            </h2>
            <p className="text-gray-600 mb-6 text-center md:text-left">
              Khám phá bộ sưu tập thời trang mới nhất từ The Boys, phong cách
              hiện đại, phù hợp với mọi dịp.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
              {latestProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="bg-white w-full max-w-[180px] p-3 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group relative"
                >
                  <div className="relative">
                    <img
                      src={
                        product.photo || "https://via.placeholder.com/200x250"
                      }
                      alt={product.productName || product.nameProduct}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.salePrice < product.importPrice && (
                      <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-xs font-bold py-1 px-2 rounded-full">
                        Giảm{" "}
                        {Math.round(
                          ((product.importPrice - product.salePrice) /
                            product.importPrice) *
                            100
                        )}
                        %
                      </div>
                    )}
                  </div>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 truncate">
                    {product.productName ||
                      product.nameProduct ||
                      "Tên sản phẩm"}
                  </h3>
                  <div className="text-center mt-1">
                    <span className="text-[#1E3A8A] font-bold text-md">
                      {formatCurrency(product.salePrice || 0)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-1 px-2">
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-[#1E3A8A] text-white text-xs font-semibold py-1 px-2 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105"
                    >
                      📋 Xem
                    </button>
                    <button
                      onClick={() => toggleSelectProduct(product)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold shadow-md transition-all duration-300 hover:scale-105 ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }`}
                    >
                      {selectedProducts.some((p) => p.id === product.id)
                        ? "✔ Đã chọn"
                        : "🔍 So sánh"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center md:text-right">
              <a
                href="/products"
                className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
              >
                Xem tất cả
              </a>
            </div>
          </div>
        </div>
      </section>

      {selectedProducts.length > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-green-600 hover:scale-105"
          >
            🔍 So Sánh {selectedProducts.length} Sản Phẩm
          </button>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-300"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold text-center text-[#1E90FF] mb-6">
              🏆 So Sánh Sản Phẩm
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-[#1E90FF]/10 text-gray-700">
                    <th className="p-3 border">Ảnh</th>
                    <th className="p-3 border">Tên Sản Phẩm</th>
                    <th className="p-3 border">Giá Bán</th>
                    <th className="p-3 border">Đã Bán</th>
                    <th className="p-3 border">Mô Tả</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="text-center bg-gray-50 hover:bg-[#1E90FF]/5 transition-colors duration-200"
                    >
                      <td className="p-3 border">
                        <img
                          src={product.photo || "/path/to/default-image.jpg"}
                          alt={product.productName || product.nameProduct}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-3 border font-semibold">
                        {product.productName || product.nameProduct}
                      </td>
                      <td className="p-3 border text-[#1E90FF] font-bold">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="p-3 border text-gray-600">
                        {product.quantitySaled || 0}
                      </td>
                      <td className="p-3 border text-gray-500">
                        {product.description || "Không có mô tả"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="max-w-screen-xl mx-auto p-6 bg-gray-50">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="text-5xl text-[#1E3A8A] mb-4">“</div>
            <h1 className="text-4xl font-bold text-[#1E3A8A] mb-4">
              Khách Hàng Nói Gì Về The Boys
            </h1>
            <p className="text-gray-600">Cảm ơn sự tin tưởng của quý khách</p>
          </div>
          <div className="md:w-1/2">
            <div className="bg-[#1E3A8A] text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/src/assets/logo.jpg"
                    alt="Ảnh đại diện khách hàng"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">TheBoys</h3>
                    <p className="text-sm text-gray-200"></p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm">
                Đáng giá từng đồng, áo bền đẹp, thiết kế phong cách, giá tốt hơn
                chỗ khác. Ủng hộ nhiệt tình!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="max-w-screen-xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-8">
          Tin Tức Mới Nhất
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src="/src/assets/tt1.jpg"
                alt="Tin tức 1"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
                21/02/2024
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                7 Kiểu Áo Sơ Mi Nam Không Bao Giờ Lỗi Thời, Mặc Quanh Năm Vẫn
                Đẹp
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Những món đồ kinh điển như sơ mi cài nút, polo, và flannel không
                bao giờ lỗi mốt, giúp bạn luôn lịch lãm...
              </p>
              <a
                href="#"
                className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
              >
                Đọc Tiếp
              </a>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src="/src/assets/tt2.webp"
                alt="Tin tức 2"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
                21/02/2024
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                Áo “The Boy” Xuất Hiện Trong Bộ Phim Thời Trang Mới Nhất
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Áo đặc trưng của chúng tôi gây chú ý trong một bộ phim gần đây,
                được khen ngợi vì form dáng đẹp và hiện đại...
              </p>
              <a
                href="#"
                className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
              >
                Đọc Tiếp
              </a>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src="/src/assets/tt3jpg.jpg"
                alt="Tin tức 3"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
                21/02/2024
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                Mẹo Tủ Đồ: Phong Cách Anh Quốc Thanh Lịch Với Áo The Boy
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Sự tinh tế nhẹ nhàng với áo may đo của chúng tôi, lấy cảm hứng
                từ phong cách Anh Quốc vượt thời gian...
              </p>
              <a
                href="#"
                className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
              >
                Đọc Tiếp
              </a>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src="/src/assets/tt5.jpg"
                alt="Tin tức 4"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-sm">
                21/02/2024
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                Tủ Đồ Tối Giản Là Gì? Chìa Khóa Chọn Áo Thông Minh
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Xây dựng bộ sưu tập áo đa năng với The Boy—phong cách, tiết
                kiệm, phù hợp mọi dịp...
              </p>
              <a
                href="#"
                className="text-[#1E3A8A] font-semibold hover:text-[#163172] transition-colors duration-200"
              >
                Đọc Tiếp
              </a>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </main>
  );
};

export default Layout;
