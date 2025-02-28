import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/statistics";

const StatisticsService = {
    getDailyRevenue: () => axios.get(`${API_BASE_URL}/daily-revenue`),
    getWeeklyRevenue: () => axios.get(`${API_BASE_URL}/weekly-revenue`),
    getMonthlyRevenue: () => axios.get(`${API_BASE_URL}/monthly-revenue`),
    getYearlyRevenue: () => axios.get(`${API_BASE_URL}/yearly-revenue`),
    getTotalRevenue: () => axios.get(`${API_BASE_URL}/total-revenue`),
    getTotalCustomers: () => axios.get(`${API_BASE_URL}/total-customers`),
    getTotalInvoices: () => axios.get(`${API_BASE_URL}/total-invoices`),
    getTotalAdmins: () => axios.get(`${API_BASE_URL}/total-admins`),
    getTotalStaff: () => axios.get(`${API_BASE_URL}/total-staff`),
    getTopSellingProducts: (startDate, endDate) => axios.get(`${API_BASE_URL}/top-5-products`, { params: { startDate, endDate } })
};

export default StatisticsService;