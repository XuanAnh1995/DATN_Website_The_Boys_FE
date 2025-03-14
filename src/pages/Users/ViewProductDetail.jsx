import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../services/ProductDetailService";

const ViewProductDetail = () => {
  const { id } = useParams();
  const [sanPham, setSanPham] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductDetailService.getProductDetailById(id);
        setSanPham(data);
        setSelectedImage(data.photo || "");
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!sanPham)
    return <p className="text-center text-gray-500 text-3xl">Đang tải...</p>;

  return (
    <div className="max-w-screen-xl mx-auto p-12 bg-white shadow-xl rounded-lg flex gap-12">
      {/* Hình ảnh sản phẩm */}
      <div className="w-2/3">
        <div className="border-4 border-blue-500 rounded-lg p-6">
          <img
            src={selectedImage}
            alt={sanPham.product.productName}
            className="w-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="w-3/5">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          {sanPham.product.productName}
        </h1>
        <p className="text-gray-700 text-xl">
          Mã sản phẩm:{" "}
          <span className="font-semibold text-2xl">
            {sanPham.productDetailCode}
          </span>
        </p>
        <div className="flex items-center gap-8 mt-6">
          <p className="text-blue-600 font-bold text-4xl">
            {sanPham.salePrice} VND
          </p>
          <p className="text-gray-500 line-through text-2xl">
            {sanPham.importPrice} VND
          </p>
        </div>

        {/* Các thuộc tính */}
        <div className="mt-6 text-2xl">
          <p className="text-gray-700 font-semibold">Kiểu cổ áo:</p>
          <span className="text-blue-700 font-bold">
            {sanPham.collar?.collarName || "Không xác định"}
          </span>
        </div>

        <div className="mt-6 text-2xl">
          <p className="text-gray-700 font-semibold">Màu sắc:</p>
          <span className="text-blue-700 font-bold">
            {sanPham.color?.colorName || "Không xác định"}
          </span>
        </div>

        <div className="mt-6 text-2xl">
          <p className="text-gray-700 font-semibold">Chất liệu:</p>
          <span className="text-blue-700 font-bold">
            {sanPham.material?.materialName || "Không xác định"}
          </span>
        </div>

        {/* Nút hành động */}
        <div className="mt-8 flex gap-6">
          <button className="bg-blue-600 text-white px-12 py-4 rounded-lg text-2xl font-bold">
            MUA NGAY
          </button>
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-bold">
            THÊM VÀO GIỎ
          </button>
          <button className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg font-bold">
            Liên hệ 1900 6750
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
