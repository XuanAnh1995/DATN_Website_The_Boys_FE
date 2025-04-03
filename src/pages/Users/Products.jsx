import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import BrandService from "../../services/BrandService";
import CategoryService from "../../services/CategoryService";
import CollarService from "../../services/CollarService";
import ColorService from "../../services/ColorService";
import SizeService from "../../services/SizeService";
import SleeveService from "../../services/SleeveService";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const ProductList = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    category: "",
    brand: "",
    collar: "",
    color: "",
    size: "",
    sleeve: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [collars, setCollars] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorFilters, setErrorFilters] = useState(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoadingFilters(true);
      setErrorFilters(null);
      try {
        const [
          categoryData,
          brandData,
          collarData,
          colorData,
          sizeData,
          sleeveData,
        ] = await Promise.all([
          CategoryService.getAll(0, 100).catch(() => ({ content: [] })),
          BrandService.getAllBrands("", 0, 100).catch(() => []),
          CollarService.getAllCollars("", 0, 100).catch(() => ({
            content: [],
          })),
          ColorService.getAllColors("", 0, 100).catch(() => ({ content: [] })),
          SizeService.getAllSizes("", 0, 100).catch(() => ({ content: [] })),
          SleeveService.getAllSleeves("", 0, 100).catch(() => ({
            content: [],
          })),
        ]);

        setCategories(
          Array.isArray(categoryData?.content)
            ? categoryData.content.map((item) => ({
                id: item.id,
                name: item.categoryName || item.name,
              }))
            : Array.isArray(categoryData?.data)
              ? categoryData.data.map((item) => ({
                  id: item.id,
                  name: item.categoryName || item.name,
                }))
              : []
        );
        setBrands(
          Array.isArray(brandData?.content)
            ? brandData.content.map((item) => ({
                id: item.id,
                name: item.brandName || item.name,
              }))
            : Array.isArray(brandData?.data)
              ? brandData.data.map((item) => ({
                  id: item.id,
                  name: item.brandName || item.name,
                }))
              : []
        );
        setCollars(
          Array.isArray(collarData?.content)
            ? collarData.content.map((item) => ({
                id: item.id,
                name: item.collarName || item.name,
              }))
            : Array.isArray(collarData?.data)
              ? collarData.data.map((item) => ({
                  id: item.id,
                  name: item.collarName || item.name,
                }))
              : []
        );
        setColors(
          Array.isArray(colorData?.content)
            ? colorData.content.map((item) => ({
                id: item.id,
                name: item.colorName || item.name,
              }))
            : Array.isArray(colorData?.data)
              ? colorData.data.map((item) => ({
                  id: item.id,
                  name: item.colorName || item.name,
                }))
              : []
        );
        setSizes(
          Array.isArray(sizeData?.content)
            ? sizeData.content.map((item) => ({
                id: item.id,
                name: item.sizeName || item.name,
              }))
            : Array.isArray(sizeData?.data)
              ? sizeData.data.map((item) => ({
                  id: item.id,
                  name: item.sizeName || item.name,
                }))
              : []
        );
        setSleeves(
          Array.isArray(sleeveData?.content)
            ? sleeveData.content.map((item) => ({
                id: item.id,
                name: item.sleeveName || item.name,
              }))
            : Array.isArray(sleeveData?.data)
              ? sleeveData.data.map((item) => ({
                  id: item.id,
                  name: item.sleeveName || item.name,
                }))
              : []
        );
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bộ lọc:", error);
        setErrorFilters("Không thể tải dữ liệu bộ lọc. Vui lòng thử lại.");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterData();
  }, []);

  const fetchProducts = useCallback(
    debounce(async (page, filterState) => {
      setLoadingProducts(true);
      try {
        const response = await ProductService.getFilteredProducts({
          page,
          size: pageSize,
          minPrice: filterState.minPrice,
          maxPrice: filterState.maxPrice,
          categoryIds: filterState.category ? [filterState.category] : [],
          brandIds: filterState.brand ? [filterState.brand] : [],
          collarIds: filterState.collar ? [filterState.collar] : [],
          colorIds: filterState.color ? [filterState.color] : [],
          sizeIds: filterState.size ? [filterState.size] : [],
          sleeveIds: filterState.sleeve ? [filterState.sleeve] : [],
        });
        setProducts(response?.content || response?.data || []);
        setTotalPages(response?.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      } finally {
        setLoadingProducts(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, filters, fetchProducts]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      category: "",
      brand: "",
      collar: "",
      color: "",
      size: "",
      sleeve: "",
    });
    setCurrentPage(0);
  };

  const toggleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return prev.length < 3 ? [...prev, product] : prev;
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

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-[#1E90FF] mb-6">
        Sản Phẩm Mới
      </h1>

      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-[#1E90FF]/30">
        <h2 className="text-xl font-semibold text-[#1E90FF] mb-4">
          🔍 Bộ Lọc Sản Phẩm
        </h2>
        {loadingFilters && (
          <p className="text-center text-gray-500">Đang tải bộ lọc...</p>
        )}
        {errorFilters && (
          <p className="text-center text-red-500">{errorFilters}</p>
        )}
        {!loadingFilters && !errorFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Danh mục
              </label>
              <select
                name="category"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.category}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Thương hiệu
              </label>
              <select
                name="brand"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.brand}
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Cổ áo
              </label>
              <select
                name="collar"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.collar}
              >
                <option value="">Tất cả cổ áo</option>
                {collars.map((collar) => (
                  <option key={collar.id} value={collar.id}>
                    {collar.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Màu sắc
              </label>
              <select
                name="color"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.color}
              >
                <option value="">Tất cả màu sắc</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Kích thước
              </label>
              <select
                name="size"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.size}
              >
                <option value="">Tất cả kích thước</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tay áo
              </label>
              <select
                name="sleeve"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.sleeve}
              >
                <option value="">Tất cả tay áo</option>
                {sleeves.map((sleeve) => (
                  <option key={sleeve.id} value={sleeve.id}>
                    {sleeve.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá từ
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="Nhập giá tối thiểu"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.minPrice || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá đến
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Nhập giá tối đa"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
                value={filters.maxPrice || ""}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#1E90FF] text-white rounded-md shadow-md hover:bg-[#1C86EE] transition flex items-center gap-1"
          >
            🔄 Reset Bộ Lọc
          </button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="relative">
        {loadingProducts && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        )}
        <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white w-[280px] h-[520px] p-4 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#1E90FF] flex flex-col group mx-auto overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.photo || "/path/to/default-image.jpg"}
                    alt={product.nameProduct}
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-[245px] left-0 right-0 bg-[#1E90FF] text-white text-center text-xs font-bold py-1">
                  KHUYẾN MÃI ĐẶC BIỆT
                </div>
                <h3 className="text-lg font-semibold mt-3 text-center text-gray-800 group-hover:text-[#1E90FF] transition-colors duration-300">
                  {product.nameProduct || "Tên sản phẩm"}
                </h3>
                <div className="text-center flex justify-center gap-2 mt-1">
                  <span className="text-[#1E90FF] font-bold text-lg">
                    {formatCurrency(product.salePrice || 0)}
                  </span>
                </div>
                <div className="mt-3 mx-auto w-5/6 h-1 bg-gray-200 relative rounded">
                  <div
                    className="h-full bg-[#1E90FF] rounded transition-all duration-300"
                    style={{
                      width: `${Math.min((product.quantitySaled / product.quantity) * 100 || 0, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-center text-gray-500 text-sm mt-1">
                  Đã bán {product.quantitySaled || 0}
                </p>
                <p className="text-center text-gray-500 text-sm mt-1">
                  Số lượng {product.quantity || 0}
                </p>
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <button
                    onClick={() => handleViewProduct(product.id)}
                    className="bg-[#1E90FF] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#1C86EE] hover:scale-105 hover:shadow-lg"
                  >
                    🛒 Mua Ngay
                  </button>
                  <button
                    onClick={() => toggleSelectProduct(product)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedProducts.some((p) => p.id === product.id)
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-black hover:bg-gray-400"
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
            <p className="text-gray-500 text-center w-full col-span-full">
              Không có sản phẩm nào.
            </p>
          )}
        </div>
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
          disabled={currentPage === 0 || loadingProducts}
          className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition-all duration-300 ${
            currentPage === 0 || loadingProducts
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1E90FF] hover:bg-[#1C86EE] hover:scale-105"
          }`}
        >
          Trước
        </button>
        <span className="px-4 py-2 mx-2 text-lg font-semibold text-[#1E90FF]">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage >= totalPages - 1 || loadingProducts}
          className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition-all duration-300 ${
            currentPage >= totalPages - 1 || loadingProducts
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1E90FF] hover:bg-[#1C86EE] hover:scale-105"
          }`}
        >
          Tiếp
        </button>
      </div>

      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-300"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold text-center text-[#1E90FF] mb-6">
              🏆 So Sánh Sản Phẩm
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-[#1E90FF]/10 text-gray-700">
                    <th className="p-3 border">Ảnh</th>
                    <th className="p-3 border">Tên</th>
                    <th className="p-3 border">Giá</th>
                    <th className="p-3 border">Đã Bán</th>
                    <th className="p-3 border">Số Lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="text-center bg-gray-50 hover:bg-[#1E90FF]/5 transition-colors duration-200"
                    >
                      <td className="p-3 border">
                        <img
                          src={product.photo || "/path/to/default-image.jpg"}
                          alt={product.nameProduct}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-3 border font-semibold">
                        {product.nameProduct}
                      </td>
                      <td className="p-3 border text-[#1E90FF] font-bold">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="p-3 border">
                        {product.quantitySaled || 0}
                      </td>
                      <td className="p-3 border">{product.quantity || 0}</td>
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
