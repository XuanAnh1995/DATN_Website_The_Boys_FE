import {
  FaPhoneVolume,
  FaGift,
  FaExchangeAlt,
  FaTag,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <section className="p-6 mt-4 bg-gray-100 rounded-lg shadow-lg">
      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-300">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-3">Chính sách</h3>
            <ul className="text-gray-700">
              <li>Chính sách thành viên</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách vận chuyển vào giao nhận</li>
              <li>Bảo mật thông tin cá nhân</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-3">Hướng dẫn</h3>
            <ul className="text-gray-700">
              <li>Hướng dẫn mua hàng</li>
              <li>Hướng dẫn thanh toán</li>
              <li>Hướng dẫn giao nhận</li>
              <li>Điều khoản dịch vụ</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-3">
              Thông tin liên hệ
            </h3>
            <p className="text-gray-700">
              Công ty TNHH The Boys chuyên sản xuất - phân phối - bán lẻ thời
              trang nam.
            </p>
            <p className="text-gray-700">
              Địa chỉ: 70 Lữ Gia, Phường 15, Quận 11, TP.HCM
            </p>
            <p className="text-gray-700">Điện thoại: 1900 6750</p>
            <p className="text-gray-700">Email: support@fpt.vn</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-3">
              Nhận tin khuyến mãi
            </h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Nhập email nhận tin khuyến mãi"
                className="border p-2 flex-grow rounded-l-md"
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded-r-md">
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>

        {/* Mạng xã hội */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-red-600 mb-3">Mạng xã hội</h3>
          <div className="flex justify-center space-x-4 text-2xl">
            <a href="#" className="text-blue-600">
              <FaFacebook />
            </a>
            <a href="#" className="text-red-600">
              <FaYoutube />
            </a>
            <a href="#" className="text-black">
              <FaTiktok />
            </a>
            <a href="#" className="text-pink-500">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Tên thương hiệu */}
        <div className="text-center mt-6 text-2xl font-bold text-black">
          The<span className="text-red-600">Boys</span>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
