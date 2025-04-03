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
  const pageSize = 8;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]); // State for latest products
  const [showText, setShowText] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/src/assets/banner-thoi-trang-nam-dep-tm-luxury.jpg",
    "/src/assets/banner-thoi-trang-nam-tinh.jpg",
    "/src/assets/dung-luong-banner-thoi-trang.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVouchers();
    fetchBrands();
    fetchProducts({});
    fetchLatestProducts(); // Fetch latest products on mount
  }, [currentPage]);

  const fetchVouchers = async () => {
    try {
      const { content } = await VoucherServices.getAllVouchers();
      setVouchers(content.slice(0, 4));
    } catch (error) {
      console.error("Lỗi khi lấy vouchers:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await BrandService.getAllBrands();
      setBrands(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
    }
  };

  const fetchProducts = async (filters) => {
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        brandIds: filters.selectedBrands?.length
          ? filters.selectedBrands
          : undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
      };
      const response = await ProductService.getFilteredProducts(params);
      console.log("Danh sách sản phẩm từ API (Layout):", response);
      setProducts(response?.content || response?.data || []);
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const fetchLatestProducts = async () => {
    try {
      const params = {
        page: 0,
        size: 3, // Fetch 3 latest products
        sort: "createdDate,desc", // Sort by creation date descending
      };
      const response = await ProductService.getFilteredProducts(params);
      console.log("Danh sách sản phẩm mới nhất từ API:", response);
      setLatestProducts(response?.content || response?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm mới nhất:", error);
    }
  };

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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
        "Chi tiết sản phẩm từ API /api/products/{id} (Layout):",
        productDetails
      );
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

  const handleAddToCart = (productId) => {
    console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
    alert(`Đã thêm sản phẩm ${productId} vào giỏ hàng!`);
  };

  const handleBuyNow = (productId) => {
    console.log(`Mua ngay sản phẩm ${productId}`);
    alert(`Đã chuyển đến trang thanh toán cho sản phẩm ${productId}!`);
    // Add logic to redirect to checkout page if needed
  };

  return (
    <main className="bg-gray-50 text-gray-900">
      {/* Banner */}
      <div className="relative w-screen h-[40vh] overflow-hidden mt-2 border border-gray-200 shadow-lg">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E90FF]/50 to-transparent flex items-center justify-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            Chào mừng đến với TheBoys!
          </h1>
        </div>
      </div>

      {/* Vouchers Section */}
      <section className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1E90FF] mb-6 text-center">
          ƯU ĐÃI DÀNH CHO BẠN
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="relative bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between items-center border border-[#1E90FF]/30 hover:shadow-xl hover:border-[#1E90FF] transition-transform transform hover:-translate-y-1 w-full max-w-xs mx-auto"
            >
              <div className="bg-[#1E90FF] px-5 py-4 text-lg font-bold text-white rounded-t-lg w-full text-center border-b-2 border-dashed border-white">
                {voucher.voucherCode}
              </div>
              <div className="text-center py-4 px-2">
                <h3 className="font-bold text-md text-[#1E90FF]">
                  {voucher.voucherName}
                </h3>
                <p className="text-gray-600 text-sm">
                  Giảm {voucher.reducedPercent}%
                </p>
                <p className="text-gray-600 text-sm">
                  Đơn từ {voucher.minCondition} VND
                </p>
                <p className="text-xs text-gray-500">
                  HSD: {new Date(voucher.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="p-6 mt-4 bg-[#1E90FF]/5 rounded-lg shadow-lg max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1E90FF] mb-4">
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
              <p className="mt-4 text-lg font-bold text-[#1E90FF]">
                TheBoys là thương hiệu shop đẳng cấp, The Boys chính là nơi dành
                cho bạn.
              </p>
            )}
            <button
              className="mt-4 px-6 py-2 bg-[#1E90FF] text-white font-semibold rounded-lg shadow-md hover:bg-[#1C86EE] transition"
              onClick={() => setShowText(!showText)}
            >
              {showText ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
          <div className="flex justify-center">
            <h1 className="text-5xl font-extrabold text-gray-800">
              The<span className="text-[#1E90FF]">Boys</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Hot Products Section */}
      <section className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#1E90FF] mb-6">
          Sản Phẩm Hot
        </h1>
        <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white w-[280px] h-[480px] p-4 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#1E90FF] flex flex-col group mx-auto overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.photo || "/path/to/default-image.jpg"}
                    alt={product.productName || product.nameProduct}
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 bg-[#1E90FF] text-white text-xs font-bold py-1 px-2 rounded-br-lg">
                    HOT
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-3 text-center text-gray-800 group-hover:text-[#1E90FF] transition-colors duration-300">
                  {product.productName || product.nameProduct || "Tên sản phẩm"}
                </h3>

                <div className="text-center mt-2">
                  <span className="text-[#1E90FF] font-bold text-lg">
                    {formatCurrency(product.salePrice || 0)}
                  </span>
                  {product.importPrice &&
                    product.importPrice > product.salePrice && (
                      <span className="text-gray-500 line-through text-sm ml-2">
                        {formatCurrency(product.importPrice)}
                      </span>
                    )}
                </div>

                <p className="text-center text-gray-600 text-sm mt-1">
                  Thương hiệu:{" "}
                  {product.brand?.brandName || product.brand || "Không rõ"}
                </p>

                <div className="mt-2 mx-auto w-5/6 h-1 bg-gray-200 rounded relative">
                  <div
                    className="h-full bg-[#1E90FF] rounded transition-all duration-300"
                    style={{
                      width: `${Math.min((product.quantitySaled / product.quantity) * 100 || 0, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-center text-gray-500 text-sm mt-1">
                  Đã bán: {product.quantitySaled || 0} / {product.quantity || 0}
                </p>

                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex-wrap">
                  <button
                    onClick={() => handleViewProduct(product.id)}
                    className="bg-[#1E90FF] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#1C86EE] hover:scale-105 hover:shadow-lg"
                  >
                    📋 Xem chi tiết
                  </button>
                  {/* <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-[#1E90FF] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#1C86EE] hover:scale-105 hover:shadow-lg"
                  >
                    ➕ Giỏ hàng
                  </button>
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    className="bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg"
                  >
                    🛒 Mua Ngay
                  </button> */}
                  <button
                    onClick={() => toggleSelectProduct(product)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${
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
            ))
          ) : (
            <p className="text-gray-500 text-center w-full col-span-full">
              Không có sản phẩm nào được tìm thấy.
            </p>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition-all duration-300 ${
              currentPage === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E90FF] hover:bg-[#1C86EE] hover:scale-105"
            }`}
          >
            Trước
          </button>
          <span className="px-4 py-2 mx-2 text-lg font-semibold text-[#1E90FF]">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition-all duration-300 ${
              currentPage >= totalPages - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E90FF] hover:bg-[#1C86EE] hover:scale-105"
            }`}
          >
            Tiếp
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

      {/* Latest Products Section (Inspired by the Image) */}
      <section className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Left Banner */}
          <div className="md:w-1/2">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://via.placeholder.com/600x400?text=The+Boys+Latest+Collection"
                alt="Latest Collection Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E90FF]/50 to-transparent flex items-center justify-center">
                <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
                  Bộ Sưu Tập Mới Nhất
                </h2>
              </div>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#1E90FF] mb-4">
              Sản Phẩm Mới Nhất
            </h2>
            <p className="text-gray-600 mb-6">
              Khám phá bộ sưu tập áo sơ mi mới nhất từ The Boys, phong cách hiện
              đại, phù hợp với mọi dịp.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E90FF] group"
                >
                  <div className="relative">
                    <img
                      src={product.photo || "/path/to/default-image.jpg"}
                      alt={product.productName || product.nameProduct}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                    {product.salePrice < product.importPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
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
                  <h3 className="text-lg font-semibold mt-3 text-gray-800 group-hover:text-[#1E90FF] transition-colors duration-300">
                    {product.productName ||
                      product.nameProduct ||
                      "Tên sản phẩm"}
                  </h3>
                  <div className="mt-2">
                    <span className="text-[#1E90FF] font-bold text-lg">
                      {formatCurrency(product.salePrice || 0)}
                    </span>
                    {product.importPrice &&
                      product.importPrice > product.salePrice && (
                        <span className="text-gray-500 line-through text-sm ml-2">
                          {formatCurrency(product.importPrice)}
                        </span>
                      )}
                  </div>
                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-[#1E90FF] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#1C86EE] hover:scale-105 hover:shadow-lg"
                    >
                      📋 Xem chi tiết
                    </button>
                    {/* <button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-[#1E90FF] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#1C86EE] hover:scale-105 hover:shadow-lg"
                    >
                      ➕ Giỏ hàng
                    </button>
                    <button
                      onClick={() => handleBuyNow(product.id)}
                      className="bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg"
                    >
                      🛒 Mua Ngay
                    </button> */}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    {["white", "black", "green", "pink"].map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <a
                href="#"
                className="text-[#1E90FF] font-semibold hover:text-[#1C86EE] transition-colors duration-200"
              >
                Xem ngay
              </a>
            </div>
          </div>
        </div>
      </section>

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
                  <tr className="bg-[#1E90FF]/10 text-gray-700 text-left">
                    <th className="p-3 border">Ảnh</th>
                    <th className="p-3 border">Tên Sản Phẩm</th>
                    <th className="p-3 border">Giá Bán</th>
                    <th className="p-3 border">Đã Bán</th>
                    <th className="p-3 border">Mô Tả</th>
                    <th className="p-3 border">Thương Hiệu</th>
                    <th className="p-3 border">Đánh Giá ⭐</th>
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
                      <td className="p-3 border text-[#1E90FF]">
                        {product.brand?.brandName ||
                          product.brand ||
                          "Không rõ"}
                      </td>
                      <td className="p-3 border text-yellow-500 font-semibold">
                        {product.rating || "Chưa có"}
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
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="text-5xl text-blue-600 mb-4">“</div>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Khách Hàng Nói Gì Về The Boy
            </h1>
            <p className="text-gray-600">Cảm ơn sự tin tưởng của quý khách</p>
          </div>
          <div className="md:w-1/2">
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Ảnh đại diện khách hàng"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Hoàng Dung</h3>
                    <p className="text-sm">Khách hàng thân thiết</p>
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

        {/* Latest News Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Tin Tức Mới Nhất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Tin tức 1"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  21/02/2024
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  7 Kiểu Áo Sơ Mi Nam Không Bao Giờ Lỗi Thời, Mặc Quanh Năm Vẫn
                  Đẹp
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Những món đồ kinh điển như sơ mi cài nút, polo, và flannel
                  không bao giờ lỗi mốt, giúp bạn luôn lịch lãm...
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                >
                  Đọc Tiếp
                </a>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Tin tức 2"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  21/02/2024
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  Áo “The Boy” Xuất Hiện Trong Bộ Phim Thời Trang Mới Nhất
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Áo đặc trưng của chúng tôi gây chú ý trong một bộ phim gần
                  đây, được khen ngợi vì form dáng đẹp và hiện đại...
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                >
                  Đọc Tiếp
                </a>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Tin tức 3"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
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
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                >
                  Đọc Tiếp
                </a>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="Tin tức 4"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
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
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                >
                  Đọc Tiếp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
