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
    <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-300 relative">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        {/* Chính sách */}
        <div>
          <h3 className="text-lg font-bold text-blue-600 mb-3">Chính sách</h3>
          <ul className="text-gray-700">
            <li>Chính sách thành viên</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách vận chuyển vào giao nhận</li>
            <li>Bảo mật thông tin cá nhân</li>
          </ul>
        </div>

        {/* Hướng dẫn */}
        <div>
          <h3 className="text-lg font-bold text-blue-600 mb-3">Hướng dẫn</h3>
          <ul className="text-gray-700">
            <li>Hướng dẫn mua hàng</li>
            <li>Hướng dẫn thanh toán</li>
            <li>Hướng dẫn giao nhận</li>
            <li>Điều khoản dịch vụ</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-bold text-blue-600 mb-3">
            Thông tin liên hệ
          </h3>
          <p className="text-gray-700">
            Công ty TNHH The Boys chuyên bán lẻ thời trang nam.
          </p>
          <p className="text-gray-700">
            Địa chỉ: fpt university, khu công nghệ cao, quận 9, TP.HCM
          </p>
          <p className="text-gray-700">Điện thoại: 190009870987 6750</p>
          <p className="text-gray-700">Email: anhlad @theboi.com</p>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-lg font-bold text-blue-600 mb-3">Mạng xã hội</h3>
          <div className="flex space-x-4">
            <a href="#">
              <img
                src="/facebook-icon.png"
                alt="Facebook"
                className="w-6 h-6"
              />
            </a>
            <a href="#">
              <img src="/youtube-icon.png" alt="YouTube" className="w-6 h-6" />
            </a>
            <a href="#">
              <img src="/tiktok-icon.png" alt="TikTok" className="w-6 h-6" />
            </a>
            <a href="#">
              <img
                src="/instagram-icon.png"
                alt="Instagram"
                className="w-6 h-6"
              />
            </a>
            <a href="#">
              <img src="/twitter-icon.png" alt="Twitter" className="w-6 h-6" />
            </a>
            <a href="#">
              <img
                src="/linkedin-icon.png"
                alt="LinkedIn"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Hình nơ màu xanh */}
      <img
        src="/src/assets/logo.jpg"
        alt="Nơ xanh"
        className="absolute right-0 top-0 w-24"
      />

      <div className="text-center mt-8 text-gray-600 text-sm">
        The Boys không chỉ là một cửa hàng thời trang đơn thuần, mà còn là điểm
        đến lý tưởng cho những người đam mê thời trang, yêu thích sự sang trọng
        và đẳng cấp.
      </div>
    </footer>
  );
};

export default Footer;
