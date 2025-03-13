import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VoucherServices from "../../services/VoucherServices";
import SanPhamService from "../../services/ProductDetailService";
import BrandService from "../../services/BrandService";

const Layout = () => {
  const [vouchers, setVouchers] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const [newSanPhams, setNewSanPhams] = useState([]);
  const navigate = useNavigate();
  // Lưu thương hiệu được chọn

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const { content } = await VoucherServices.getAllVouchers();
        setVouchers(content.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch vouchers", error);
      }
    };
    fetchVouchers();
  }, []);

  useEffect(() => {
    const fetchNewSanPhams = async () => {
      try {
        const params = { sort: "id,desc", page: 0, size: 8 };
        const response = await SanPhamService.getAllProductDetails(params);
        let data = response?.content || [];
        if (!Array.isArray(data))
          throw new Error("Invalid sản phẩm data format");

        setNewSanPhams(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm mới về:", error);
      }
    };
    fetchNewSanPhams();
  }, []);
  useEffect(() => {
    fetchBrands(); // Lấy danh sách thương hiệu khi trang load
    fetchProducts({});
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await BrandService.getAllBrands(); // Gọi API lấy thương hiệu
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
      };
      const data = await SanPhamService.getAllProductDetails(params);
      setSanPhams(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const params = { sort: "id,desc", page: currentPage, size: pageSize };
        const response = await SanPhamService.getAllProductDetails(params);
        let data = response?.content || [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid sản phẩm data format");
        }

        setSanPhams(data);
        setTotalPages(response?.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchSanPhams();
  }, [currentPage]);
  return (
    <main className="bg-blue-50 text-gray-900">
      {/* Giới Thiệu voucher */}
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
      <div className="transition-transform transform hover:scale-105 hover:shadow-xl">
        <img
          src="https://file.hstatic.net/1000253775/file/banchay_a01333a0db53411883d51490d22b7eab.jpg"
          alt="Banner cuối"
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      {/* Giới Thiệu sản phảm  */}
      <section className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 drop-shadow-lg uppercase text-center mb-6">
          Sản Phẩm Hot
        </h1>

        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 shadow-lg rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700">Thương hiệu:</label>
            <select className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400">
              <option value="">Tất cả</option>
              {["Nike", "Adidas", "Puma", "LV", "Gucci"].map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700">Khoảng giá:</label>
            <input
              type="number"
              placeholder="Từ"
              className="w-20 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Đến"
              className="w-20 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {sanPhams.length > 0 ? (
            sanPhams.map((sanPham) => (
              <div
                key={sanPham.id}
                className="relative bg-white w-[280px] h-[420px] p-4 pb-10 rounded-xl shadow-lg border border-gray-200 transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col group mx-auto"
              >
                <div className="relative">
                  <img
                    src={sanPham.photo || "/path/to/default-image.jpg"}
                    alt={sanPham.product.productName}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold mt-3 text-center">
                  {sanPham.product.productName}
                </h3>
                <p className="text-center text-gray-600">
                  Mã sản phẩm: {sanPham.productDetailCode}
                </p>
                <p className="text-center text-red-600 font-bold text-lg mt-1">
                  {sanPham.salePrice} VND
                </p>

                {/* Hover effect buttons */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/view-product/${sanPham.id}`)}
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

        {/* Phân trang */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Trước
          </button>
          <span className="font-semibold text-gray-700">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau →
          </button>
        </div>
      </section>

      {/* Giới Thiệu */}

      {/* Giới Thiệu hàng mới về */}
      <section className="p-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 drop-shadow-lg uppercase text-center mb-4">
          Sản Phẩm Mới Về
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <img
              src="https://th.bing.com/th/id/OIP.xnsDtWLSdimwjx_0N9Hg5QHaJ4?w=750&h=1000&rs=1&pid=ImgDetMain"
              alt="Banner"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newSanPhams.map((sanPham) => (
              <div
                key={sanPham.id}
                className="relative cursor-pointer bg-white w-[300px] h-[400px] p-3 rounded-lg shadow-md border border-gray-300 hover:shadow-lg hover:scale-105 transition-transform flex flex-col group"
              >
                <img
                  src={
                    sanPham.photo ||
                    "https://cdn.boo.vn/media/catalog/product/1/_/1.2.02.3.18.002.123.23-10200011-bst-1.jpg"
                  }
                  alt={sanPham.product.productName}
                  className="w-full h-52 object-cover rounded-lg"
                />
                <h3 className="text-md font-semibold mt-2">
                  {sanPham.product.productName}
                </h3>
                <p className="text-red-600">{sanPham.salePrice} VND</p>

                {/* Nút hiện lên khi hover */}
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/san-pham/${sanPham.id}`)}
                    className="bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    🛒 Mua Ngay
                  </button>
                  <button
                    onClick={() => addToCart(sanPham)}
                    className="bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-md hover:bg-blue-600 transition"
                  >
                    ➕ Giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Outlet />
    </main>
  );
};

export default Layout;
