import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaShoppingCart,
  FaRegCreditCard,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-6 border-t border-gray-700">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Giới thiệu */}
        <div className="space-y-2 sm:text-left text-center">
          <h3 className="font-bold text-lg">GIỚI THIỆU</h3>
          <p>FPT Hà Nội - Chuỗi Phân Phối Thời Trang</p>
          <p>
            <FaPhoneAlt className="inline-block mr-2 text-blue-400" /> 09696869
          </p>
          <p>
            <FaEnvelope className="inline-block mr-2 text-red-400" />{" "}
            cs@fpthanoi.com
          </p>
          <p>
            <FaClock className="inline-block mr-2 text-yellow-400" /> 08:30 -
            22:00
          </p>
        </div>

        {/* Chính sách */}
        <div className="space-y-2 sm:text-left text-center">
          <h3 className="font-bold text-lg">CHÍNH SÁCH</h3>
          <p>
            <FaShoppingCart className="inline-block mr-2 text-green-400" />{" "}
            Hướng dẫn đặt hàng
          </p>
          <p>
            <FaRegCreditCard className="inline-block mr-2 text-purple-400" />{" "}
            Chính sách
          </p>
        </div>

        {/* Địa chỉ cửa hàng */}
        <div className="space-y-2 sm:text-left text-center">
          <h3 className="font-bold text-lg">ĐỊA CHỈ CỬA HÀNG</h3>
          <p>
            <FaMapMarkerAlt className="inline-block mr-2 text-orange-400" /> Hà
            Nội (2 CH)
          </p>
          <p>Số 26 phố Lê Đại Hành, Quận Hai Bà Trưng, TP Hà Nội</p>
        </div>

        {/* Phương thức thanh toán */}
        <div className="space-y-2 sm:text-left text-center">
          <h3 className="font-bold text-lg">PHƯƠNG THỨC THANH TOÁN</h3>
          <p>💳 VNPay, 🏦 Momo, 📦 COD</p>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center mt-6 text-gray-400 text-sm">
        © 2025 FPT Hà Nội. Tất cả quyền được bảo lưu.
      </p>
    </footer>
  );
};

export default Footer;
