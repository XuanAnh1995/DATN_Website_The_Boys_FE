import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const orderStatusMap = {
  "-1": "Đã hủy",
  "0": "Chờ xác nhận",
  "1": "Chờ thanh toán",
  "2": "Đã xác nhận",
  "3": "Đang giao hàng",
  "4": "Giao hàng không thành công",
  "5": "Hoàn thành"
};

const getStatusClass = (status) =>
  status === -1 ? "text-red-500" :
  status === 0 ? "text-yellow-500" :
  status === 1 ? "text-blue-500" :
  status === 2 ? "text-green-500" :
  status === 3 ? "text-purple-500" :
  status === 4 ? "text-orange-500" : "text-gray-500";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, orders, search]);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllOrders("", currentPage - 1, pageSize);
      let sortedOrders = data?.content || [];

      if (sortConfig.key) {
        sortedOrders.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }

      setOrders(sortedOrders);
      setTotalPages(data?.totalPages || 1);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu đơn hàng");
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (selectedStatus !== null) {
      filtered = filtered.filter(order => order.statusOrder.toString() === selectedStatus);
    }

    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(order => {
        return Object.values(order).some(value => {
          if (value !== null && value !== undefined) {
            // Convert value to string and check if it includes the search term
            if (typeof value === 'object') {
              // Kiểm tra các thuộc tính con (customer, employee, v.v.)
              if (value.fullname && value.fullname.toLowerCase().includes(searchTerm)) {
                return true;
              }
            }
            return value.toString().toLowerCase().includes(searchTerm);
          }
          return false;
        });
      });
    }

    setFilteredOrders(filtered);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Quản lý đơn hàng</h1>
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="flex gap-2 mb-4">
        {Object.keys(orderStatusMap).map((key) => (
          <button
            key={key}
            onClick={() => handleStatusFilter(key)}
            className={`px-4 py-2 border rounded ${selectedStatus === key ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {orderStatusMap[key]}
          </button>
        ))}
      </div>
      <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("id")}>STT {sortConfig.key === "id" && (sortConfig.direction === "asc" ? <AiFillCaretUp /> : <AiFillCaretDown />)}</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("orderCode")}>Mã đơn hàng {sortConfig.key === "orderCode" && (sortConfig.direction === "asc" ? <AiFillCaretUp /> : <AiFillCaretDown />)}</th>
            <th className="px-4 py-2">Tên khách hàng</th>
            <th className="px-4 py-2">Tên nhân viên</th>
            <th className="px-4 py-2">Tổng tiền</th>
            <th className="px-4 py-2">Tổng số lượng sản phẩm</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((item, index) => (
            <tr key={item.id} className="bg-white hover:bg-gray-100">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.orderCode}</td>
              <td className="px-4 py-2">{item.customer?.fullname}</td>
              <td className="px-4 py-2">{item.employee?.fullname}</td>
              <td className="px-4 py-2">{item.totalBill}</td>
              <td className="px-4 py-2">{item.totalAmount}</td>
              <td className={`px-4 py-2 ${getStatusClass(item.statusOrder)}`}>
                {orderStatusMap[item.statusOrder.toString()] || "Không xác định"}
              </td>
              <td className="px-4 py-2 flex justify-center gap-4">
                <button className="text-blue-500" onClick={() => navigate(`/admin/order/${item.id}/details`)}>
                  <AiOutlineEye size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
