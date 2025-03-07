const Footer = () => {
  return (
    <footer>
      <footer className="bg-gray-900 text-white p-6 mt-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="font-bold">GIỚI THIỆU</h3>
            <p>FPT Hà Nội - Chuỗi Phân Phối Thời Trang</p>
            <p>☎ 09696869</p>
            <p>✉ cs@fpthanoi.com</p>
            <p>⏰ Giờ mở cửa: 08:30 - 22:00</p>
          </div>
          <div>
            <h3 className="font-bold">CHÍNH SÁCH</h3>
            <p>Hướng dẫn đặt hàng</p>
            <p>Chính sách</p>
          </div>
          <div>
            <h3 className="font-bold">ĐỊA CHỈ CỬA HÀNG</h3>
            <p>📍 Hà Nội (2 CH)</p>
            <p>Số 26 phố Lê Đại Hành, Quận Hai Bà Trưng, TP Hà Nội</p>
          </div>
          <div>
            <h3 className="font-bold">PHƯƠNG THỨC THANH TOÁN</h3>
            <p>VNPay, Momo, COD</p>
          </div>
        </div>
        <p className="text-center mt-4">BẢN QUYỀN THUỘC VỀ FPT HÀ NỘI</p>
      </footer>
    </footer>
  );
};

export default Footer;
