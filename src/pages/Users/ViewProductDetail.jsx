import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../services/ProductDetailService";
import BrandService from "../../services/BrandService";
import ColorService from "../../services/ColorService";
import SizeService from "../../services/SizeService";
import CollarService from "../../services/CollarService";
import MaterialService from "../../services/MaterialService";

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
    return <p className="text-center text-gray-500 text-2xl">Đang tải...</p>;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg flex gap-8">
      <div className="w-1/2">
        <div className="border-4 border-blue-500 rounded-lg p-4">
          <img
            src={selectedImage}
            alt={sanPham.product.productName}
            className="w-full object-cover rounded-lg"
          />
        </div>
      </div>
      <div className="w-1/2">
        <h1 className="text-4xl font-bold text-blue-700">
          {sanPham.product.productName}
        </h1>
        <p className="text-gray-700 text-lg">
          Mã sản phẩm:{" "}
          <span className="font-semibold">{sanPham.productDetailCode}</span>
        </p>
        <div className="flex items-center gap-6 mt-4">
          <p className="text-blue-600 font-bold text-3xl">
            {sanPham.salePrice.toLocaleString()} VND
          </p>
          <p className="text-gray-500 line-through text-xl">
            {sanPham.salePrice.toLocaleString()} VND
          </p>
        </div>

        {/* Kiểu cổ áo */}
        <div className="mt-4 text-lg">
          <p className="text-gray-700 font-semibold">Kiểu cổ áo:</p>
          <div className="flex gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 rounded-md flex items-center justify-center">
              <input type="radio" checked readOnly className="hidden" />
            </div>
            <span className="text-blue-700 font-bold">
              {sanPham.collar?.collarName || "Không xác định"}
            </span>
          </div>
        </div>

        {/* Màu sắc */}
        <div className="mt-4 text-lg">
          <p className="text-gray-700 font-semibold">Màu sắc:</p>
          <div className="flex gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 rounded-md flex items-center justify-center">
              <input type="radio" checked readOnly className="hidden" />
            </div>
            <span className="text-blue-700 font-bold">
              {sanPham.color?.colorName || "Không xác định"}
            </span>
          </div>
        </div>

        {/* Chất liệu */}
        <div className="mt-4 text-lg">
          <p className="text-gray-700 font-semibold">Chất liệu:</p>
          <div className="flex gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 rounded-md flex items-center justify-center">
              <input type="radio" checked readOnly className="hidden" />
            </div>
            <span className="text-blue-700 font-bold">
              {sanPham.material?.materialName || "Không xác định"}
            </span>
          </div>
        </div>

        {/* Nút Mua hàng */}
        <div className="mt-6 flex gap-6">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold">
            MUA NGAY
          </button>
          <button className="bg-yellow-500 text-white px-8 py-3 rounded-lg text-lg font-bold">
            THÊM VÀO GIỎ
          </button>
          <button className="bg-blue-900 text-white px-8 py-3 rounded-lg text-lg font-bold">
            Liên hệ 1900 6750
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
