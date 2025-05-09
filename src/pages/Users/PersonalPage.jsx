// // import React, { useEffect, useState } from "react";
// // import { useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import LoginInfoService from "../../services/LoginInfoService";
// // import { toast } from "react-toastify";

// // const PersonalPage = () => {
// //   const { isLoggedIn, role } = useSelector((state) => state.user);
// //   const [customer, setCustomer] = useState(null);
// //   const [defaultAddress, setDefaultAddress] = useState(null);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [formData, setFormData] = useState({
// //     fullname: "",
// //     email: "",
// //     phone: "",
// //     oldPassword: "",
// //     newPassword: "",
// //     confirmNewPassword: "",
// //   });
// //   const [avatarFile, setAvatarFile] = useState(null);
// //   const [avatarPreview, setAvatarPreview] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const validateForm = () => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     const phoneRegex = /^\d{10}$/;

// //     if (!formData.fullname.trim()) {
// //       toast.error("Họ và tên không được để trống!");
// //       return false;
// //     }
// //     if (!emailRegex.test(formData.email)) {
// //       toast.error("Email không hợp lệ!");
// //       return false;
// //     }
// //     if (!phoneRegex.test(formData.phone)) {
// //       toast.error("Số điện thoại phải có đúng 10 chữ số!");
// //       return false;
// //     }
// //     if (
// //       formData.oldPassword ||
// //       formData.newPassword ||
// //       formData.confirmNewPassword
// //     ) {
// //       if (!formData.oldPassword) {
// //         toast.error("Vui lòng nhập mật khẩu cũ!");
// //         return false;
// //       }
// //       if (!formData.newPassword) {
// //         toast.error("Vui lòng nhập mật khẩu mới!");
// //         return false;
// //       }
// //       if (formData.newPassword.length < 6) {
// //         toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
// //         return false;
// //       }
// //       if (formData.newPassword !== formData.confirmNewPassword) {
// //         toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   useEffect(() => {
// //     const fetchCustomerData = async () => {
// //       if (!isLoggedIn || role !== "CUSTOMER") {
// //         toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
// //         navigate("/login");
// //         return;
// //       }

// //       try {
// //         const customerData = await LoginInfoService.getCurrentUser();
// //         console.log("Dữ liệu khách hàng:", customerData);
// //         setCustomer(customerData);
// //         setFormData({
// //           fullname: customerData.fullname || "",
// //           email: customerData.email || "",
// //           phone: customerData.phone || "",
// //           oldPassword: "",
// //           newPassword: "",
// //           confirmNewPassword: "",
// //         });
// //         setAvatarPreview(
// //           customerData.avatar || "https://via.placeholder.com/150"
// //         );

// //         const addresses = await LoginInfoService.getCurrentUserAddresses();
// //         console.log("Dữ liệu địa chỉ:", addresses);
// //         const defaultAddr = addresses?.find((addr) => addr.isDefault) || null;
// //         setDefaultAddress(defaultAddr);
// //       } catch (error) {
// //         console.error("Lỗi khi lấy thông tin khách hàng:", error);
// //         toast.error(
// //           error.response?.data?.message || "Không thể tải thông tin khách hàng!"
// //         );
// //         navigate("/login");
// //       }
// //     };

// //     fetchCustomerData();
// //   }, [isLoggedIn, role, navigate]);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleAvatarChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (!file.type.startsWith("image/")) {
// //         toast.error("Vui lòng chọn file ảnh (jpg, png, ...)");
// //         return;
// //       }
// //       if (file.size > 5 * 1024 * 1024) {
// //         toast.error("Ảnh không được lớn hơn 5MB!");
// //         return;
// //       }
// //       setAvatarFile(file);
// //       setAvatarPreview(URL.createObjectURL(file));
// //     }
// //   };

// //   const handleUpdate = async () => {
// //     if (!validateForm()) return;

// //     try {
// //       setIsLoading(true);

// //       const updateData = {
// //         fullname: formData.fullname,
// //         email: formData.email,
// //         phone: formData.phone,
// //       };
// //       if (formData.oldPassword && formData.newPassword) {
// //         updateData.oldPassword = formData.oldPassword;
// //         updateData.password = formData.newPassword;
// //       }
// //       const response = await LoginInfoService.updateCurrentUser(updateData);
// //       let updatedCustomer = { ...customer, ...updateData };

