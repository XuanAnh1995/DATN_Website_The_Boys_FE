import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products and sort by ID in descending order for the first section
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: 0,
          size: 20,
          sort: "id,desc", // Sort by ID descending to get the largest IDs for the first section
        };
        const response = await ProductService.getFilteredProducts(params);
        const productsArray = Array.isArray(response)
          ? response
          : response?.content && Array.isArray(response.content)
            ? response.content
            : [];
        console.log("Products:", productsArray);
        setProducts(productsArray || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Handle view product
  const handleViewProduct = async (productId) => {
    try {
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

  // Take the top 3 products (largest IDs) for the first section
  const topProducts = products.slice(0, 3);

  // Split products for the two rows in the second section
  const firstRowProducts = products.slice(3, 7); // Next 4 products for the first row
  const secondRowProducts = products.slice(7, 11); // Next 4 products for the second row

  return (
    <main className="bg-white text-gray-900 p-6">
      {/* First Section: Promotional Section with Top 3 Products */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-sky-900 mb-4">
          Deal nổi bật 🔥
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Chương trình đặt trước, nhận giá lộc trong tháng mới nhất!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Top Banners */}
          <div className="col-span-full grid grid-cols-2 gap-6 mb-6">
            <div className="relative bg-yellow-200 rounded-lg overflow-hidden h-48">
              <img
                src="/src/assets/banner-thoi-trang-nam-tinh.jpg"
                alt="Skirts Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-2xl font-bold"></div>
            </div>
            <div className="relative bg-yellow-200 rounded-lg overflow-hidden h-48">
              <img
                src="/src/assets/dung-luong-banner-thoi-trang.jpg"
                alt="Shirts Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-2xl font-bold"></div>
            </div>
          </div>

          {/* Left Promotional Image */}
          <div className="lg:col-span-1">
            <div className="relative bg-lime-200 rounded-lg overflow-hidden h-[400px]">
              <img
                src="/src/assets/Blue and White T-shirt Products Sale Instagram Post (1).png"
                alt="Promotional Image"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">XUÂN HÈ</h2>
                <p className="text-sm"></p>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-2 bg-white text-sky-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid (3 Products) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl relative"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.photo || "https://via.placeholder.com/200x250"
                        }
                        alt={product.productName || product.nameProduct}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      {product.importPrice &&
                        product.importPrice > product.salePrice && (
                          <div className="absolute top-2 left-2 bg-sky-900 text-white text-xs font-bold py-1 px-2 rounded-full">
                            Giảm{" "}
                            {Math.round(
                              ((product.importPrice - product.salePrice) /
                                product.importPrice) *
                                100
                            )}
                            %
                          </div>
                        )}
                      <div className="absolute top-2 right-2 text-sky-900 hover:text-sky-700">
                        ♥
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.productName ||
                          product.nameProduct ||
                          "Tên sản phẩm"}
                      </h3>
                      <p className="text-gray-500 text-xs mb-1">
                        {product.brand || "Thương hiệu"}
                      </p>
                      <div className="flex justify-center gap-2 mt-1">
                        <span className="text-sky-900 font-bold text-md">
                          {formatCurrency(product.salePrice || 0)}
                        </span>
                        {product.importPrice &&
                          product.importPrice > product.salePrice && (
                            <span className="text-gray-500 line-through text-xs">
                              {formatCurrency(product.importPrice)}
                            </span>
                          )}
                      </div>
                      <div className="mt-2 w-full h-2 bg-gray-200 rounded relative">
                        <div
                          className="h-full bg-sky-900 rounded"
                          style={{
                            width: `${Math.min(
                              (product.quantitySaled / product.quantity) *
                                100 || 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Đã bán: {product.quantitySaled || 0}
                      </p>
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  Đang tải sản phẩm...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second Section: Banner + Two Rows of 4 Products */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Banner Section */}
          <div className="lg:col-span-1">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[400px]">
              <img
                src="/src/assets/p1.png"
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">Bộ sưu tập</h2>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-2 bg-white text-sky-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* First Row: 4 Products */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {firstRowProducts.length > 0 ? (
                firstRowProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl relative"
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
                          <div className="absolute top-2 left-2 bg-sky-900 text-white text-xs font-bold py-1 px-2 rounded-full">
                            Giảm{" "}
                            {Math.round(
                              ((product.importPrice - product.salePrice) /
                                product.importPrice) *
                                100
                            )}
                            %
                          </div>
                        )}
                      <div className="absolute top-2 right-2 text-sky-900 hover:text-sky-700">
                        ♥
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.productName ||
                          product.nameProduct ||
                          "Tên sản phẩm"}
                      </h3>
                      <p className="text-gray-500 text-xs mb-1">
                        {product.brand || "Thương hiệu"}
                      </p>
                      <div className="flex justify-center gap-2 mt-1">
                        <span className="text-sky-900 font-bold text-md">
                          {formatCurrency(product.salePrice || 0)}
                        </span>
                        {product.importPrice &&
                          product.importPrice > product.salePrice && (
                            <span className="text-gray-500 line-through text-xs">
                              {formatCurrency(product.importPrice)}
                            </span>
                          )}
                      </div>
                      <div className="mt-2 w-full h-2 bg-gray-200 rounded relative">
                        <div
                          className="h-full bg-sky-900 rounded"
                          style={{
                            width: `${Math.min(
                              (product.quantitySaled / product.quantity) *
                                100 || 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Đã bán: {product.quantitySaled || 0}
                      </p>
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  Đang tải sản phẩm...
                </p>
              )}
            </div>

            {/* Second Row: 4 Products */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {secondRowProducts.length > 0 ? (
                secondRowProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl relative"
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
                          <div className="absolute top-2 left-2 bg-sky-900 text-white text-xs font-bold py-1 px-2 rounded-full">
                            Giảm{" "}
                            {Math.round(
                              ((product.importPrice - product.salePrice) /
                                product.importPrice) *
                                100
                            )}
                            %
                          </div>
                        )}
                      <div className="absolute top-2 right-2 text-sky-900 hover:text-sky-700">
                        ♥
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.productName ||
                          product.nameProduct ||
                          "Tên sản phẩm"}
                      </h3>
                      <p className="text-gray-500 text-xs mb-1">
                        {product.brand || "Thương hiệu"}
                      </p>
                      <div className="flex justify-center gap-2 mt-1">
                        <span className="text-sky-900 font-bold text-md">
                          {formatCurrency(product.salePrice || 0)}
                        </span>
                        {product.importPrice &&
                          product.importPrice > product.salePrice && (
                            <span className="text-gray-500 line-through text-xs">
                              {formatCurrency(product.importPrice)}
                            </span>
                          )}
                      </div>
                      <div className="mt-2 w-full h-2 bg-gray-200 rounded relative">
                        <div
                          className="h-full bg-sky-900 rounded"
                          style={{
                            width: `${Math.min(
                              (product.quantitySaled / product.quantity) *
                                100 || 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Đã bán: {product.quantitySaled || 0}
                      </p>
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-0 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  Đang tải sản phẩm...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
