// import React, { useState, useEffect, useCallback } from "react";
// import VoucherService from "../../../services/VoucherServices";
// import { toast } from "react-toastify";
// import { AiOutlineEdit } from "react-icons/ai";
// import Switch from "react-switch";
// import CreateVoucherModal from "./components/CreateModal";
// import UpdateModal from "./components/UpdateModal";

// export default function Voucher() {
//   const [vouchers, setVouchers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [search, setSearch] = useState("");
//   const [dateFilter, setDateFilter] = useState({
//     startDate: "",
//     endDate: "",
//   });
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [sortConfig, setSortConfig] = useState({
//     key: "id",
//     direction: "desc",
//   });
//   const [currentVoucher, setCurrentVoucher] = useState(null);
//   const [updateModal, setUpdateModal] = useState(false);

//   // Hàm kiểm tra và cập nhật trạng thái voucher
//   const updateVoucherStatus = useCallback(async (voucher) => {
//     const currentDate = new Date();
//     const startDate = new Date(voucher.startDate);
//     const endDate = new Date(voucher.endDate);

//     const shouldBeActive = currentDate >= startDate && currentDate <= endDate;

//     if (shouldBeActive !== voucher.status) {
//       try {
//         await VoucherService.toggleStatusVoucher(voucher.id);
//         return true;
//       } catch (error) {
//         console.error("Auto status update error:", error);
//         return false;
//       }
//     }
//     return false;
//   }, []);

//   const fetchVouchers = useCallback(async () => {
//     try {
//       const response = await VoucherService.getAllVouchers(
//         search,
//         currentPage,
//         pageSize,
//         sortConfig.key,
//         sortConfig.direction
//       );

//       let filteredVouchers = response.content;
//       if (dateFilter.startDate || dateFilter.endDate) {
//         filteredVouchers = filteredVouchers.filter((voucher) => {
//           const startDate = new Date(voucher.startDate);
//           const endDate = new Date(voucher.endDate);
//           const filterStart = dateFilter.startDate
//             ? new Date(dateFilter.startDate)
//             : null;
//           const filterEnd = dateFilter.endDate
//             ? new Date(dateFilter.endDate)
//             : null;

//           return (
//             (!filterStart || startDate >= filterStart) &&
//             (!filterEnd || endDate <= filterEnd)
//           );
//         });
//       }

//       const updatedVouchers = await Promise.all(
//         filteredVouchers.map(async (voucher) => {
//           const statusUpdated = await updateVoucherStatus(voucher);
//           if (statusUpdated) {
//             return { ...voucher, status: !voucher.status };
//           }
//           return voucher;
//         })
//       );

//       setVouchers(updatedVouchers);
//       setTotalPages(response.totalPages);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch vouchers");
//     }
//   }, [search, currentPage, pageSize, sortConfig, dateFilter]);

//   useEffect(() => {
//     fetchVouchers();
//     const interval = setInterval(fetchVouchers, 60000);
//     return () => clearInterval(interval);
//   }, [fetchVouchers]);

//   const handleSearch = (event) => {
//     setSearch(event.target.value);
//     setCurrentPage(0);
//   };

//   const handleDateFilter = (event) => {
//     setDateFilter({
//       ...dateFilter,
//       [event.target.name]: event.target.value,
//     });
//     setCurrentPage(0);
//   };

//   const handleUpdateVoucher = (voucher) => {
//     setCurrentVoucher(voucher);
//     setUpdateModal(true);
//   };

//   const handlePageChange = (direction) => {
//     setCurrentPage((prev) =>
//       Math.max(0, Math.min(prev + direction, totalPages - 1))
//     );
//   };

//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       // Cập nhật trạng thái ngay lập tức trong UI để phản hồi nhanh hơn
//       setVouchers((prevVouchers) =>
//         prevVouchers.map((voucher) =>
//           voucher.id === id ? { ...voucher, status: !currentStatus } : voucher
//         )
//       );

//       // Gọi API để cập nhật trạng thái trên server
//       await VoucherService.toggleStatusVoucher(id);
//       toast.success("Cập nhật trạng thái thành công");

//       // Lấy lại dữ liệu mới nhất từ server (không bắt buộc nếu bạn tin tưởng API)
//       await fetchVouchers();
//     } catch (error) {
//       console.error("Toggle error:", error);
//       // Nếu lỗi, hoàn nguyên trạng thái
//       setVouchers((prevVouchers) =>
//         prevVouchers.map((voucher) =>
//           voucher.id === id ? { ...voucher, status: currentStatus } : voucher
//         )
//       );
//       toast.error("Cập nhật trạng thái thất bại");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-center">Quản lý Voucher</h1>
//       <div className="flex items-center justify-between mb-4 gap-4">
//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Tìm kiếm voucher"
//             className="border rounded-lg px-4 py-2 w-64 focus:ring-blue-500"
//             value={search}
//             onChange={handleSearch}
//           />
//           <div className="flex gap-2">
//             <input
//               type="date"
//               name="startDate"
//               value={dateFilter.startDate}
//               onChange={handleDateFilter}
//               className="border rounded-lg px-4 py-2 focus:ring-blue-500"
//             />
//             <input
//               type="date"
//               name="endDate"
//               value={dateFilter.endDate}
//               onChange={handleDateFilter}
//               className="border rounded-lg px-4 py-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           onClick={() => setIsCreateModalOpen(true)}
//         >
//           Thêm Voucher
//         </button>
//       </div>
//       <table className="table-auto w-full bg-white rounded-lg shadow-lg text-center text-sm">
//         <thead>
//           <tr className="bg-blue-100 text-gray-700">
//             <th className="px-4 py-2">STT</th>
//             <th className="px-4 py-2">Mã Voucher</th>
//             <th className="px-4 py-2">Tên Voucher</th>
//             <th className="px-4 py-2">Mô tả</th>
//             <th className="px-4 py-2">Điều kiện tối thiểu</th>
//             <th className="px-4 py-2">Giảm tối đa</th>
//             <th className="px-4 py-2">Phần trăm giảm</th>
//             <th className="px-4 py-2">Ngày bắt đầu</th>
//             <th className="px-4 py-2">Ngày kết thúc</th>
//             <th className="px-4 py-2 cursor-pointer">Trạng thái</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vouchers.map((item, index) => (
//             <tr key={item.id} className="bg-white hover:bg-gray-100 border-b">
//               <td className="px-4 py-2">{index + 1}</td>
//               <td className="px-4 py-2">{item.voucherCode}</td>
//               <td className="px-4 py-2">{item.voucherName}</td>
//               <td className="px-4 py-2">{item.description}</td>
//               <td className="px-4 py-2">{item.minCondition}</td>
//               <td className="px-4 py-2">{item.maxDiscount}</td>
//               <td className="px-4 py-2">{item.reducedPercent}%</td>
//               <td className="px-4 py-2">
//                 {new Date(item.startDate).toLocaleDateString()}
//               </td>
//               <td className="px-4 py-2">
//                 {new Date(item.endDate).toLocaleDateString()}
//               </td>
//               <td
//                 className={`px-4 py-2 ${item.status ? "text-green-500" : "text-red-500"}`}
//               >
//                 {item.status ? "Kích hoạt" : "Không kích hoạt"}
//               </td>
//               <td className="px-4 py-2 flex justify-center gap-4">
//                 <button
//                   className="text-blue-500"
//                   onClick={() => handleUpdateVoucher(item)}
//                 >
//                   <AiOutlineEdit size={20} />
//                 </button>
//                 <Switch
//                   onChange={() => handleToggleStatus(item.id, item.status)}
//                   checked={item.status}
//                   height={20}
//                   width={40}
//                   disabled={false} // Đảm bảo Switch không bị vô hiệu hóa
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="flex items-center justify-between mt-6">
//         <div className="flex items-center gap-2">
//           <label htmlFor="entries" className="text-sm">
//             Xem
//           </label>
//           <select
//             id="entries"
//             className="border rounded-lg px-2 py-1 focus:ring-blue-500"
//             value={pageSize}
//             onChange={(e) => setPageSize(Number(e.target.value))}
//           >
//             {[5, 10, 20].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//           <span className="text-sm">Voucher</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             className="px-3 py-1 border rounded-lg bg-gray-200"
//             onClick={() => handlePageChange(-1)}
//             disabled={currentPage === 0}
//           >
//             {"<"}
//           </button>
//           <span className="text-sm font-semibold">
//             Trang {currentPage + 1} / {totalPages}
//           </span>
//           <button
//             className="px-3 py-1 border rounded-lg bg-gray-200"
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === totalPages - 1}
//           >
//             {">"}
//           </button>
//         </div>
//       </div>
//       <CreateVoucherModal
//         isOpen={isCreateModalOpen}
//         onCancel={() => setIsCreateModalOpen(false)}
//         fetchVouchers={fetchVouchers}
//       />
//       <UpdateModal
//         isOpen={updateModal}
//         setUpdateModal={setUpdateModal}
//         fetchVouchers={fetchVouchers}
//         selectedVoucher={currentVoucher}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import VoucherService from "../../../services/VoucherServices";
import CustomerService from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import Switch from "react-switch";
import CreateVoucherModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const updateVoucherStatus = useCallback(async (voucher) => {
    const currentDate = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    const shouldBeActive = currentDate >= startDate && currentDate <= endDate;

    if (shouldBeActive !== voucher.status) {
      try {
        await VoucherService.toggleStatusVoucher(voucher.id);
        return true;
      } catch (error) {
        console.error("Auto status update error:", error);
        return false;
      }
    }
    return false;
  }, []);

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await VoucherService.getAllVouchers(
        search,
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction
      );

      let filteredVouchers = response.content;
      if (dateFilter.startDate || dateFilter.endDate) {
        filteredVouchers = filteredVouchers.filter((voucher) => {
          const startDate = new Date(voucher.startDate);
          const endDate = new Date(voucher.endDate);
          const filterStart = dateFilter.startDate
            ? new Date(dateFilter.startDate)
            : null;
          const filterEnd = dateFilter.endDate
            ? new Date(dateFilter.endDate)
            : null;
          return (
            (!filterStart || startDate >= filterStart) &&
            (!filterEnd || endDate <= filterEnd)
          );
        });
      }

      const updatedVouchers = await Promise.all(
        filteredVouchers.map(async (voucher) => {
          const statusUpdated = await updateVoucherStatus(voucher);
          if (statusUpdated) {
            return { ...voucher, status: !voucher.status };
          }
          return voucher;
        })
      );

      setVouchers(updatedVouchers);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch vouchers");
    }
  }, [search, currentPage, pageSize, sortConfig, dateFilter]);

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAll("", 0, 1000);
      setCustomers(response.content);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Không thể tải danh sách khách hàng");
    }
  };

  useEffect(() => {
    fetchVouchers();
    const interval = setInterval(fetchVouchers, 60000);
    fetchCustomers();
    return () => clearInterval(interval);
  }, [fetchVouchers]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0);
  };

  const handleDateFilter = (event) => {
    setDateFilter({
      ...dateFilter,
      [event.target.name]: event.target.value,
    });
    setCurrentPage(0);
  };

  const handleUpdateVoucher = (voucher) => {
    setCurrentVoucher(voucher);
    setUpdateModal(true);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      Math.max(0, Math.min(prev + direction, totalPages - 1))
    );
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher.id === id ? { ...voucher, status: !currentStatus } : voucher
        )
      );
      await VoucherService.toggleStatusVoucher(id);
      toast.success("Cập nhật trạng thái thành công");
      await fetchVouchers();
    } catch (error) {
      console.error("Toggle error:", error);
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher.id === id ? { ...voucher, status: currentStatus } : voucher
        )
      );
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleOpenEmailModal = (voucher) => {
    setSelectedVoucher(voucher);
    setSelectedCustomerIds([]);
    setEmailModalOpen(true);
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAllCustomers = () => {
    const allCustomerIds = customers.map((customer) => customer.id);
    setSelectedCustomerIds(allCustomerIds);
  };

  const handleDeselectAllCustomers = () => {
    setSelectedCustomerIds([]);
  };

  const handleSendEmail = async () => {
    if (selectedCustomerIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khách hàng!");
      return;
    }

    const selectedCustomers = customers.filter((c) =>
      selectedCustomerIds.includes(c.id)
    );
    const invalidCustomers = selectedCustomers.filter((c) => !c.email);

    if (invalidCustomers.length > 0) {
      toast.error(
        "Có khách hàng không có email: " +
        invalidCustomers.map((c) => c.fullname).join(", ")
      );
      return;
    }

    try {
      const emailData = {
        voucherId: selectedVoucher.id,
        fromEmail: "aduc79176@gmail.com",
        toEmails: selectedCustomers.map((c) => c.email),
        voucherCode: selectedVoucher.voucherCode,
        voucherName: selectedVoucher.voucherName,
        minCondition: selectedVoucher.minCondition,
        maxDiscount: selectedVoucher.maxDiscount,
        reducedPercent: selectedVoucher.reducedPercent,
        startDate: selectedVoucher.startDate,
        endDate: selectedVoucher.endDate,
      };

      console.log("Dữ liệu gửi email:", emailData);
      await VoucherService.sendVoucherEmail(emailData); // Gọi API gửi email
      toast.success(
        `Đã gửi voucher ${selectedVoucher.voucherCode} đến ${selectedCustomerIds.length} khách hàng từ aduc79176@gmail.com`
      );
      setEmailModalOpen(false);
      setSelectedCustomerIds([]);
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response?.data || error.message
      );
      toast.error("Không thể gửi email. Vui lòng thử lại!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý Voucher</h1>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm voucher"
            className="border rounded-lg px-4 py-2 w-64 focus:ring-blue-500"
            value={search}
            onChange={handleSearch}
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilter}
              className="border rounded-lg px-4 py-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilter}
              className="border rounded-lg px-4 py-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Thêm Voucher
        </button>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow-lg text-center text-sm">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã Voucher</th>
            <th className="px-4 py-2">Tên Voucher</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Điều kiện tối thiểu</th>
            <th className="px-4 py-2">Giảm tối đa</th>
            <th className="px-4 py-2">Phần trăm giảm</th>
            <th className="px-4 py-2">Ngày bắt đầu</th>
            <th className="px-4 py-2">Ngày kết thúc</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((item, index) => (
            <tr key={item.id} className="bg-white hover:bg-gray-100 border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.voucherCode}</td>
              <td className="px-4 py-2">{item.voucherName}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2">{item.minCondition}</td>
              <td className="px-4 py-2">{item.maxDiscount}</td>
              <td className="px-4 py-2">{item.reducedPercent}%</td>
              <td className="px-4 py-2">
                {new Date(item.startDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {new Date(item.endDate).toLocaleDateString()}
              </td>
              <td
                className={`px-4 py-2 ${item.status ? "text-blue-500" : "text-red-500"}`}
              >
                {item.status ? "Kích hoạt" : "Không kích hoạt"}
              </td>
              <td className="px-4 py-2 flex justify-center gap-4">
                <button
                  className="text-blue-500"
                  onClick={() => handleUpdateVoucher(item)}
                >
                  <AiOutlineEdit size={20} />
                </button>
                <Switch
                  onChange={() => handleToggleStatus(item.id, item.status)}
                  checked={item.status}
                  height={20}
                  width={40}
                  disabled={false}
                  onColor="#1E90FF" // Sử dụng Dodger Blue làm ví dụ
                />
                <button
                  className="text-green-500"
                  onClick={() => handleOpenEmailModal(item)}
                >
                  <AiOutlineMail size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm">
            Xem
          </label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm">Voucher</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200"
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <span className="text-sm font-semibold">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Modal gửi email */}
      <Modal
        isOpen={emailModalOpen}
        onRequestClose={() => setEmailModalOpen(false)}
        contentLabel="Gửi voucher qua email"
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-20 border border-gray-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
          Gửi Voucher qua Email
        </h2>
        {selectedVoucher && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Mã Voucher:</label>
                <input
                  type="text"
                  value={selectedVoucher.voucherCode}
                  className="border rounded-lg px-4 py-2 w-full bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Tên Voucher:</label>
                <input
                  type="text"
                  value={selectedVoucher.voucherName}
                  className="border rounded-lg px-4 py-2 w-full bg-gray-100"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1">Từ Email:</label>
              <input
                type="text"
                value="aduc79176@gmail.com"
                className="border rounded-lg px-4 py-2 w-full bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">
                Chọn khách hàng:
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  onClick={handleSelectAllCustomers}
                >
                  Chọn tất cả
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  onClick={handleDeselectAllCustomers}
                >
                  Bỏ chọn tất cả
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center gap-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomerIds.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                      className="h-4 w-4"
                    />
                    <span>
                      {customer.fullname} ({customer.email || "Không có email"})
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Đã chọn: {selectedCustomerIds.length} khách hàng
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setEmailModalOpen(false)}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleSendEmail}
          >
            Gửi Email
          </button>
        </div>
      </Modal>

      <CreateVoucherModal
        isOpen={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        fetchVouchers={fetchVouchers}
      />
      <UpdateModal
        isOpen={updateModal}
        setUpdateModal={setUpdateModal}
        fetchVouchers={fetchVouchers}
        selectedVoucher={currentVoucher}
      />
    </div>
  );
}
