import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const ProductList = () => {
  const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm được chọn để so sánh
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    category: "",
    brand: "",
    material: "",
    collar: "",
    sleeve: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getFilteredProducts({
        page: currentPage,
        size: pageSize,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        categoryIds: filters.category ? [filters.category] : [],
        brandIds: filters.brand ? [filters.brand] : [],
        materialIds: filters.material ? [filters.material] : [],
        collarIds: filters.collar ? [filters.collar] : [],
        sleeveIds: filters.sleeve ? [filters.sleeve] : [],
      });
      setProducts(response?.content || []);
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  // Chọn hoặc bỏ chọn sản phẩm để so sánh
  const toggleCompare = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return prev.length < 3 ? [...prev, product] : prev;
    });
  };

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-red-600 mb-6">
        Sản Phẩm Mới
      </h1>
      <div className="flex flex-wrap justify-center gap-4 p-4 border border-gray-300 rounded-lg mb-6">
        <select
          name="category"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Loại</option>
          <option value="1">Áo thun</option>
          <option value="2">Áo sơ mi</option>
          <option value="3">Áo khoác</option>
          <option value="4">Áo hoodie</option>
          <option value="5">Áo len</option>
          <option value="6">Áo polo</option>
        </select>
        <select
          name="brand"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Thương hiệu</option>
          <option value="1">Nike</option>
          <option value="2">Adidas</option>
          <option value="3">Puma</option>
          <option value="4">Reebok</option>
          <option value="5">Under Armour</option>
          <option value="6">New Balance</option>
        </select>
        <select
          name="material"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Chất liệu</option>
          <option value="1">Cotton</option>
          <option value="2">Polyester</option>
          <option value="3">Len</option>
          <option value="4">Jean</option>
          <option value="5">Nỉ</option>
          <option value="6">Vải thun lạnh</option>
        </select>
        <select
          name="collar"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Cổ áo</option>
          <option value="1">Cổ tròn</option>
          <option value="2">Cổ bẻ</option>
          <option value="3">Cổ tim</option>
        </select>
        <select
          name="sleeve"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Tay áo</option>
          <option value="1">Tay ngắn</option>
          <option value="2">Tay dài</option>
          <option value="3">Sát nách</option>
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Giá từ"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Đến"
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className={`relative bg-white w-[280px] h-[520px] p-4 rounded-xl shadow-lg border border-gray-200 transition transform hover:scale-105 flex flex-col group mx-auto ${
                selectedProducts.some((p) => p.id === product.id)
                  ? "border-2 border-blue-500"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedProducts.some((p) => p.id === product.id)}
                onChange={() => toggleCompare(product)}
                className="absolute top-3 right-3 w-5 h-5"
              />
              <img
                src={product.photo || "/path/to/default-image.jpg"}
                alt={product.nameProduct}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3 text-center">
                {product.nameProduct}
              </h3>
              <p className="text-red-600 font-bold text-lg text-center">
                {formatCurrency(product.salePrice || 0)}
              </p>
              <button
                onClick={() => navigate(`/view-product/${product.id}`)}
                className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition mx-auto mt-auto"
              >
                🛒 Mua Ngay
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">
            Không có sản phẩm nào.
          </p>
        )}
      </div>
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
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative">
            {/* Nút Đóng */}
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
              🏆 So Sánh Sản Phẩm
            </h2>

            {/* Bảng So Sánh */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-3 border">Ảnh</th>
                    <th className="p-3 border">Tên</th>
                    <th className="p-3 border">Giá</th>
                    <th className="p-3 border">Đã Bán</th>
                    <th className="p-3 border">Thương Hiệu</th>
                    <th className="p-3 border">Đánh Giá ⭐</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product.id} className="text-center">
                      <td className="p-3 border">
                        <img
                          src={product.photo || "/path/to/default-image.jpg"}
                          alt={product.nameProduct}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-3 border">{product.nameProduct}</td>
                      <td className="p-3 border text-red-600 font-bold">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="p-3 border">{product.quantitySaled}</td>
                      <td className="p-3 border text-blue-600">
                        {product.brand || "N/A"}
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
    </section>
  );
};

export default ProductList;
