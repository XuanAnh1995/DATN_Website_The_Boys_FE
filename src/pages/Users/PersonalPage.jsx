import React, { useEffect, useState } from "react";
import CustomerService from "../../services/CustomerService";
import { toast } from "react-toastify";

const PersonalPage = ({ customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerData = await CustomerService.getById(customerId);
        setCustomer(customerData);
        setFormData({
          fullname: customerData.fullname || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          password: "", // Không lấy password từ backend
        });
        setDefaultAddress(null); // Chưa có API địa chỉ
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        toast.error("Không thể tải thông tin khách hàng!");
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        ...(formData.password && { password: formData.password }), // Chỉ gửi password nếu có thay đổi
      };
      await CustomerService.update(customerId, updateData);
      setCustomer({ ...customer, ...updateData });
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Cập nhật thông tin thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) {
    return <p className="text-center text-gray-500 text-3xl">Đang tải...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800">Trang Cá Nhân</h1>
        <p className="text-gray-600 mt-2">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
                />
              </svg>
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {customer.fullname || "Chưa cập nhật"}
            </h2>
            <p className="text-gray-600">
              Mã khách hàng: {customer.customerCode}
            </p>
            <p className="text-gray-600">
              Trạng thái: {customer.status ? "Hoạt động" : "Không hoạt động"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <p className="mt-1 text-gray-900">{customer.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {customer.fullname || "Chưa cập nhật"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {customer.email || "Chưa cập nhật"}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {customer.phone || "Chưa cập nhật"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày tạo tài khoản
              </label>
              <p className="mt-1 text-gray-900">
                {customer.createDate
                  ? new Date(customer.createDate).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cập nhật gần nhất
              </label>
              <p className="mt-1 text-gray-900">
                {customer.updateDate
                  ? new Date(customer.updateDate).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Địa chỉ mặc định
          </h3>
          {defaultAddress ? (
            <p className="text-gray-900">
              {defaultAddress.address_detail}, {defaultAddress.ward_name},{" "}
              {defaultAddress.district_name}, {defaultAddress.province_name}
            </p>
          ) : (
            <p className="text-gray-600 italic">Chưa có địa chỉ mặc định</p>
          )}
          <a
            href="/addresses"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Quản lý địa chỉ
          </a>
        </div>

        {isEditing && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Đổi mật khẩu (nếu cần)
            </h3>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu mới (bỏ trống nếu không đổi)"
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
