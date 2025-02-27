import React, { useEffect, useState } from "react";
import StatisticsService from "../../../services/StatisticsService";
import { Card, CardContent } from "./components/card";
import DailyRevenueChart from "./components/DailyRevenueChart";
import WeeklyRevenueChart from "./components/WeeklyRevenueChart";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";
import YearlyRevenueChart from "./components/YearlyRevenueChart";

const StatisticsPage = () => {
    const [activeTab, setActiveTab] = useState("daily");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [weeklyRevenue, setWeeklyRevenue] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [yearlyRevenue, setYearlyRevenue] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalStaff, setTotalStaff] = useState(0);
    const [topSellingProducts, setTopSellingProducts] = useState([]); 
    
    useEffect(() => {
        StatisticsService.getDailyRevenue().then(res => setDailyRevenue(res.data.data));
        StatisticsService.getWeeklyRevenue().then(res => setWeeklyRevenue(res.data.data));
        StatisticsService.getMonthlyRevenue().then(res => setMonthlyRevenue(res.data.data));
        StatisticsService.getYearlyRevenue().then(res => setYearlyRevenue(res.data.data));
        StatisticsService.getTotalRevenue().then(res => setTotalRevenue(res.data.data));
        StatisticsService.getTotalCustomers().then(res => setTotalCustomers(res.data.data));
        StatisticsService.getTotalInvoices().then(res => setTotalInvoices(res.data.data));
        StatisticsService.getTotalAdmins().then(res => setTotalAdmins(res.data.data));
        StatisticsService.getTotalStaff().then(res => setTotalStaff(res.data.data));
    }, []);

    const fetchTopSellingProducts = () => {
        if (!startDate || !endDate) return;
        StatisticsService.getTopSellingProducts(startDate, endDate)
            .then(res => setTopSellingProducts(res.data.data)) 
            .catch(err => console.error("Lỗi khi tải top sản phẩm:", err));
    };

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
                    {activeTab === "daily" && <DailyRevenueChart data={dailyRevenue} />}
                    {activeTab === "weekly" && <WeeklyRevenueChart data={weeklyRevenue} />}
                    {activeTab === "monthly" && <MonthlyRevenueChart data={monthlyRevenue} />}
                    {activeTab === "yearly" && <YearlyRevenueChart data={yearlyRevenue} />}
                </CardContent>
            </Card>

            {/* Bộ lọc ngày */}
            <Card className="col-span-3">
                <CardContent>
                    <h2 className="text-xl font-bold">Top 5 sản phẩm bán chạy</h2>
                    <div className="flex gap-4 mb-4">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
                        <button onClick={fetchTopSellingProducts} className="bg-blue-500 text-white px-4 py-2 rounded">Lọc</button>
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
                            {topSellingProducts.map((product, index) => (
                                <tr key={index}>
                                    <td className="border p-2 text-center">{index + 1}</td>
                                    <td className="border p-2">{product.productDetailName}</td>
                                    <td className="border p-2 text-center">{product.totalQuantitySold}</td>
                                    <td className="border p-2 text-right">{product.totalRevenue.toLocaleString("vi-VN")} đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatisticsPage;
