import React, { useState, useEffect } from "react";
import { AiFillCaretUp, AiFillCaretDown, AiOutlineEye } from "react-icons/ai";
import Switch from "react-switch";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const data = await OrderService.getAllOrders(
                search,
                currentPage,
                pageSize,
                sortConfig.key,
                sortConfig.direction
            );
            console.log("Fetched orders:", data); // Thêm log để kiểm tra dữ liệu
            if (data && data.content) {
                setOrders(data.content);
                setTotalPages(data.totalPages);
            } else {
                setOrders([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Đã xảy ra lỗi khi tải dữ liệu đơn hàng");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, pageSize, search, sortConfig]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await OrderService.toggleStatusOrder(id);
            const updatedItems = orders.map((item) =>
                item.id === id ? { ...item, statusOrder: item.statusOrder === 1 ? 0 : 1 } : item
            );
            setOrders(updatedItems);
            toast.success("Thay đổi trạng thái đơn hàng thành công!");
        } catch (error) {
            console.error("Error toggling order status:", error);
            toast.error("Không thể thay đổi trạng thái đơn hàng. Vui lòng thử lại!");
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/admin/order/${id}/details`);
    };

    const renderRows = () => {
        const sortedItems = [...orders].sort((a, b) => {
            if (sortConfig.key === null) return 0;

            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return sortedItems.map((item, index) => (
            <tr key={item.id} className="bg-white hover:bg-gray-100 transition-colors">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.orderCode}</td>
                <td className={`px-4 py-2 ${item.statusOrder === 1 ? "text-green-500" : "text-red-500"}`}>
                    {item.statusOrder === 1 ? "Kích hoạt" : "Không kích hoạt"}
                </td>
                <td className="px-4 py-2 flex justify-center gap-4">
                    <button className="text-blue-500 hover:text-blue-600" onClick={() => handleViewDetails(item.id)}>
                        <AiOutlineEye size={20} />
                    </button>
                    <Switch
                        onChange={() => handleToggleStatus(item.id)}
                        checked={item.statusOrder === 1}
                        offColor="#808080"
                        onColor="#00FF00" // Màu xanh lá cây
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={20}
                        width={40}
                    />
                </td>
            </tr>
        ));
    };

    const renderSortableHeader = (label, sortKey) => {
        const isSorted = sortConfig.key === sortKey;
        const isAscending = isSorted && sortConfig.direction === "asc";

        return (
            <th
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors relative"
                onClick={() => handleSort(sortKey)}
            >
                <div className="flex items-center justify-center">
                    {label}
                    <div className="ml-2 flex flex-col">
                        <AiFillCaretUp
                            className={`text-sm ${isSorted && isAscending ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
                        />
                        <AiFillCaretDown
                            className={`text-sm ${isSorted && !isAscending ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
                        />
                    </div>
                </div>
            </th>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold mb-4">Quản lý đơn hàng</h1>

            <div className="flex items-center justify-between mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng"
                        className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center text-xs">
                <thead>
                    <tr className="bg-gray-100 text-center">
                        <th className="px-4 py-2">STT</th>
                        {renderSortableHeader("Mã đơn hàng", "orderCode")}
                        {renderSortableHeader("Trạng thái", "statusOrder")}
                        <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>{Array.isArray(orders) && renderRows()}</tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="entries" className="text-sm text-gray-700">Xem</label>
                    <select
                        id="entries"
                        className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                    <span className="text-sm text-gray-700">Đơn hàng</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}  // Disable khi ở trang đầu
                    >
                        {"<"}
                    </button>
                    <span className="text-sm text-gray-700">Trang {currentPage + 1} / {totalPages}</span>
                    <button
                        className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}  // Disable khi ở trang cuối
                    >
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
}