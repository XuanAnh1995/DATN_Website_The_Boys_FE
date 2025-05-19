import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const Collection = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchNewProducts();
    fetchBestSellingProducts();
  }, [currentPage]);

  const fetchNewProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: "createdDate,desc",
      };
      const response = await ProductService.getFilteredProducts(params);
      setNewProducts(response?.content || response?.data || []);
    } catch (error) {
      console.error("Error fetching new products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchBestSellingProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = {
        page: 0,
        size: pageSize,
        sort: "quantitySaled,desc",
      };
      const response = await ProductService.getFilteredProducts(params);
      setBestSellingProducts(response?.content || response?.data || []);
    } catch (error) {
      console.error("Error fetching best-selling products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleBuyNow = (productId) => {
    console.log(`Buying product ${productId} now`);
    alert(`Proceeding to checkout for product ${productId}!`);
  };

  const toggleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      const newSelected = isSelected
        ? prev.filter((p) => p.id !== product.id)
        : prev.length < 3
          ? [...prev, product]
          : prev;
      if (!isSelected && newSelected.length <= 3) {
        setShowCompareModal(true);
      }
      return newSelected;
    });
  };

  const handleViewProduct = async (productId) => {
    try {
      const productDetails = await ProductService.getProductById(productId);
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

  const removeSelectedProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProducts.length <= 1) {
      setShowCompareModal(false);
    }
  };

  return (
    <main className="bg-white text-gray-900 p-6 max-w-7xl mx-auto">
      {/* New Products Section */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-black mb-4">Sản phẩm mới</h1>
        <div className="relative">
          {loadingProducts && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
              <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:border-gray-400 group"
                >
                  <div className="relative">
                    <img
                      src={
                        product.photo || "https://via.placeholder.com/200x250"
                      }
                      alt={product.productName || product.nameProduct}
                      className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.importPrice &&
                      product.importPrice > product.salePrice && (
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
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors duration-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {product.productName ||
                        product.nameProduct ||
                        "Tên sản phẩm"}
                    </h3>
                    <div className="mt-1">
                      <span className="text-red-500 font-bold text-sm">
                        {formatCurrency(product.salePrice || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Đã bán: {product.quantitySaled || 0}
                    </p>
                    <div className="mt-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-700 hover:scale-105"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleBuyNow(product.id)}
                        className="bg-red-500 text-white text-xs font-semibold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-105"
                      >
                        Mua ngay
                      </button>
                      <button
                        onClick={() => toggleSelectProduct(product)}
                        className={`text-xs font-semibold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 ${
                          selectedProducts.some((p) => p.id === product.id)
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-black hover:bg-gray-400"
                        }`}
                      >
                        {selectedProducts.some((p) => p.id === product.id)
                          ? "✔ Đã chọn"
                          : "So sánh"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Không có sản phẩm nào.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Best Selling Products Section */}
      <section>
        <h1 className="text-2xl font-bold text-black mb-4">
          Bán chạy trong tháng
        </h1>
        <div className="relative">
          {loadingProducts && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
              <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {bestSellingProducts.length > 0 ? (
              bestSellingProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:border-gray-400 group"
                >
                  <div className="relative">
                    <img
                      src={
                        product.photo || "https://via.placeholder.com/200x250"
                      }
                      alt={product.productName || product.nameProduct}
                      className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.importPrice &&
                      product.importPrice > product.salePrice && (
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
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors duration-300">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {product.productName ||
                        product.nameProduct ||
                        "Tên sản phẩm"}
                    </h3>
                    <div className="mt-1">
                      <span className="text-red-500 font-bold text-sm">
                        {formatCurrency(product.salePrice || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Đã bán: {product.quantitySaled || 0}
                    </p>
                    <div className="mt-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-700 hover:scale-105"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleBuyNow(product.id)}
                        className="bg-red-500 text-white text-xs font-semibold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-105"
                      >
                        Mua ngay
                      </button>
                      <button
                        onClick={() => toggleSelectProduct(product)}
                        className={`text-xs font-semibold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 ${
                          selectedProducts.some((p) => p.id === product.id)
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-black hover:bg-gray-400"
                        }`}
                      >
                        {selectedProducts.some((p) => p.id === product.id)
                          ? "✔ Đã chọn"
                          : "So sánh"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Không có sản phẩm nào.
              </p>
            )}
          </div>
        </div>
      </section>
      {/* Compare Button */}
      {selectedProducts.length > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition hover:scale-105"
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
            <h2 className="text-3xl font-bold text-center text-black mb-6">
              🏆 So Sánh Sản Phẩm
            </h2>
            <p className="text-center text-gray-600 mb-4">
              (Tối đa 3 sản phẩm, bạn có thể xóa để chọn sản phẩm khác)
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="p-3 border">Ảnh</th>
                    <th className="p-3 border">Tên</th>
                    <th className="p-3 border">Giá</th>
                    <th className="p-3 border">Đã Bán</th>
                    <th className="p-3 border">Số Lượng</th>
                    <th className="p-3 border">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="text-center bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-3 border">
                        <img
                          src={
                            product.photo ||
                            "https://via.placeholder.com/200x250"
                          }
                          alt={product.nameProduct}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-3 border font-semibold">
                        {product.nameProduct}
                      </td>
                      <td className="p-3 border text-red-500 font-bold">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="p-3 border">
                        {product.quantitySaled || 0}
                      </td>
                      <td className="p-3 border">{product.quantity || 0}</td>
                      <td className="p-3 border">
                        <button
                          onClick={() => removeSelectedProduct(product.id)}
                          className="bg-red-500 text-white text-sm font-semibold py-1 px-2 rounded-md hover:bg-red-600 transition"
                        >
                          Xóa
                        </button>
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

export default Collection;
