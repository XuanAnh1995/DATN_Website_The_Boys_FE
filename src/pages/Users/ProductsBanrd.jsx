import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products and sort by ID in descending order
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: 0,
          size: 30, // Increased to ensure enough products
          sort: "id,desc",
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

  // Take the top 4 products for the first section
  const topProducts = products.slice(0, 4);
  // Split products for the two rows in the second section
  const firstRowProducts = products.slice(4, 9); // 5 products for the first row
  const secondRowProducts = products.slice(9, 14); // 5 products for the second row
  // Additional products for the new view section
  const recommendedProducts = products.slice(14, 18); // 4 products for the new view

  return (
    <main className="bg-white text-gray-900 p-4 sm:p-6">
      {/* First Section: Promotional Section with Top 4 Products */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-sky-900 mb-4">
          Deal nổi bật 🔥
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Chương trình đặt trước, nhận giá lộc trong tháng mới nhất!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Top Banners */}
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="relative bg-yellow-200 rounded-lg overflow-hidden h-48">
              <img
                src="/src/assets/banner-thoi-trang-nam-tinh.jpg"
                alt="Skirts Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <p className="text-white text-lg font-bold">
                  Thời trang nam mới nhất
                </p>
              </div>
            </div>
            <div className="relative bg-yellow-200 rounded-lg overflow-hidden h-48">
              <img
                src="/src/assets/dung-luong-banner-thoi-trang.jpg"
                alt="Shirts Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <p className="text-white text-lg font-bold"></p>
              </div>
            </div>
          </div>

          {/* Left Promotional Image */}
          <div className="lg:col-span-1">
            <div className="relative bg-lime-200 rounded-lg overflow-hidden min-h-[400px]">
              <img
                src="/src/assets/Blue and White T-shirt Products Sale Instagram Post (1).png"
                alt="Promotional Image"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">XUÂN HÈ</h2>
                <p className="text-sm">Ưu đãi đến 50% cho bộ sưu tập mới!</p>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-2 bg-white text-sky-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid (4 Products) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:scale-105 relative min-h-[350px]"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.photo || "https://via.placeholder.com/200x250"
                        }
                        alt={product.productName || product.nameProduct}
                        className="w-full h-48 object-contain rounded-t-lg"
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
                      {product.isNew && (
                        <div className="absolute top-2 left-12 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                          Mới
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
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-70 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 col-span-full">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
                    >
                      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
                      <div className="p-3 text-center">
                        <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second Section: Banner + Two Rows of 5 Products */}
      <div className="max-w-7xl mx-auto mt-12">
        <h1 className="text-2xl font-bold text-center text-sky-900 mb-4">
          Sản phẩm nổi bật
        </h1>
        <p className="text-center text-gray-600 mb-8"></p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Banner Section */}
          <div className="lg:col-span-1">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[400px]">
              <img
                src="/src/assets/p1.png"
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">Bộ sưu tập</h2>
                <p className="text-sm">Khám phá xu hướng mới nhất 2025!</p>
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
            {/* First Row: 5 Products */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {firstRowProducts.length > 0 ? (
                firstRowProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:scale-105 relative min-h-[350px]"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.photo || "https://via.placeholder.com/200x250"
                        }
                        alt={product.productName || product.nameProduct}
                        className="w-full h-48 object-contain rounded-t-lg"
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
                      {product.isNew && (
                        <div className="absolute top-2 left-12 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                          Mới
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
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-70 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 col-span-full">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
                    >
                      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
                      <div className="p-3 text-center">
                        <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Second Row: 5 Products */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {secondRowProducts.length > 0 ? (
                secondRowProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:scale-105 relative min-h-[350px]"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.photo || "https://via.placeholder.com/200x250"
                        }
                        alt={product.productName || product.nameProduct}
                        className="w-full h-48 object-contain rounded-t-lg"
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
                      {product.isNew && (
                        <div className="absolute top-2 left-12 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                          Mới
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
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-70 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 col-span-full">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
                    >
                      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg(Component.jsx:824)"></div>
                      <div className="p-3 text-center">
                        <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* View More Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/products")}
                className="bg-sky-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-sky-700 transition"
              >
                Xem thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