// //       if (avatarFile) {
// //         const formData = new FormData();
// //         formData.append("avatar", avatarFile);
// //         const avatarResponse = await LoginInfoService.updateAvatar(formData);
// //         console.log("Avatar response:", avatarResponse);
// //         if (
// //           avatarResponse.status === "success" &&
// //           avatarResponse.data.avatarUrl
// //         ) {
// //           updatedCustomer.avatar = avatarResponse.data.avatarUrl;
// //           setAvatarFile(null);
// //         } else {
// //           toast.warn(
// //             "Cập nhật ảnh đại diện thất bại, nhưng thông tin khác đã được lưu."
// //           );
// //         }
// //       }

// //       setCustomer(updatedCustomer);
// //       setIsEditing(false);
// //       setAvatarPreview(
// //         updatedCustomer.avatar || "https://via.placeholder.com/150"
// //       );
// //       setFormData({
// //         fullname: updatedCustomer.fullname || "",
// //         email: updatedCustomer.email || "",
// //         phone: updatedCustomer.phone || "",
// //         oldPassword: "",
// //         newPassword: "",
// //         confirmNewPassword: "",
// //       });
// //       toast.success(response.data?.message || "Cập nhật thông tin thành công!");
// //     } catch (error) {
// //       console.error(
// //         "Lỗi khi cập nhật thông tin:",
// //         error.response?.data || error.message
// //       );
// //       toast.error(
// //         error.response?.data?.message || "Cập nhật thông tin thất bại!"
// //       );
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   if (!isLoggedIn || role !== "CUSTOMER") {
// //     return (
// //       <p className="text-center text-red-500 text-3xl">
// //         Vui lòng đăng nhập để xem thông tin cá nhân!
// //       </p>
// //     );
// //   }

// //   if (!customer) {
// //     return <p className="text-center text-gray-500 text-3xl">Đang tải...</p>;
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
// //       <div className="text-center mb-8">
// //         <h1 className="text-4xl font-bold text-blue-800">Trang Cá Nhân</h1>
// //         <p className="text-gray-600 mt-2">
// //           Quản lý thông tin tài khoản của bạn
// //         </p>
// //       </div>

// //       <div className="bg-white shadow-lg rounded-lg p-6">
// //         <div className="flex items-center gap-6 mb-6">
// //           <div className="relative">
// //             <img
// //               src={avatarPreview}
// //               alt="Avatar"
// //               className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
// //             />
// //             {isEditing && (
// //               <input
// //                 type="file"
// //                 accept="image/*"
// //                 onChange={handleAvatarChange}
// //                 className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition cursor-pointer opacity-0 w-10 h-10"
// //                 style={{ zIndex: 1 }}
// //               />
// //             )}
// //             <button
// //               className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
// //               onClick={() =>
// //                 document.querySelector('input[type="file"]').click()
// //               }
// //               disabled={!isEditing}
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
// //                 />
// //               </svg>
// //             </button>
// //           </div>
// //           <div>
// //             <h2 className="text-2xl font-semibold text-gray-800">
// //               {customer.fullname || "Chưa cập nhật"}
// //             </h2>
// //             <p className="text-gray-600">
// //               Mã khách hàng: {customer.customerCode || "Chưa cập nhật"}
// //             </p>
// //             <p className="text-gray-600">
// //               Trạng thái: {customer.status ? "Hoạt động" : "Không hoạt động"}
// //             </p>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">
// //                 Tên đăng nhập
// //               </label>
// //               <p className="mt-1 text-gray-900">
// //                 {customer.username || "Chưa cập nhật"}
// //               </p>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">
// //                 Họ và tên
// //               </label>
// //               {isEditing ? (
// //                 <input
// //                   type="text"
// //                   name="fullname"
// //                   value={formData.fullname}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               ) : (
// //                 <p className="mt-1 text-gray-900">
// //                   {customer.fullname || "Chưa cập nhật"}
// //                 </p>
// //               )}
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">
// //                 Email
// //               </label>
// //               {isEditing ? (
// //                 <input
// //                   type="email"
// //                   name="email"
// //                   value={formData.email}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               ) : (
// //                 <p className="mt-1 text-gray-900">
// //                   {customer.email || "Chưa cập nhật"}
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">
// //                 Số điện thoại
// //               </label>
// //               {isEditing ? (
// //                 <input
// //                   type="text"
// //                   name="phone"
// //                   value={formData.phone}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               ) : (
// //                 <p className="mt-1 text-gray-900">
// //                   {customer.phone || "Chưa cập nhật"}
// //                 </p>
// //               )}
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">
// //                 Ngày tạo tài khoản
// //               </label>
// //               <p className="mt-1 text-gray-900">
// //                 {customer.createDate
// //                   ? new Date(customer.createDate).toLocaleDateString("vi-VN")
// //                   : "Chưa cập nhật"}
// //               </p>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">
// //                 Cập nhật gần nhất
// //               </label>
// //               <p className="mt-1 text-gray-900">
// //                 {customer.updateDate
// //                   ? new Date(customer.updateDate).toLocaleDateString("vi-VN")
// //                   : "Chưa cập nhật"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mb-6">
// //           <h3 className="text-lg font-semibold text-gray-800 mb-2">
// //             Địa chỉ mặc định
// //           </h3>
// //           {defaultAddress ? (
// //             <p className="text-gray-900">
// //               {defaultAddress.address_detail}, {defaultAddress.ward_name},{" "}
// //               {defaultAddress.district_name}, {defaultAddress.province_name}
// //             </p>
// //           ) : (
// //             <p className="text-gray-600 italic">Chưa có địa chỉ mặc định</p>
// //           )}
// //           <a
// //             href="/addresses"
// //             className="text-blue-600 hover:underline text-sm mt-2 inline-block"
// //           >
// //             Quản lý địa chỉ
// //           </a>
// //         </div>

// //         {isEditing && (
// //           <div className="mb-6">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-2">
// //               Đổi mật khẩu (nếu cần)
// //             </h3>
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Mật khẩu cũ
// //                 </label>
// //                 <input
// //                   type="password"
// //                   name="oldPassword"
// //                   value={formData.oldPassword}
// //                   onChange={handleInputChange}
// //                   placeholder="Nhập mật khẩu cũ"
// //                   autoComplete="current-password"
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Mật khẩu mới
// //                 </label>
// //                 <input
// //                   type="password"
// //                   name="newPassword"
// //                   value={formData.newPassword}
// //                   onChange={handleInputChange}
// //                   placeholder="Nhập mật khẩu mới"
// //                   autoComplete="new-password"
// //                   className="mt-1 block w-full border класиране border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Xác nhận mật khẩu mới
// //                 </label>
// //                 <input
// //                   type="password"
// //                   name="confirmNewPassword"
// //                   value={formData.confirmNewPassword}
// //                   onChange={handleInputChange}
// //                   placeholder="Xác nhận mật khẩu mới"
// //                   autoComplete="new-password"
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         <div className="flex gap-4">
// //           {isEditing ? (
// //             <>
// //               <button
// //                 onClick={handleUpdate}
// //                 disabled={isLoading}
// //                 className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
// //                   isLoading ? "opacity-50 cursor-not-allowed" : ""
// //                 }`}
// //               >
// //                 {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
// //               </button>
// //               <button
// //                 onClick={() => {
// //                   setIsEditing(false);
// //                   setAvatarFile(null);
// //                   setAvatarPreview(
// //                     customer.avatar || "https://via.placeholder.com/150"
// //                   );
// //                   setFormData({
// //                     fullname: customer.fullname || "",
// //                     email: customer.email || "",
// //                     phone: customer.phone || "",
// //                     oldPassword: "",
// //                     newPassword: "",
// //                     confirmNewPassword: "",
// //                   });
// //                 }}
// //                 className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
// //               >
// //                 Hủy
// //               </button>
// //             </>
// //           ) : (
// //             <button
// //               onClick={() => setIsEditing(true)}
// //               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
// //             >
// //               Chỉnh sửa thông tin
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PersonalPage;
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import LoginInfoService from "../../services/LoginInfoService";
// import { toast } from "react-toastify";

// const PersonalPage = () => {
//   const { isLoggedIn, role } = useSelector((state) => state.user);
//   const [customer, setCustomer] = useState(null);
//   const [defaultAddress, setDefaultAddress] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     fullname: "",
//     email: "",
//     phone: "",
//     oldPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^\d{10}$/;

//     if (!formData.fullname.trim()) {
//       toast.error("Họ và tên không được để trống!");
//       return false;
//     }
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Email không hợp lệ!");
//       return false;
//     }
//     if (!phoneRegex.test(formData.phone)) {
//       toast.error("Số điện thoại phải có đúng 10 chữ số!");
//       return false;
//     }
//     return true;
//   };

//   const validatePasswordForm = () => {
//     if (!formData.oldPassword) {
//       toast.error("Vui lòng nhập mật khẩu cũ!");
//       return false;
//     }
//     if (!formData.newPassword) {
//       toast.error("Vui lòng nhập mật khẩu mới!");
//       return false;
//     }
//     if (formData.newPassword.length < 6) {
//       toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
//       return false;
//     }
//     if (formData.newPassword !== formData.confirmNewPassword) {
//       toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
//       return false;
//     }
//     return true;
//   };

//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       if (!isLoggedIn || role !== "CUSTOMER") {
//         toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
//         navigate("/login");
//         return;
//       }

//       try {
//         const customerData = await LoginInfoService.getCurrentUser();
//         console.log("Dữ liệu khách hàng:", customerData);
//         setCustomer(customerData);
//         setFormData({
//           fullname: customerData.fullname || "",
//           email: customerData.email || "",
//           phone: customerData.phone || "",
//           oldPassword: "",
//           newPassword: "",
//           confirmNewPassword: "",
//         });
//         setAvatarPreview(
//           customerData.avatar || "https://via.placeholder.com/150"
//         );

//         const addresses = await LoginInfoService.getCurrentUserAddresses();
//         console.log("Dữ liệu địa chỉ:", addresses);
//         const defaultAddr = addresses?.find((addr) => addr.isDefault) || null;
//         setDefaultAddress(defaultAddr);
//       } catch (error) {
//         console.error("Lỗi khi lấy thông tin khách hàng:", error);
//         toast.error(
//           error.response?.data?.message || "Không thể tải thông tin khách hàng!"
//         );
//         navigate("/login");
//       }
//     };

//     fetchCustomerData();
//   }, [isLoggedIn, role, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         toast.error("Vui lòng chọn file ảnh (jpg, png, ...)");
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Ảnh không được lớn hơn 5MB!");
//         return;
//       }
//       setAvatarFile(file);
//       setAvatarPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdate = async () => {
//     if (!validateForm()) return;

//     try {
//       setIsLoading(true);

//       const updateData = {
//         fullname: formData.fullname,
//         email: formData.email,
//         phone: formData.phone,
//       };
//       const response = await LoginInfoService.updateCurrentUser(updateData);
//       let updatedCustomer = { ...customer, ...updateData };

//       if (avatarFile) {
//         const formData = new FormData();
//         formData.append("avatar", avatarFile);
//         const avatarResponse = await LoginInfoService.updateAvatar(formData);
//         console.log("Avatar response:", avatarResponse);
//         if (
//           avatarResponse.status === "success" &&
//           avatarResponse.data.avatarUrl
//         ) {
//           updatedCustomer.avatar = avatarResponse.data.avatarUrl;
//           setAvatarFile(null);
//         } else {
//           toast.warn(
//             "Cập nhật ảnh đại diện thất bại, nhưng thông tin khác đã được lưu."
//           );
//         }
//       }

//       setCustomer(updatedCustomer);
//       setIsEditing(false);
//       setAvatarPreview(
//         updatedCustomer.avatar || "https://via.placeholder.com/150"
//       );
//       setFormData({
//         fullname: updatedCustomer.fullname || "",
//         email: updatedCustomer.email || "",
//         phone: updatedCustomer.phone || "",
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });
//       toast.success(response.data?.message || "Cập nhật thông tin thành công!");
//     } catch (error) {
//       console.error(
//         "Lỗi khi cập nhật thông tin:",
//         error.response?.data || error.message
//       );
//       toast.error(
//         error.response?.data?.message || "Cập nhật thông tin thất bại!"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePasswordUpdate = async () => {
//     if (!validatePasswordForm()) return;

