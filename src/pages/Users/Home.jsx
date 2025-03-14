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
  const pageSize = 8;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "https://static.vecteezy.com/system/resources/previews/002/294/859/original/flash-sale-web-banner-design-e-commerce-online-shopping-header-or-footer-banner-free-vector.jpg",
    "https://cdn.shopify.com/s/files/1/0021/0970/2202/files/150_New_Arrivals_Main_Banner_1370X600_a54e428c-0030-4078-9a2f-20286f12e604_1920x.jpg?v=1628065313",
    "https://file.hstatic.net/1000253775/file/new_banner_pc_copy.jpg",
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
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          ƯU ĐÃI DÀNH CHO BẠN
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="relative bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between items-center border border-blue-300 hover:shadow-2xl transition-transform transform hover:-translate-y-1 w-full max-w-xs mx-auto"
            >
              <div className="bg-blue-600 px-5 py-4 text-lg font-bold text-white rounded-t-lg w-full text-center border-b-2 border-dashed border-white">
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

      <section className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
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
    </main>
  );
};

export default Layout;
