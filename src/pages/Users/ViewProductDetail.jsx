import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductDetailService from "../../services/ProductDetailService";

const ViewProductDetail = () => {
  const { id } = useParams();
  const [sanPham, setSanPham] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await ProductDetailService.getProductDetailById(id);

        if (!response) {
          throw new Error("Không tìm thấy sản phẩm.");
        }

        setSanPham(response);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        setSanPham(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return (
      <p className="text-red-500 text-center text-lg">Đang tải dữ liệu...</p>
    );
  }

  if (!sanPham) {
    return (
      <p className="text-gray-500 text-center text-lg">
        Không tìm thấy sản phẩm.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phần hiển thị ảnh sản phẩm */}
        <div className="flex flex-col items-center">
          <img
            src={sanPham.photo || "https://via.placeholder.com/300"}
            alt={sanPham.product?.productName || "Sản phẩm"}
            className="w-96 h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex mt-4 space-x-3">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
              MUA NGAY
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>

        {/* Phần chi tiết sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {sanPham.product?.productName}
          </h1>
          <p className="text-gray-600 text-sm">
            Mã sản phẩm: <strong>{sanPham.productDetailCode}</strong>
          </p>
          <p className="text-red-600 font-bold text-2xl mt-2">
            Giá:{" "}
            {sanPham.salePrice
              ? `${sanPham.salePrice.toLocaleString()} VND`
              : "Liên hệ"}
          </p>

          {/* Danh sách khuyến mãi */}
          <div className="bg-red-100 p-3 mt-4 rounded-lg">
            <p className="font-semibold text-red-600">
              🎉 Danh sách khuyến mãi
            </p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Giảm giá 10% khi mua từ 5 sản phẩm trở lên.</li>
              <li>Tặng 100.000đ mua hàng tại website thành viên.</li>
              <li>Áp dụng phiếu quà tặng & mã giảm giá.</li>
            </ul>
          </div>

          {/* Màu sắc & Size */}
          <div className="mt-4">
            <p className="font-semibold">Màu sắc:</p>
            <p className="text-gray-700">
              {sanPham.color?.name || "Không xác định"}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-semibold">Kích thước:</p>
            <p className="text-gray-700">
              {sanPham.size?.name || "Không xác định"}
            </p>
          </div>

          {/* Mô tả sản phẩm */}
          <p className="mt-4 text-gray-700">
            {sanPham.description || "Không có mô tả."}
          </p>

          {/* Trạng thái sản phẩm */}
          <p
            className={`mt-4 font-semibold ${sanPham.status ? "text-green-600" : "text-red-600"}`}
          >
            {sanPham.status ? "Còn hàng" : "Hết hàng"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
