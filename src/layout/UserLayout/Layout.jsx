import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import VoucherServices from "../../services/VoucherServices";
import SanPhamService from "../../services/ProductService";

const images = [
  "https://static.vecteezy.com/system/resources/previews/002/294/859/original/flash-sale-web-banner-design-e-commerce-online-shopping-header-or-footer-banner-free-vector.jpg",
  "https://file.hstatic.net/1000253775/file/new_banner_pc.jpg",
  "https://file.hstatic.net/1000253775/file/new_banner_pc_copy.jpg",
];

const Layout = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

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
        const response = await SanPhamService.getAllProducts(
          currentPage,
          pageSize
        );
        let data = response?.content || [];
        if (!Array.isArray(data)) {
          throw new Error("Invalid sản phẩm data format");
        }
        setSanPhams(data);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };
    fetchSanPhams();
  }, [currentPage]);

  return (
    <main className="bg-blue-50 text-gray-900">
      <div className="relative w-screen h-[40vh] overflow-hidden mt-2 border border-gray-300 shadow-lg">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover"
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
      <div className="transition-transform transform hover:scale-105 hover:shadow-xl">
        <img
          src="https://file.hstatic.net/1000253775/file/banchay_a01333a0db53411883d51490d22b7eab.jpg"
          alt="Banner cuối"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <section className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          Sản Phẩm Mới
        </h1>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sanPhams.length > 0 ? (
              sanPhams.map((sanPham) => (
                <div
                  key={sanPham.id}
                  className="bg-white w-[300px] h-[450px] p-4 pb-8 rounded-lg shadow-md border border-gray-300 transform transition-transform hover:scale-105 hover:shadow-xl flex flex-col"
                >
                  <img
                    src={
                      sanPham.photo ||
                      "https://th.bing.com/th/id/OIP.SQDwBT12trBENj2yTziTyQAAAA?rs=1&pid=ImgDetMain"
                    }
                    alt={sanPham.productName}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    {sanPham.productName}
                  </h3>
                  <p className="text-gray-700">
                    Mã sản phẩm: {sanPham.productCode}
                  </p>
                  <p className="text-gray-700">Giá: {sanPham.salePrice} VND</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Không có sản phẩm nào.
              </p>
            )}
          </div>
        </div>

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
      </section>

      <Outlet />
    </main>
  );
};

export default Layout;
