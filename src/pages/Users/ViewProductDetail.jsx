import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import CartService from "../../services/CartService";

const ViewProductDetail = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details =
          await ProductService.getProductDetailsByProductCode(productCode);
        console.log("Dữ liệu chi tiết sản phẩm:", details);

        if (details && details.length > 0) {
          setProductDetails(details);
          setSelectedDetail(details[0]);
          setSelectedImage(details[0].photo || "");
        } else {
          setError(
            "Không tìm thấy sản phẩm hoặc biến thể nào với mã: " + productCode
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        setError("Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    if (productCode) {
      fetchProductDetails();
    } else {
      setError("Mã sản phẩm không hợp lệ!");
      setLoading(false);
    }
  }, [productCode]);

  const handleAddToCart = async () => {
    if (!selectedDetail) return;

    try {
      setIsLoadingCart(true);
      const cartItemRequest = {
        productDetailId: selectedDetail.id,
        quantity: quantity,
      };
      await CartService.addProductToCart(cartItemRequest);
      alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedDetail) return;

    navigate("/pay", {
      state: {
        items: [
          {
            id: selectedDetail.id,
            productName: selectedDetail.product?.productName,
            price: selectedDetail.salePrice,
            quantity: quantity,
            photo: selectedDetail.photo,
          },
        ],
        totalAmount: selectedDetail.salePrice * quantity,
        totalItems: quantity,
      },
    });
  };

  const handleSelectDetail = (detail) => {
    setSelectedDetail(detail);
    setSelectedImage(detail.photo || "");
  };

  // Lọc các màu sắc và size duy nhất từ productDetails
  const uniqueColors = [
    ...new Set(
      productDetails.map((detail) => detail.color?.colorName).filter(Boolean)
    ),
  ];
  const uniqueSizes = [
    ...new Set(
      productDetails.map((detail) => detail.size?.sizeName).filter(Boolean)
    ),
  ];

  if (loading) {
    return <p className="text-center text-gray-500 text-3xl">Đang tải...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-3xl">{error}</p>;
  }

  if (!productDetails.length || !selectedDetail) {
    return (
      <p className="text-center text-gray-500 text-3xl">
        Không tìm thấy sản phẩm hoặc biến thể nào!
      </p>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Phần ảnh sản phẩm */}
      <div className="w-full md:w-2/5 flex flex-col">
        <div className="relative mb-4">
          <img
            src={selectedImage || "https://via.placeholder.com/400x500"}
            alt={selectedDetail.product?.productName || "Sản phẩm"}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
            -
            {Math.round(
              ((selectedDetail.importPrice - selectedDetail.salePrice) /
                selectedDetail.importPrice) *
                100
            )}
            %
          </div>
          <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition">
            <svg
              className="w-6 h-6"
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
        {/* Danh sách ảnh phụ */}
        <div className="flex flex-wrap gap-2">
          {productDetails.map((detail, index) => (
            <div key={index} className="relative">
              <img
                src={detail.photo || "https://via.placeholder.com/80x80"}
                alt={`Ảnh ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                  selectedDetail.id === detail.id
                    ? "border-[#1E3A8A]"
                    : "border-gray-200"
                } hover:border-[#1E3A8A]`}
                onClick={() => handleSelectDetail(detail)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Phần thông tin sản phẩm */}
      <div className="w-full md:w-3/5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
            {selectedDetail.product?.productName || "Không có tên"}
          </h1>
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-6 h-6"
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
        <div className="flex gap-2 text-sm text-gray-500 mb-2">
          <p>
            Loại:{" "}
            <span className="text-black">
              {selectedDetail.product?.category?.categoryName ||
                "Không xác định"}
            </span>
          </p>
          <p>
            Thương hiệu:{" "}
            <span className="text-black">
              {selectedDetail.product?.brand?.brandName || "Không xác định"}
            </span>
          </p>
          <p>
            Mã sản phẩm:{" "}
            <span className="text-[#1E3A8A]">
              {selectedDetail.productDetailCode || "N/A"}
            </span>
          </p>
        </div>

        {/* Đánh giá và nhãn */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-sm">
            ({selectedDetail.quantitySaled || 0})
          </span>
          <div className="flex gap-1 ml-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
              new
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
              freeship
            </span>
          </div>
        </div>

        {/* Giá và khuyến mãi */}
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[#1E3A8A] font-bold text-2xl">
            {(selectedDetail.salePrice || 0).toLocaleString("vi-VN")}đ
          </p>
          {selectedDetail.importPrice &&
            selectedDetail.importPrice > selectedDetail.salePrice && (
              <p className="text-gray-500 line-through text-lg">
                {(selectedDetail.importPrice || 0).toLocaleString("vi-VN")}đ
              </p>
            )}
        </div>

        {/* Khuyến mãi */}
        {selectedDetail.promotion && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-[#1E3A8A]/30">
            <h3 className="text-[#1E3A8A] font-bold text-lg mb-2">
              🎁 Danh sách khuyến mãi
            </h3>
            <p className="text-gray-700 flex items-center gap-2">
              <span className="text-green-500">✔</span>
              {selectedDetail.promotion.description ||
                "Áp dụng Phiếu quà tặng / Mã giảm giá theo sản phẩm."}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <span className="text-green-500">✔</span>
              Giảm giá {selectedDetail.promotion.promotionPercent}% khi mua từ 5
              sản phẩm trở lên.
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <span className="text-green-500">✔</span>
              Tặng 100.000đ mua hàng tại website thành viên Dola Style, áp dụng
              khi mua Online tại Hà Nội & Hồ Chí Minh từ 1/5/2025 đến 1/6/2025.
            </p>
            <div className="flex gap-2 mt-2">
              <button className="text-[#1E3A8A] font-semibold border border-[#1E3A8A] px-2 py-1 rounded hover:bg-[#1E3A8A] hover:text-white transition">
                DOLA10
              </button>
              <button className="text-[#1E3A8A] font-semibold border border-[#1E3A8A] px-2 py-1 rounded hover:bg-[#1E3A8A] hover:text-white transition">
                FREESHIP
              </button>
              <button className="text-[#1E3A8A] font-semibold border border-[#1E3A8A] px-2 py-1 rounded hover:bg-[#1E3A8A] hover:text-white transition">
                DOLA20
              </button>
              <button className="text-[#1E3A8A] font-semibold border border-[#1E3A8A] px-2 py-1 rounded hover:bg-[#1E3A8A] hover:text-white transition">
                DOLA50
              </button>
            </div>
          </div>
        )}

        {/* Thuộc tính sản phẩm */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2 text-[#1E3A8A]">Màu sắc:</p>
          {uniqueColors.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {uniqueColors.map((color, index) => {
                const detail = productDetails.find(
                  (d) => d.color?.colorName === color
                );
                return (
                  <button
                    key={index}
                    onClick={() => detail && handleSelectDetail(detail)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedDetail.color?.colorName === color
                        ? "border-[#1E3A8A] bg-[#1E3A8A]/10 text-[#1E3A8A]"
                        : "border-gray-300"
                    } hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/10 transition`}
                    disabled={!detail}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Không có màu sắc nào khả dụng.</p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold mb-2 text-[#1E3A8A]">Size:</p>
          {uniqueSizes.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {uniqueSizes.map((size, index) => {
                const detail = productDetails.find(
                  (d) => d.size?.sizeName === size
                );
                return (
                  <button
                    key={index}
                    onClick={() => detail && handleSelectDetail(detail)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedDetail.size?.sizeName === size
                        ? "border-[#1E3A8A] bg-[#1E3A8A]/10 text-[#1E3A8A]"
                        : "border-gray-300"
                    } hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/10 transition`}
                    disabled={!detail}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Không có size nào khả dụng.</p>
          )}
          <button className="text-[#1E3A8A] text-sm mt-2 hover:underline">
            Gợi ý tìm size
          </button>
        </div>

        {/* Số lượng */}
        <div className="mb-4 flex items-center gap-4">
          <p className="text-lg font-semibold text-[#1E3A8A]">Số lượng:</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-4 py-2 bg-[#1E3A8A] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-[#163172] transition"
            >
              -
            </button>
            <input
              type="number"
              className="w-16 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= selectedDetail.quantity}
              className="px-4 py-2 bg-[#1E3A8A] text-white font-bold rounded-lg disabled:opacity-50 hover:bg-[#163172] transition"
            >
              +
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            (Còn {selectedDetail.quantity || 0} sản phẩm)
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleAddToCart}
            disabled={isLoadingCart}
            className={`flex-1 bg-gray-300 text-black py-4 rounded-lg text-lg font-bold transition ${
              isLoadingCart
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-400"
            }`}
          >
            {isLoadingCart ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-[#1E3A8A] text-white py-4 rounded-lg text-lg font-bold hover:bg-[#163172] transition"
          >
            MUA NGAY
          </button>
        </div>

        <button className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg text-lg font-bold hover:bg-[#163172] transition mb-4">
          Liên hệ 1900 6750
        </button>

        {/* Chính sách */}
        <div className="mt-6">
          <p className="text-lg font-semibold mb-2 text-[#1E3A8A]">
            Cam kết của chúng tôi:
          </p>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="text-[#1E3A8A]">✔</span> Cam kết 100% chính hãng
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#1E3A8A]">✔</span> Giao tận tay khách hàng
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#1E3A8A]">✔</span> Hỗ trợ 24/7
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#1E3A8A]">✔</span> Hoàn tiền 111% nếu hàng
              kém chất lượng
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#1E3A8A]">✔</span> Mở kiện trả miễn phí
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#1E3A8A]">✔</span> Điều khoản bảo hành
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetail;
