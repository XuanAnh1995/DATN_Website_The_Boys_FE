import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../services/ProductDetailService";

const ViewProductDetail = () => {
  const { id } = useParams();
  const [sanPham, setSanPham] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const productDetail =
          await ProductDetailService.getProductDetailById(id);
        console.log("Dữ liệu sản phẩm sau khi fetch:", productDetail);

        if (productDetail) {
          setSanPham(productDetail);
          setSelectedImage(productDetail.photo || "");
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (id) {
      fetchProductById();
    }
  }, [id]);

  if (!sanPham)
    return <p className="text-center text-gray-500 text-3xl">Đang tải...</p>;

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-white shadow-lg rounded-lg flex gap-8">
      <div className="w-2/5 flex flex-col">
        <div className="mb-4">
          <img
            src={selectedImage}
            alt={sanPham.product?.productName || "Sản phẩm"}
            className="w-full object-cover rounded-lg border-4 border-gray-300"
          />
        </div>
      </div>

      <div className="w-3/5">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {sanPham.product?.productName || "Không có tên"}
        </h1>
        <p className="text-gray-500 text-lg">
          Mã sản phẩm: {sanPham.productDetailCode || "N/A"}
        </p>

        <div className="flex items-center gap-4 mt-4">
          <p className="text-red-600 font-bold text-3xl">
            {sanPham.salePrice || 0}đ
          </p>
          <p className="text-gray-500 line-through text-xl">
            {sanPham.importPrice || 0}đ
          </p>
        </div>

        {sanPham.promotion && (
          <div className="mt-4 bg-red-100 p-4 rounded-lg border border-red-500">
            <h3 className="text-red-600 font-bold text-xl">
              🎁 {sanPham.promotion.promotionName}
            </h3>
            <p className="text-gray-700">{sanPham.promotion.description}</p>
            <p className="text-gray-700">
              Giảm {sanPham.promotion.promotionPercent}% từ{" "}
              {sanPham.promotion.startDate} đến {sanPham.promotion.endDate}
            </p>
          </div>
        )}

        <div className="mt-6">
          <p className="text-lg font-semibold">Màu sắc:</p>
          <span className="text-blue-700 font-bold">
            {sanPham.color?.name || "Không xác định"}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold">Cổ áo:</p>
          <span className="text-blue-700 font-bold">
            {sanPham.collar?.name || "Không xác định"}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold">Size:</p>
          <span className="text-blue-700 font-bold">
            {sanPham.size?.name || "Không xác định"}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <p className="text-lg font-semibold">Số lượng:</p>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 bg-gray-200 text-lg font-bold rounded-lg"
            >
              -
            </button>
            <input
              type="number"
              className="w-16 text-center text-xl border-none outline-none"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 bg-gray-200 text-lg font-bold rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold">
            MUA NGAY
          </button>
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-bold">
            THÊM VÀO GIỎ
          </button>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-bold">
            Liên hệ 1900 6750
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
