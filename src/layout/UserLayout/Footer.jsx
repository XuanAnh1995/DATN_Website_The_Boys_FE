import {} from "react-icons/fa";

const Footer = () => {
  return (
    <section className="p-6 mt-4 bg-gray-100 rounded-lg shadow-lg">
      {/* Thanh xanh dịch vụ hỗ trợ */}
      <div className="bg-sky-900 py-4 px-6 flex justify-around items-center text-white w-full mb-6">
        <div className="flex items-center space-x-3">
          <img src="/phone-icon.png" alt="Hotline" className="w-8 h-8" />

          <div>
            <p className="font-bold">Hotline: 19001993</p>
            <p>Dịch vụ hỗ trợ bạn 24/7</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/gift-icon.png" alt="Quà tặng" className="w-8 h-8" />
          <div>
            <p className="font-bold">Quà tặng hấp dẫn</p>
            <p>Nhiều ưu đãi khuyến mãi hot</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/return-icon.png" alt="Đổi trả" className="w-8 h-8" />
          <div>
            <p className="font-bold">Tư Vấn miễn phí</p>
            <p>Dịch vụ hỗi trợ 24/7</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/price-icon.png" alt="Giá tốt" className="w-8 h-8" />
          <div>
            <p className="font-bold">Giá luôn tốt nhất</p>
            <p>Hoàn tiền nếu nơi khác rẻ hơn</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-300 relative text-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-3">
              Chính sách
            </h3>
            <ul className="text-gray-700">
              <li>Chính sách thành viên</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách vận chuyển và giao nhận</li>
              <li>Bảo mật thông tin cá nhân</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-3">Hướng dẫn</h3>
            <ul className="text-gray-700">
              <li>Hướng dẫn mua hàng</li>
              <li>Hướng dẫn thanh toán</li>
              <li>Hướng dẫn giao nhận</li>
              <li>Điều khoản dịch vụ</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-3">
              Thông tin liên hệ
            </h3>
            <p className="text-gray-700">
              Công ty TNHH The Boys chuyên bán lẻ thời trang nam.
            </p>
            <p className="text-gray-700">Địa chỉ: TP.HCM</p>
            <p className="text-gray-700">Điện thoại: 1900 0750</p>
            <p className="text-gray-700">Email: support@fpt.vn</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-3">
              Mạng xã hội
            </h3>
            <div className="flex space-x-4 justify-center">
              <a href="#">
                <img
                  src="/facebook-icon.png"
                  alt="Facebook"
                  className="w-6 h-6"
                />
              </a>
              <a href="#">
                <img
                  src="/youtube-icon.png"
                  alt="YouTube"
                  className="w-6 h-6"
                />
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
            </div>
          </div>
        </div>
        {/* Logo ở giữa */}
        <div className="flex justify-center mt-6">
          <img src="/src/assets/logo.jpg" alt="Nơ xanh" className="w-24" />
        </div>
      </footer>
    </section>
  );
};

export default Footer;
