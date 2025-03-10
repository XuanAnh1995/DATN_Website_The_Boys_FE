import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../services/ProductDetailService";

const ViewProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [sanPham, setSanPham] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        console.log("Fetching product with ID:", id); // ✅ Debug ID
        const response = await ProductDetailService.getProductDetailById(id);
        console.log("Fetched product data:", response); // ✅ Debug API response

        if (response && response.data) {
          setSanPham(response.data); // ✅ Lưu dữ liệu vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };

    fetchProductDetail();
  }, [id]);

  // 🔥 Nếu dữ liệu chưa có, hiển thị "Đang tải..."
  if (!sanPham) return <p className="text-center text-gray-500">Đang tải...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600">
        {sanPham.product?.productName || "Không có tên sản phẩm"}
      </h1>

      {/* ✅ Kiểm tra đường dẫn ảnh */}
      <img
        src={`http://localhost:8080/images/${sanPham.photo}`}
        alt={sanPham.product?.productName || "Sản phẩm"}
        className="w-full max-w-md mx-auto my-4 rounded-lg shadow-lg"
      />

      <p className="text-lg text-gray-700">
        Mã sản phẩm: {sanPham.productDetailCode}
      </p>
      <p className="text-lg text-gray-700">
        Thương hiệu: {sanPham.product?.brand?.brandName}
      </p>
      <p className="text-lg text-gray-700">
        Chất liệu: {sanPham.product?.material?.materialName}
      </p>
      <p className="text-lg text-gray-700">Kích thước: {sanPham.size?.name}</p>
      <p className="text-lg text-gray-700">Màu sắc: {sanPham.color?.name}</p>

      <p className="text-xl font-bold text-red-600 mt-2">
        Giá: {sanPham.salePrice ? `${sanPham.salePrice} VND` : "Liên hệ"}
      </p>
    </div>
  );
};

export default ViewProductDetail;
