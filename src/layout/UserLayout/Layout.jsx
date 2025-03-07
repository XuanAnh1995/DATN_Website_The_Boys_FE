import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import VoucherServices from "../../services/VoucherServices";
import ProductService from "../../services/ProductService";
import ProductDetailService from "../../services/ProductDetailService";
const images = [
  "https://static.vecteezy.com/system/resources/previews/002/294/859/original/flash-sale-web-banner-design-e-commerce-online-shopping-header-or-footer-banner-free-vector.jpg",
  "https://file.hstatic.net/1000253775/file/new_banner_pc.jpg",
  "https://file.hstatic.net/1000253775/file/new_banner_pc_copy.jpg",
];

const Layout = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [vouchers, setVouchers] = useState([]);

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
        setVouchers(content.slice(0, 4)); // Chỉ lấy 4 voucher mới nhất
      } catch (error) {
        console.error("Failed to fetch vouchers", error);
      }
    };
    fetchVouchers();
  }, []);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        console.log("Dữ liệu API trả về:", data);

        // Kiểm tra xem data có phải là mảng không, nếu không thì lấy từ data.products
        const productList = Array.isArray(data) ? data : data?.products || [];
        if (!Array.isArray(productList)) {
          throw new Error("Invalid product data format");
        }

        // Gọi API lấy chi tiết cho từng sản phẩm
        const productsWithDetails = await Promise.all(
          productList.slice(0, 10).map(async (product) => {
            try {
              const details = await ProductDetailService.getProductDetails(
                product.id
              );

              return {
                id: product.id,
                productName: details?.productName || product.productName, // Tên sản phẩm
                productCode: details?.productCode || "N/A", // Mã sản phẩm
                salePrice: details?.salePrice || "N/A", // Giá
                photo: details?.photo || "default-image.jpg", // Ảnh sản phẩm
              };
            } catch (detailError) {
              console.error(
                `Failed to fetch details for product ${product.id}`,
                detailError
              );
              return {
                id: product.id,
                productName: product.productName,
                productCode: "N/A",
                salePrice: "N/A",
                photo: "default-image.jpg",
              };
            }
          })
        );

        setProducts(productsWithDetails);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-blue-50 text-gray-900">
      {/* Banner */}
      <div className="relative w-full h-96 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={images[currentImage]}
          alt="Banner"
          className="w-full h-full object-cover transition-opacity duration-700 shadow-lg rounded-lg"
        />
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800"
          onClick={() =>
            setCurrentImage(
              (prev) => (prev - 1 + images.length) % images.length
            )
          }
        >
          ◀
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800"
          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
        >
          ▶
        </button>
      </div>
      {/* Phần ưu đãi */}
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
              {/* Răng cưa bên trái */}
              <div className="absolute -left-2 top-1/4 bg-blue-600 w-4 h-8 rounded-full"></div>
              <div className="absolute -left-2 top-1/2 bg-blue-600 w-4 h-8 rounded-full"></div>
              <div className="absolute -left-2 bottom-1/4 bg-blue-600 w-4 h-8 rounded-full"></div>

              {/* Phần mã giảm giá */}
              <div className="bg-blue-600 px-5 py-4 text-lg font-bold text-white rounded-t-lg w-full text-center border-b-2 border-dashed border-white">
                {voucher.voucherCode}
              </div>

              {/* Nội dung voucher */}
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

              {/* Nút sao chép mã */}
              <button className="mt-2 bg-blue-700 text-white px-4 py-2 text-sm rounded-b-lg w-full hover:bg-blue-900 transition">
                Sao chép mã
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Danh Sách Sản Phẩm
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-300"
            >
              <img
                src={product.photo}
                alt={product.productName}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-2">
                {product.productName}
              </h3>
              <p className="text-gray-700">
                Mã sản phẩm: {product.productCode}
              </p>
              <p className="text-gray-700">Giá: {product.salePrice} VND</p>
              <button className="mt-2 bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-900 transition">
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      </section>
      <Outlet /> {/* Hiển thị nội dung động */}
    </main>
  );
};

export default Layout;
