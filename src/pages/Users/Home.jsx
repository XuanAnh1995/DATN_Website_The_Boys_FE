import { Outlet, useNavigate, Link } from "react-router-dom";
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
  const [showText, setShowText] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "https://bepos.io/wp-content/uploads/2023/04/cac-chuong-trinh-khuyen-mai-hay-cho-nha-hang-1.png",
    "https://img.ws.mms.shopee.vn/77f30d91f95a9724233456fb93dc99d7",
    "https://cdn.tgdd.vn/Files/2022/05/12/1432069/san-sale-cuoi-tuan-nhan-ngay-ma-giam-tu-50-ngan.png",
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
        brandIds: filters.selectedBrands?.length
          ? filters.selectedBrands
          : undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: currentPage,
        size: pageSize,
      };
      const response = await ProductService.getFilteredProducts(params);
      setProducts(response?.content || []);
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleSelectProduct = (product) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some((p) => p.id === product.id);
      return isSelected
        ? prevSelected.filter((p) => p.id !== product.id) // Bỏ chọn
        : [...prevSelected, product]; // Chọn thêm
    });
  };

  return (
    <main className="bg-blue-50 text-gray-900">
      <div className="relative w-screen h-[40vh] overflow-hidden mt-2 border border-gray-300 shadow-lg">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
      </div>

      <section className="p-6">
        <h2 className="text-2xl font-bold text-slate-950 mb-4 text-center">
          ƯU ĐÃI DÀNH CHO BẠN
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="relative bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between items-center border border-blue-300 hover:shadow-2xl transition-transform transform hover:-translate-y-1 w-full max-w-xs mx-auto"
            >
              <div className="bg-red-400 px-5 py-4 text-lg font-bold text-white rounded-t-lg w-full text-center border-b-2 border-dashed border-white">
                {voucher.voucherCode}
              </div>
              <div className="text-center py-4 px-2">
                <h3 className="font-bold text-md text-blue-700">
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
      <section className="p-6 mt-4 bg-gray-100 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Về chúng tôi
            </h1>
            <p className="text-gray-800 text-lg">
              The Boys không chỉ là một nhóm, mà còn là biểu tượng của sự mạnh
              mẽ, cá tính và tinh thần bất khuất. Với sự đoàn kết và phong cách
              riêng biệt, chúng tôi đã tạo nên dấu ấn riêng trong thế giới của
              mình.
            </p>
            <p className="text-gray-800 text-lg mt-2">
              Nếu bạn đang tìm kiếm một cộng đồng mang đậm bản sắc, sự kiên
              cường và tinh thần chiến đấu, The Boys chính là nơi dành cho bạn.
            </p>
            {showText && (
              <p className="mt-4 text-lg font-bold text-black">
                TheBoys là thương hiệu shop đẳng cấp,The Boys chính là nơi dành
                cho bạn.
              </p>
            )}
            <button
              className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
              onClick={() => setShowText(!showText)}
            >
              Xem thêm
            </button>
          </div>
          <div className="flex justify-center">
            <h1 className="text-5xl font-extrabold text-black">
              The<span className="text-red-600">Boys</span>
            </h1>
          </div>
        </div>
      </section>
      <section className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-6">
          Sản Phẩm Hot
        </h1>
        <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white w-[280px] h-[520px] p-4 rounded-xl shadow-lg border border-gray-200 transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col group mx-auto"
              >
                {/* Ảnh sản phẩm */}
                <div className="relative">
                  <img
                    src={product.photo || "/path/to/default-image.jpg"}
                    alt={product.nameProduct}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Banner khuyến mãi */}
                <div className="absolute top-[245px] left-0 right-0 bg-red-600 text-white text-center text-xs font-bold py-1">
                  KHUYẾN MÃI ĐẶC BIỆT
                </div>

                <h3 className="text-lg font-semibold mt-3 text-center">
                  {product.nameProduct}
                </h3>
                <div className="text-center flex justify-center gap-2 mt-1">
                  <span className="text-red-600 font-bold text-lg">
                    {formatCurrency(product.salePrice || 0)}
                  </span>
                </div>

                {/* Thanh hiển thị số lượng đã bán */}
                <div className="mt-3 mx-auto w-5/6 h-1 bg-gray-200 relative rounded">
                  <div
                    className="h-full bg-red-500 rounded"
                    style={{
                      width: `${(product.quantitySaled / product.quantity) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-center text-gray-500 text-sm mt-1">
                  Đã bán {product.quantitySaled}
                </p>
                <p className="text-center text-gray-500 text-sm mt-1">
                  Số Lượng {product.quantity}
                </p>

                {/* Nút mua hàng và thêm vào giỏ */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/view-product/${product.id}`)}
                    className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    🛒 Mua Ngay
                  </button>
                  <button className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition">
                    ➕ Giỏ hàng
                  </button>
                  <button
                    onClick={() => toggleSelectProduct(product)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition ${
                      selectedProducts.some((p) => p.id === product.id)
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {selectedProducts.some((p) => p.id === product.id)
                      ? "✔ Đã chọn"
                      : "🔍 Chọn so sánh"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              Không có sản phẩm nào.
            </p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition ${currentPage === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Trước
          </button>
          <span className="px-4 py-2 mx-2 text-lg font-semibold">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition ${currentPage >= totalPages - 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Tiếp
          </button>
        </div>
      </section>
      {selectedProducts.length > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            🔍 So Sánh {selectedProducts.length} Sản Phẩm
          </button>
        </div>
      )}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative overflow-y-auto max-h-[90vh]">
            {/* Nút Đóng */}
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✖
            </button>

            {/* Tiêu Đề */}
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
              🏆 So Sánh Sản Phẩm
            </h2>

            {/* Bảng So Sánh */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-left">
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
                    <tr key={product.id} className="text-center bg-gray-50">
                      {/* Ảnh */}
                      <td className="p-3 border">
                        <img
                          src={product.photo || "/path/to/default-image.jpg"}
                          alt={product.nameProduct}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>

                      {/* Tên Sản Phẩm */}
                      <td className="p-3 border font-semibold">
                        {product.nameProduct}
                      </td>

                      {/* Giá */}
                      <td className="p-3 border text-red-600 font-bold">
                        {formatCurrency(product.salePrice)}
                      </td>

                      {/* Đã Bán */}
                      <td className="p-3 border text-gray-600">
                        {product.quantitySaled}
                      </td>

                      {/* Mô Tả */}
                      <td className="p-3 border text-gray-500">
                        {product.description || "Không có mô tả"}
                      </td>

                      {/* Thương Hiệu */}
                      <td className="p-3 border text-blue-600">
                        {product.brand || "Không rõ"}
                      </td>

                      {/* Đánh Giá */}
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
    </main>
  );
};

export default Layout;
