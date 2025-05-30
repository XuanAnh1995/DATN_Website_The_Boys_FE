import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatisticsService from "../../../services/StatisticsService";
import { Card, CardContent } from "./components/card";
import DailyRevenueChart from "./components/DailyRevenueChart";
import WeeklyRevenueChart from "./components/WeeklyRevenueChart";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";
import YearlyRevenueChart from "./components/YearlyRevenueChart";
import ChannelRevenueChart from "./components/ChannelRevenueChart";
import OrderStatusDistributionChart from "./components/OrderStatusDistributionChart";
// import PaymentMethodDistributionChart from "./components/PaymentMethodDistributionChart";
import TopCustomersChart from "./components/TopCustomersChart";
import TopInventoryProductsChart from "./components/TopInventoryProductsChart";

const StatisticsPage = () => {
  const { role } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [error, setError] = useState(null);

  // Kiểm tra vai trò ngay khi component được render
  if (role !== "ADMIN") {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-bold">
          Vui lòng đăng nhập dưới quyền ADMIN
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          totalRevenueRes,
          totalCustomersRes,
          totalInvoicesRes,
          totalAdminsRes,
          totalStaffRes,
        ] = await Promise.all([
          StatisticsService.getTotalRevenue(),
          StatisticsService.getTotalCustomers(),
          StatisticsService.getTotalInvoices(),
          StatisticsService.getTotalAdmins(),
          StatisticsService.getTotalStaff(),
        ]);
        setTotalRevenue(totalRevenueRes || 0);
        setTotalCustomers(totalCustomersRes || 0);
        setTotalInvoices(totalInvoicesRes || 0);
        setTotalAdmins(totalAdminsRes || 0);
        setTotalStaff(totalStaffRes || 0);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error("Vui lòng đăng nhập dưới quyền ADMIN");
        } else {
          toast.error("Không thể tải danh sách nhân viên. Vui lòng thử lại!");
        }
      }
    };
    fetchData();
  }, []);

  const fetchTopSellingProducts = async () => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn khoảng thời gian.");
      return;
    }
    try {
      const data = await StatisticsService.getTopSellingProducts(
        startDate,
        endDate
      );
      setTopSellingProducts(data || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải top sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm bán chạy.");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng doanh thu</h2>
          <p className="text-2xl">{totalRevenue.toLocaleString("vi-VN")} đ</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng khách hàng</h2>
          <p className="text-2xl">{totalCustomers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng hóa đơn</h2>
          <p className="text-2xl">{totalInvoices}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng quản trị viên</h2>
          <p className="text-2xl">{totalAdmins}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tổng nhân viên</h2>
          <p className="text-2xl">{totalStaff}</p>
        </CardContent>
      </Card>

      {/* Biểu đồ doanh thu với Tabs */}
      <Card className="col-span-3">
        <CardContent>
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "daily" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("daily")}
            >
              Theo Ngày
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "weekly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("weekly")}
            >
              Theo Tuần
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "monthly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("monthly")}
            >
              Theo Tháng
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "yearly" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("yearly")}
            >
              Theo Năm
            </button>
          </div>

          {/* Hiển thị biểu đồ theo tab được chọn */}
          {activeTab === "daily" && <DailyRevenueChart />}
          {activeTab === "weekly" && <WeeklyRevenueChart />}
          {activeTab === "monthly" && <MonthlyRevenueChart />}
          {activeTab === "yearly" && <YearlyRevenueChart />}
        </CardContent>
      </Card>
      {/* Doanh thu theo kênh */}
      <ChannelRevenueChart />

      {/* Tỷ lệ đơn hàng theo trạng thái */}
      <OrderStatusDistributionChart />

      {/* Tỷ lệ thanh toán theo phương thức
            <PaymentMethodDistributionChart /> */}

      {/* Top 5 khách hàng mua nhiều nhất */}
      <TopCustomersChart />

      {/* Top 5 sản phẩm tồn kho nhiều nhất */}
      <TopInventoryProductsChart />

      {/* Bộ lọc ngày và top sản phẩm bán chạy */}
      <Card className="col-span-3">
        <CardContent>
          <h2 className="text-xl font-bold">Top 5 sản phẩm bán chạy</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={fetchTopSellingProducts}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lọc
            </button>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Sản phẩm</th>
                <th className="border p-2">Số lượng bán</th>
                <th className="border p-2">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      {product.productDetailName || "Không xác định"}
                    </td>
                    <td className="border p-2 text-center">
                      {product.totalQuantitySold || 0}
                    </td>
                    <td className="border p-2 text-right">
                      {(product.totalRevenue || 0).toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
