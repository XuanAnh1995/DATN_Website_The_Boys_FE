import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VoucherServices from "../../services/VoucherServices";
import SanPhamService from "../../services/ProductDetailService";
import BrandService from "../../services/BrandService";
const images = [
  "https://static.vecteezy.com/system/resources/previews/002/294/859/original/flash-sale-web-banner-design-e-commerce-online-shopping-header-or-footer-banner-free-vector.jpg",
  "https://cdn.shopify.com/s/files/1/0021/0970/2202/files/150_New_Arrivals_Main_Banner_1370X600_a54e428c-0030-4078-9a2f-20286f12e604_1920x.jpg?v=1628065313",
  "https://file.hstatic.net/1000253775/file/new_banner_pc_copy.jpg",
];

const Layout = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const [showText, setShowText] = useState(false);
  const [newSanPhams, setNewSanPhams] = useState([]);
  const navigate = useNavigate();
  const [brand, setBrand] = useState(""); // Lưu thương hiệu được chọn

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };
  return (
    <main className="bg-blue-50 text-gray-900">
      <div className="relative w-screen h-[40vh] overflow-hidden mt-2 border border-gray-300 shadow-lg">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
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
      <section className="p-6 flex gap-6">
        {/* Sidebar lọc sản phẩm */}
        <aside className="w-1/4 bg-white p-6 shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
            BỘ LỌC SẢN PHẨM
          </h2>

          {/* Lọc theo thương hiệu */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Thương hiệu:
            </label>
            <div className="flex flex-col gap-3">
              {["Nike", "Adidas", "Puma", "LV", "Gucci"].map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                >
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Lọc theo giá */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Khoảng giá:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Từ"
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Đến"
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Lọc theo kích thước */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Kích thước:
            </label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Lọc theo màu sắc */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Màu sắc:
            </label>
            <div className="flex flex-wrap gap-2">
              {["Đỏ", "Xanh", "Vàng", "Đen", "Trắng"].map((color) => (
                <button
                  key={color}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Nút Áp Dụng */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            Áp dụng bộ lọc
          </button>
        </aside>

        {/* Danh sách sản phẩm */}
        <div className="w-3/4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 drop-shadow-lg uppercase text-center mb-4">
            Sản Phẩm Hot
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sanPhams.length > 0 ? (
              sanPhams.map((sanPham) => (
                <div
                  key={sanPham.id}
                  className="relative cursor-pointer bg-white w-[300px] h-[450px] p-4 pb-10 rounded-lg shadow-md border border-gray-300 transform transition-transform hover:scale-105 hover:shadow-xl flex flex-col group"
                >
                  <img
                    src={
                      sanPham.photo ||
                      "https://th.bing.com/th/id/OIP.SQDwBT12trBENj2yTziTyQAAAA?rs=1&pid=ImgDetMain"
                    }
                    alt={sanPham.product.productName}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    {sanPham.product.productName}
                  </h3>
                  <p className="text-gray-700">
                    Mã sản phẩm: {sanPham.productDetailCode}
                  </p>
                  <p className="text-red-600 font-bold border border-red-600 p-1 rounded-md">
                    Giá: {sanPham.salePrice} VND
                  </p>

                  {/* Nút hiện lên khi hover */}
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/san-pham/${sanPham.id}`)}
                      className="bg-red-500 text-white text-sm font-semibold py-1 px-3 rounded-md shadow-md hover:bg-red-600 transition"
                    >
                      🛒 Mua Ngay
                    </button>
                    <button
                      onClick={() => addToCart(sanPham)}
                      className="bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
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
        </div>
      </section>
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        <span className="text-sm text-gray-700">
          Trang {currentPage + 1} / {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
        >
          {">"}
        </button>
      </div>

      {/* Giới Thiệu */}
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
