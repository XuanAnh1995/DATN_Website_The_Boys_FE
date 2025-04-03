import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";

// Các trạng thái đơn hàng
const orderStatusMap = {
  "-1": "Đã hủy",
  "0": "Chờ xác nhận",
  "1": "Chờ thanh toán",
  "2": "Đã xác nhận",
  "3": "Đang giao hàng",
  "4": "Giao hàng không thành công",
  "5": "Hoàn thành"
};

// Tạo lớp CSS cho từng trạng thái
const getStatusClass = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  return status === -1 ? `${baseClasses} bg-red-100 text-red-800` :
    status === 0 ? `${baseClasses} bg-yellow-100 text-yellow-800` :
    status === 1 ? `${baseClasses} bg-blue-100 text-blue-800` :
    status === 2 ? `${baseClasses} bg-green-100 text-green-800` :
    status === 3 ? `${baseClasses} bg-purple-100 text-purple-800` :
    status === 4 ? `${baseClasses} bg-orange-100 text-orange-800` : 
    `${baseClasses} bg-gray-100 text-gray-800`;
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await OrderService.getOrderDetails(id);
        console.log("Order details response:", response);
        if (response && response.data) {
          setOrderDetails(response.data);
        } else {
          toast.error("Dữ liệu đơn hàng không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
        toast.error("Lỗi khi tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // Fix print style to include all products
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        /* Ẩn tất cả mọi thứ trước tiên */
        body * {
          visibility: hidden;
        }
        
        /* Chỉ hiển thị phần nội dung đơn hàng */
        .container .bg-white.rounded-lg.shadow-lg {
          visibility: visible;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 0;
          margin: 0;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        
        /* Làm cho tất cả các phần tử con trong container đơn hàng hiển thị */
        .container .bg-white.rounded-lg.shadow-lg * {
          visibility: visible;
        }
        
        /* Đảm bảo bảng hiển thị đầy đủ */
        table.print-table {
          width: 100% !important;
          display: table !important;
          page-break-inside: auto !important;
          border-collapse: collapse !important;
        }
        
        /* Đảm bảo tbody hiển thị đúng */
        table.print-table tbody {
          display: table-row-group !important;
        }
        
        /* Đảm bảo các dòng trong bảng hiển thị đầy đủ */
        table.print-table tr {
          display: table-row !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Đảm bảo các ô trong bảng hiển thị đầy đủ */
        table.print-table td, table.print-table th {
          display: table-cell !important;
          
        }
        
        /* Đảm bảo header và footer bảng hiển thị đúng */
        table.print-table thead {
          display: table-header-group !important;
        }
        
        table.print-table tfoot {
          display: table-footer-group !important;
        }
        
        /* Ẩn các phần không cần in */
        .no-print, .bg-gray-50, button {
          display: none !important;
        }
        
        /* Định dạng tiêu đề và màu sắc */
        .bg-gray-800 {
          background-color: #f8f9fa !important;
          color: #333 !important;
          border-bottom: 2px solid #4a90e2;
          padding: 15px 20px !important;
        }
        
        /* Định dạng tiêu đề */
        .text-2xl.font-bold {
          font-size: 24px !important;
          color: #2c3e50 !important;
        }
        
        /* Định dạng mã đơn hàng */
        .bg-blue-500 {
          background-color: #4a90e2 !important;
          color: white !important;
          padding: 4px 12px !important;
          border-radius: 20px !important;
        }
        
        /* Định dạng phần thông tin khách hàng */
        .border-b {
          border-bottom: 1px solid #e0e0e0 !important;
          padding: 15px 20px !important;
        }
        
        /* Tiêu đề phần */
        .text-lg.font-semibold {
          color: #2c3e50 !important;
          font-size: 18px !important;
          margin-bottom: 15px !important;
        }
        
        /* Nhãn thông tin */
        .text-sm.text-gray-500 {
          color: #7f8c8d !important;
          font-size: 12px !important;
          margin-bottom: 4px !important;
        }
        
        /* Giá trị thông tin */
        .font-medium {
          color: #2c3e50 !important;
          font-size: 14px !important;
        }
        
        /* Thêm logo hoặc thông tin cửa hàng */
        .bg-white.rounded-lg.shadow-lg:before {
          content: "CỬA HÀNG The Boys" !important;
          display: block !important;
          text-align: center !important;
          font-size: 28px !important;
          font-weight: bold !important;
          color: #4a90e2 !important;
          margin: 20px 0 10px !important;
        }
        
        /* Thêm thông tin liên hệ cửa hàng */
        .bg-white.rounded-lg.shadow-lg:after {
          content: "Địa chỉ: 123 Đường ABC, Quận XYZ, TP. MNV | Hotline: 0123 456 789 | Email: info@xyz.com" !important;
          display: block !important;
          text-align: center !important;
          font-size: 12px !important;
          color: #7f8c8d !important;
          padding: 20px 0 !important;
          border-top: 1px solid #e0e0e0 !important;
          margin-top: 20px !important;
        }
        
        /* Số trang */
        @page {
          margin: 0.5cm !important;
          size: portrait !important;
        }
        
        /* Màu sắc và font cho toàn bộ trang in */
        body {
          background-color: white !important;
          font-family: Arial, sans-serif !important;
          color: #333 !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border-t-4 border-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 font-bold text-xl mb-2">Không tìm thấy đơn hàng!</p>
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition no-print"
            onClick={() => navigate("/admin/order")}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                {orderDetails.orderCode || "N/A"}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium">{orderDetails.customer?.fullname || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{orderDetails.customer?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium">{formatDate(orderDetails.createDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái đơn hàng</p>
                <p className="font-medium">
                  <span className={getStatusClass(parseInt(orderDetails?.statusOrder))}>
                    {orderStatusMap[orderDetails?.statusOrder?.toString()] || "Không xác định"}
                  </span>
                </p>
              </div>
            </div>
          </div>

                      {/* Order Details */}
                      <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Các sản phẩm</h3>
            <div className="overflow-x-auto border rounded-lg shadow-md">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm font-semibold border-b">
                    <th className="py-3 px-4 text-left">Sản phẩm</th>
                    <th className="py-3 px-4 text-center">Số lượng</th>
                    <th className="py-3 px-4 text-center">Màu Sắc</th>
                    <th className="py-3 px-4 text-center">Size</th>
                    <th className="py-3 px-4 text-center">Giá trước giảm</th>
                    <th className="py-3 px-4 text-center">Giá sau giảm</th>
                    <th className="py-3 px-4 text-right">Đơn giá</th>
                    <th className="py-3 px-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-300">
                  {orderDetails.orderDetails.map((detail, index) => {
                    const product = detail.productDetail?.product;
                    const price = detail.productDetail?.salePrice ?? detail.productDetail?.product?.salePrice ?? 0;
                    const quantity = detail.quantity ?? 0;
                    const colorName = detail.productDetail?.color?.name ?? "Không có màu";
                    const sizeName = detail.productDetail?.size?.name ?? "Không có kích thước";
                    const originalTotal = detail.originalTotal ?? 0;
                    const totalBill = detail.totalBill ?? 0;
                    const totalPrice = price * quantity;
                    console.log("Order Details:", orderDetails);


                    return (
                      <tr key={detail.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product?.productName || "Không có tên"}</p>
                            <p className="text-xs text-gray-500">{product?.productCode || "Không có mã"}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">{quantity}</td>
                        <td className="py-3 px-4 text-center font-medium">{colorName}</td>
                        <td className="py-3 px-4 text-center font-medium">{sizeName}</td>
                        <td className="py-3 px-4 text-center font-medium">{formatCurrency(orderDetails.originalTotal ?? 0)}</td>
                        <td className="py-3 px-4 text-center font-medium">{formatCurrency( orderDetails.totalBill ?? 0)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">{formatCurrency(price)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(totalPrice)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100 text-gray-800 font-bold border-t">
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right">Tổng tiền trước khi áp voucher:</td>
                    <td colSpan="2" className="py-4 px-4 text-right text-xl text-gray-700">
                      {formatCurrency(orderDetails.originalTotal??0)}
                    </td>
                  </tr>
                  <tr>
                  <td colSpan="6" className="py-4 px-4 text-right">Số tiền trừ:</td>
                  <td colSpan="2" className="py-4 px-4 text-right text-xl text-green-600">
                    {formatCurrency((orderDetails.originalTotal ?? 0) - orderDetails.totalBill)}
                  </td>
                </tr>
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right">Tổng tiền sau khi áp voucher:</td>
                    <td colSpan="2" className="py-4 px-4 text-right text-xl text-red-600">
                      {formatCurrency(orderDetails.totalBill)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>



          {/* Voucher Information */}
          {orderDetails.voucher && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Mã giảm giá đã áp dụng</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p className="font-medium">{orderDetails.voucher?.voucherName || "Không có tên"}</p>
                      <p>{orderDetails.voucher?.description || "Không có mô tả"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center no-print">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center"
              onClick={() => {
                // Đảm bảo bảng được hiển thị đầy đủ trước khi in
                setTimeout(() => {
                  window.print();
                }, 100);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              In hóa đơn
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition flex items-center"
              onClick={() => navigate("/admin/order")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;