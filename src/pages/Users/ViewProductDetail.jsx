import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../services/ProductDetailService";

const ViewProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [sanPham, setSanPham] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductDetailService.getProductDetailById(id);
        setSanPham(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!sanPham) return <p className="text-center text-gray-500">Đang tải...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-700">
        {sanPham.product.productName}
      </h1>
      <img
        src={sanPham.photo || "https://via.placeholder.com/300"}
        alt={sanPham.product.productName}
        className="w-full h-80 object-cover rounded-lg"
      />
      <p className="text-gray-700 mt-2">
        Mã sản phẩm: {sanPham.productDetailCode}
      </p>
      <p className="text-red-600 font-bold text-xl mt-2">
        Giá: {sanPham.salePrice} VND
      </p>
    </div>
  );
};

export default ViewProductDetail;