//     try {
//       setIsLoading(true);

//       const updateData = {
//         oldPassword: formData.oldPassword,
//         password: formData.newPassword,
//       };
//       const response = await LoginInfoService.updateCurrentUser(updateData);
//       setIsPasswordModalOpen(false);
//       setFormData({
//         ...formData,
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });
//       toast.success(response.data?.message || "Đổi mật khẩu thành công!");
//     } catch (error) {
//       console.error(
//         "Lỗi khi đổi mật khẩu:",
//         error.response?.data || error.message
//       );
//       toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isLoggedIn || role !== "CUSTOMER") {
//     return (
//       <p className="text-center text-red-500 text-3xl">
//         Vui lòng đăng nhập để xem thông tin cá nhân!
//       </p>
//     );
//   }

//   if (!customer) {
//     return <p className="text-center text-gray-500 text-3xl">Đang tải...</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-bold text-blue-800">Trang Cá Nhân</h1>
//         <p className="text-gray-600 mt-2">
//           Quản lý thông tin tài khoản của bạn
//         </p>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <div className="flex items-center gap-6 mb-6">
//           <div className="relative">
//             <img
//               src={avatarPreview}
//               alt="Avatar"
//               className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
//             />
//             {isEditing && (
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//                 className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition cursor-pointer opacity-0 w-10 h-10"
//                 style={{ zIndex: 1 }}
//               />
//             )}
//             <button
//               className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
//               onClick={() =>
//                 document.querySelector('input[type="file"]').click()
//               }
//               disabled={!isEditing}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800">
//               {customer.fullname || "Chưa cập nhật"}
//             </h2>
//             <p className="text-gray-600">
//               Mã khách hàng: {customer.customerCode || "Chưa cập nhật"}
//             </p>
//             <p className="text-gray-600">
//               Trạng thái: {customer.status ? "Hoạt động" : "Không hoạt động"}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Tên đăng nhập
//               </label>
//               <p className="mt-1 text-gray-900">
//                 {customer.username || "Chưa cập nhật"}
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Họ và tên
//               </label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="fullname"
//                   value={formData.fullname}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               ) : (
//                 <p className="mt-1 text-gray-900">
//                   {customer.fullname || "Chưa cập nhật"}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               {isEditing ? (
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               ) : (
//                 <p className="mt-1 text-gray-900">
//                   {customer.email || "Chưa cập nhật"}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Số điện thoại
//               </label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               ) : (
//                 <p className="mt-1 text-gray-900">
//                   {customer.phone || "Chưa cập nhật"}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Ngày tạo tài khoản
//               </label>
//               <p className="mt-1 text-gray-900">
//                 {customer.createDate
//                   ? new Date(customer.createDate).toLocaleDateString("vi-VN")
//                   : "Chưa cập nhật"}
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Cập nhật gần nhất
//               </label>
//               <p className="mt-1 text-gray-900">
//                 {customer.updateDate
//                   ? new Date(customer.updateDate).toLocaleDateString("vi-VN")
//                   : "Chưa cập nhật"}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">
//             Địa chỉ mặc định
//           </h3>
//           {defaultAddress ? (
//             <p className="text-gray-900">
//               {defaultAddress.address_detail}, {defaultAddress.ward_name},{" "}
//               {defaultAddress.district_name}, {defaultAddress.province_name}
//             </p>
//           ) : (
//             <p className="text-gray-600 italic">Chưa có địa chỉ mặc định</p>
//           )}
//           <a
//             href="/addresses"
//             className="text-blue-600 hover:underline text-sm mt-2 inline-block"
//           >
//             Quản lý địa chỉ
//           </a>
//         </div>

//         {isEditing && (
//           <div className="mb-6">
//             <button
//               onClick={() => setIsPasswordModalOpen(true)}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Đổi mật khẩu
//             </button>
//           </div>
//         )}

//         <div className="flex gap-4">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleUpdate}
//                 disabled={isLoading}
//                 className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
//               </button>
//               <button
//                 onClick={() => {
//                   setIsEditing(false);
//                   setAvatarFile(null);
//                   setAvatarPreview(
//                     customer.avatar || "https://via.placeholder.com/150"
//                   );
//                   setFormData({
//                     fullname: customer.fullname || "",
//                     email: customer.email || "",
//                     phone: customer.phone || "",
//                     oldPassword: "",
//                     newPassword: "",
//                     confirmNewPassword: "",
//                   });
//                 }}
//                 className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
//               >
//                 Hủy
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Chỉnh sửa thông tin
//             </button>
//           )}
//         </div>
//       </div>

//       {isPasswordModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Đổi mật khẩu
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Mật khẩu cũ
//                 </label>
//                 <input
//                   type="password"
//                   name="oldPassword"
//                   value={formData.oldPassword}
//                   onChange={handleInputChange}
//                   placeholder="Nhập mật khẩu cũ"
//                   autoComplete="current-password"
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Mật khẩu mới
//                 </label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={formData.newPassword}
//                   onChange={handleInputChange}
//                   placeholder="Nhập mật khẩu mới"
//                   autoComplete="new-password"
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Xác nhận mật khẩu mới
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmNewPassword"
//                   value={formData.confirmNewPassword}
//                   onChange={handleInputChange}
//                   placeholder="Xác nhận mật khẩu mới"
//                   autoComplete="new-password"
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-4 mt-6">
//               <button
//                 onClick={handlePasswordUpdate}
//                 disabled={isLoading}
//                 className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
//               </button>
//               <button
//                 onClick={() => {
//                   setIsPasswordModalOpen(false);
//                   setFormData({
//                     ...formData,
//                     oldPassword: "",
//                     newPassword: "",
//                     confirmNewPassword: "",
//                   });
//                 }}
//                 className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
//               >
//                 Hủy
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonalPage;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import LoginInfoService from "../../services/LoginInfoService";
import AddressService from "../../services/CustomerAddressService";
import GHNService from "../../services/GHNService";
import { toast } from "react-toastify";

const PersonalPage = () => {
  const { isLoggedIn, role } = useSelector((state) => state.user);
  const [customer, setCustomer] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    customAddress: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const navigate = useNavigate();

  // Validation functions
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.fullname.trim()) {
      toast.error("Họ và tên không được để trống!");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại phải có đúng 10 chữ số!");
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!formData.oldPassword) {
      toast.error("Vui lòng nhập mật khẩu cũ!");
      return false;
    }
    if (!formData.newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới!");
      return false;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return false;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return false;
    }
    return true;
  };

  const validateNewAddressForm = () => {
    if (!selectedProvince) {
      toast.error("Vui lòng chọn tỉnh/thành phố!");
      return false;
    }
    if (!selectedDistrict) {
      toast.error("Vui lòng chọn quận/huyện!");
      return false;
    }
    if (!selectedWard) {
      toast.error("Vui lòng chọn phường/xã!");
      return false;
    }
    if (!formData.customAddress.trim()) {
      toast.error("Địa chỉ cụ thể không được để trống!");
      return false;
    }
    return true;
  };

  // Fetch initial data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isLoggedIn || role !== "CUSTOMER") {
        toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const customerData = await LoginInfoService.getCurrentUser();
        console.log("Customer data:", customerData);
        setCustomer(customerData);
        setFormData({
          fullname: customerData.fullname || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          customAddress: "",
        });
        setAvatarPreview(
          customerData.avatar || "https://via.placeholder.com/150"
        );

        // Fetch addresses
        const addresses = await LoginInfoService.getCurrentUserAddresses();
        console.log("Addresses data:", addresses);
        const formattedAddresses = addresses.map((address) => ({
          value: address.id,
          label: `${address.addressDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
          fullAddress: address,
        }));
        setUserAddresses(formattedAddresses);
        const defaultAddr =
          formattedAddresses.find((addr) => addr.fullAddress.isDefault) ||
          formattedAddresses[0] ||
          null;
        setSelectedAddress(defaultAddr);

        // Fetch provinces
        const provinceData = await GHNService.getProvinces();
        setProvinces(
          (provinceData.data || []).map((province) => ({
            value: province.ProvinceID,
            label: province.ProvinceName,
          }))
        );
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin khách hàng!"
        );
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [isLoggedIn, role, navigate]);

  // Handle province change
  const handleProvinceChange = async (selected) => {
    setSelectedProvince(selected);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    if (selected) {
      try {
        const districtData = await GHNService.getDistrictsByProvince(
          selected.value
        );
        setDistricts(
          (districtData.data || []).map((district) => ({
            value: district.DistrictID,
            label: district.DistrictName,
          }))
        );
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast.error("Lỗi khi lấy danh sách quận/huyện!");
      }
    }
  };

  // Handle district change
  const handleDistrictChange = async (selected) => {
    setSelectedDistrict(selected);
    setSelectedWard(null);
    setWards([]);
    if (selected) {
      try {
        const wardData = await GHNService.getWardsByDistrict(selected.value);
        setWards(
          (wardData.data || []).map((ward) => ({
            value: ward.WardCode,
            label: ward.WardName,
          }))
        );
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast.error("Lỗi khi lấy danh sách phường/xã!");
      }
    }
  };

  // Handle ward change
  const handleWardChange = (selected) => {
    setSelectedWard(selected);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh (jpg, png, ...)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh không được lớn hơn 5MB!");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle profile update
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
      };
      const response = await LoginInfoService.updateCurrentUser(updateData);
      let updatedCustomer = { ...customer, ...updateData };

      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        const avatarResponse =
          await LoginInfoService.updateAvatar(avatarFormData);
        console.log("Avatar response:", avatarResponse);
        if (
          avatarResponse.status === "success" &&
          avatarResponse.data.avatarUrl
        ) {
          updatedCustomer.avatar = avatarResponse.data.avatarUrl;
          setAvatarFile(null);
        } else {
          toast.warn(
            "Cập nhật ảnh đại diện thất bại, nhưng thông tin khác đã được lưu."
          );
        }
      }

      if (selectedAddress && selectedAddress.fullAddress.isDefault !== true) {
        await AddressService.update(selectedAddress.value, { isDefault: true });
        const updatedAddresses = userAddresses.map((addr) =>
          addr.value === selectedAddress.value
            ? { ...addr, fullAddress: { ...addr.fullAddress, isDefault: true } }
            : {
                ...addr,
                fullAddress: { ...addr.fullAddress, isDefault: false },
              }
        );
        setUserAddresses(updatedAddresses);
      }

      setCustomer(updatedCustomer);
      setIsEditing(false);
      setAvatarPreview(
        updatedCustomer.avatar || "https://via.placeholder.com/150"
      );
      setFormData({
        fullname: updatedCustomer.fullname || "",
        email: updatedCustomer.email || "",
        phone: updatedCustomer.phone || "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        customAddress: "",
      });
      toast.success(response.data?.message || "Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Cập nhật thông tin thất bại!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) return;

    try {
      setIsLoading(true);

      const updateData = {
        oldPassword: formData.oldPassword,
        password: formData.newPassword,
      };
      const response = await LoginInfoService.updateCurrentUser(updateData);
      setIsPasswordModalOpen(false);
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success(response.data?.message || "Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address addition
  const handleAddAddress = async () => {
    if (!validateNewAddressForm()) return;

    if (!isLoggedIn) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const newAddress = {
        address_detail: formData.customAddress,
        ward_name: selectedWard.label,
        ward_code: selectedWard.value,
        district_id: selectedDistrict.value,
        district_name: selectedDistrict.label,
        province_id: selectedProvince.value,
        province_name: selectedProvince.label,
        isDefault: userAddresses.length === 0,
      };
      console.log("Sending new address:", newAddress); // Debugging
      const response = await AddressService.create(newAddress);
      console.log("Address creation response:", response); // Debugging
      const addedAddress = {
        value: response.data.id,
        label: `${newAddress.address_detail}, ${newAddress.ward_name}, ${newAddress.district_name}, ${newAddress.province_name}`,
        fullAddress: {
          id: response.data.id,
          addressDetail: newAddress.address_detail,
          wardName: newAddress.ward_name,
          wardCode: newAddress.ward_code,
          districtId: newAddress.district_id,
          districtName: newAddress.district_name,
          provinceId: newAddress.province_id,
          provinceName: newAddress.province_name,
          isDefault: newAddress.isDefault,
        },
      };
      const updatedAddresses = [...userAddresses, addedAddress];
      if (newAddress.isDefault) {
        updatedAddresses.forEach(
          (addr) =>
            (addr.fullAddress.isDefault = addr.value === response.data.id)
        );
        setSelectedAddress(addedAddress);
      }
      setUserAddresses(updatedAddresses);
      setIsAddAddressModalOpen(false);
      setFormData({
        ...formData,
        customAddress: "",
      });
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
      toast.success(response.message || "Thêm địa chỉ thành công!");
    } catch (error) {
      console.error("Error adding address:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Thêm địa chỉ thất bại! Vui lòng thử lại."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn || role !== "CUSTOMER") {
    return (
      <p className="text-center text-red-500 text-3xl">
        Vui lòng đăng nhập để xem thông tin cá nhân!
      </p>
    );
  }

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
              src={avatarPreview}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition cursor-pointer opacity-0 w-10 h-10"
                style={{ zIndex: 1 }}
              />
            )}
            <button
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
              disabled={!isEditing}
            >
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
              Mã khách hàng: {customer.customerCode || "Chưa cập nhật"}
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
              <p className="mt-1 text-gray-900">
                {customer.username || "Chưa cập nhật"}
              </p>
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
          {isEditing ? (
            <div className="space-y-4">
              <Select
                options={userAddresses}
                value={selectedAddress}
                onChange={setSelectedAddress}
                placeholder="Chọn địa chỉ khác"
                className="mb-4"
              />
              <button
                onClick={() => setIsAddAddressModalOpen(true)}
                className="py-2.5 px-4 flex items-center justify-center w-full bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-medium rounded-md shadow-sm transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm địa chỉ mới
              </button>
            </div>
          ) : selectedAddress ? (
            <p className="text-gray-900">
              {selectedAddress.fullAddress.addressDetail},{" "}
              {selectedAddress.fullAddress.wardName},{" "}
              {selectedAddress.fullAddress.districtName},{" "}
              {selectedAddress.fullAddress.provinceName}
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
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Đổi mật khẩu
            </button>
          </div>
        )}

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setAvatarFile(null);
                  setAvatarPreview(
                    customer.avatar || "https://via.placeholder.com/150"
                  );
                  setFormData({
                    fullname: customer.fullname || "",
                    email: customer.email || "",
                    phone: customer.phone || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                    customAddress: "",
                  });
                }}
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

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Đổi mật khẩu
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu cũ"
                  autoComplete="current-password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu mới"
                  autoComplete="new-password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Xác nhận mật khẩu mới"
                  autoComplete="new-password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePasswordUpdate}
                disabled={isLoading}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
              </button>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setFormData({
                    ...formData,
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                  });
                }}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Thêm địa chỉ mới
              </h2>
              <button
                onClick={() => {
                  setIsAddAddressModalOpen(false);
                  setFormData({ ...formData, customAddress: "" });
                  setSelectedProvince(null);
                  setSelectedDistrict(null);
                  setSelectedWard(null);
                  setDistricts([]);
                  setWards([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành phố
                </label>
                <Select
                  options={provinces}
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  placeholder="Chọn tỉnh/thành"
                  className="w-full"
                  isDisabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quận/Huyện
                </label>
                <Select
                  options={districts}
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  placeholder="Chọn quận/huyện"
                  className="w-full"
                  isDisabled={isLoading || !selectedProvince}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường/Xã
                </label>
                <Select
                  options={wards}
                  value={selectedWard}
                  onChange={handleWardChange}
                  placeholder="Chọn phường/xã"
                  className="w-full"
                  isDisabled={isLoading || !selectedDistrict}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ cụ thể
                </label>
                <input
                  type="text"
                  name="customAddress"
                  value={formData.customAddress}
                  onChange={handleInputChange}
                  placeholder="Nhập số nhà, tên đường"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsAddAddressModalOpen(false);
                  setFormData({ ...formData, customAddress: "" });
                  setSelectedProvince(null);
                  setSelectedDistrict(null);
                  setSelectedWard(null);
                  setDistricts([]);
                  setWards([]);
                }}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleAddAddress}
                disabled={isLoading}
                className={`py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Đang lưu..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalPage;
