import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_BASE_URL = "/api/statistics"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const StatisticsService = {
    // Lấy doanh thu ngày
    getDailyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/daily-revenue`);
            console.log("✅ Doanh thu ngày:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu ngày
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu ngày:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu tuần
    getWeeklyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/weekly-revenue`);
            console.log("✅ Doanh thu tuần:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu tuần
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu tuần:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu tháng
    getMonthlyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/monthly-revenue`);
            console.log("✅ Doanh thu tháng:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu tháng
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu tháng:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy doanh thu năm
    getYearlyRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/yearly-revenue`);
            console.log("✅ Doanh thu năm:", response.data.data);
            return response.data.data; // Trả về dữ liệu doanh thu năm
        } catch (error) {
            console.error("❌ Lỗi khi lấy doanh thu năm:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng doanh thu
    getTotalRevenue: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-revenue`);
            console.log("✅ Tổng doanh thu:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng doanh thu
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng doanh thu:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số khách hàng
    getTotalCustomers: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-customers`);
            console.log("✅ Tổng số khách hàng:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số khách hàng
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số khách hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số hóa đơn
    getTotalInvoices: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-invoices`);
            console.log("✅ Tổng số hóa đơn:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số hóa đơn
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số hóa đơn:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số quản trị viên
    getTotalAdmins: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-admins`);
            console.log("✅ Tổng số quản trị viên:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số quản trị viên
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số quản trị viên:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy tổng số nhân viên
    getTotalStaff: async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/total-staff`);
            console.log("✅ Tổng số nhân viên:", response.data.data);
            return response.data.data; // Trả về dữ liệu tổng số nhân viên
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số nhân viên:", error.response?.data || error.message);
            throw error;
        }
    },

    // Lấy danh sách sản phẩm bán chạy nhất
    getTopSellingProducts: async (startDate, endDate) => {
        try {
            const response = await api.get(`${API_BASE_URL}/top-5-products`, {
                params: { startDate, endDate },
            });
            console.log("✅ Top sản phẩm bán chạy:", response.data.data);
            return response.data.data; // Trả về dữ liệu top sản phẩm
        } catch (error) {
            console.error("❌ Lỗi khi lấy top sản phẩm bán chạy:", error.response?.data || error.message);
            throw error;
        }
    },
};

export default StatisticsService;