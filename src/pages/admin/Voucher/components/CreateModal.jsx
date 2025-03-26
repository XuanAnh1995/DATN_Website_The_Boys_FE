import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import VoucherService from "../../../../services/VoucherServices";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onCancel, fetchVouchers }) {
  const [voucher, setVoucher] = useState({
    voucherCode: "Tự sinh",
    voucherName: "",
    description: "",
    minCondition: "",
    maxDiscount: "",
    reducedPercent: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Xóa lỗi khi người dùng nhập
  };

  const validateVoucher = () => {
    const newErrors = {};

    // Validate voucherName
    if (!voucher.voucherName.trim()) {
      newErrors.voucherName = "Tên voucher không được để trống!";
    } else if (voucher.voucherName.length > 100) {
      newErrors.voucherName = "Tên voucher không được vượt quá 100 ký tự!";
    }

    // Validate minCondition
    if (voucher.minCondition === "") {
      newErrors.minCondition = "Điều kiện tối thiểu không được để trống!";
    } else {
      const minCondition = Number(voucher.minCondition);
      if (isNaN(minCondition) || minCondition < 0) {
        newErrors.minCondition = "Điều kiện tối thiểu phải là số không âm!";
      }
    }

    // Validate maxDiscount
    if (voucher.maxDiscount === "") {
      newErrors.maxDiscount = "Mức giảm tối đa không được để trống!";
    } else {
      const maxDiscount = Number(voucher.maxDiscount);
      if (isNaN(maxDiscount) || maxDiscount < 0) {
        newErrors.maxDiscount = "Mức giảm tối đa phải là số không âm!";
      }
    }

    // Validate reducedPercent
    if (voucher.reducedPercent === "") {
      newErrors.reducedPercent = "Phần trăm giảm giá không được để trống!";
    } else {
      const reducedPercent = Number(voucher.reducedPercent);
      if (isNaN(reducedPercent) || reducedPercent < 0 || reducedPercent > 100) {
        newErrors.reducedPercent = "Phần trăm giảm giá phải từ 0 đến 100!";
      }
    }

    // Validate description (nếu có)
    if (voucher.description && voucher.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự!";
    }

    // Validate startDate
    if (!voucher.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống!";
    } else {
      const start = new Date(voucher.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại!";
      }
    }

    // Validate endDate
    if (!voucher.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    } else if (voucher.startDate) {
      const start = new Date(voucher.startDate);
      const end = new Date(voucher.endDate);
      if (end <= start) {
        newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateVoucher = async () => {
    if (!validateVoucher()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const formattedVoucher = {
        ...voucher,
        minCondition: Number(voucher.minCondition) || 0,
        maxDiscount: Number(voucher.maxDiscount) || 0,
        reducedPercent: Number(voucher.reducedPercent) || 0,
        startDate: new Date(voucher.startDate).toISOString(),
        endDate: new Date(voucher.endDate).toISOString(),
        status: voucher.isActive,
      };

      console.log("Dữ liệu gửi lên API:", formattedVoucher);
      await VoucherService.createVoucher(formattedVoucher);
      toast.success("Thêm voucher thành công!");
      setVoucher({
        voucherCode: "Tự sinh",
        voucherName: "",
        description: "",
        minCondition: "",
        maxDiscount: "",
        reducedPercent: "",
        startDate: "",
        endDate: "",
        isActive: true,
      });
      setErrors({});
      fetchVouchers();
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm voucher. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Thêm voucher"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 border border-gray-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
        Thêm Voucher Mới
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "voucherCode", label: "Mã voucher" },
          { name: "voucherName", label: "Tên voucher" },
          { name: "description", label: "Mô tả" },
          {
            name: "minCondition",
            label: "Điều kiện tối thiểu Hóa Đơn",
            type: "number",
          },
          { name: "maxDiscount", label: "Mức giảm tối đa", type: "number" },
          {
            name: "reducedPercent",
            label: "Phần trăm giảm giá",
            type: "number",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}:
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={voucher[field.name]}
              onChange={handleChange}
              className={`border rounded-lg px-4 py-2 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
        {[
          { name: "startDate", label: "Ngày bắt đầu" },
          { name: "endDate", label: "Ngày kết thúc" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}:
            </label>
            <input
              type="datetime-local"
              name={field.name}
              value={voucher[field.name]}
              onChange={handleChange}
              className={`border rounded-lg px-4 py-2 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={voucher.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-700">Hoạt động</label>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-150"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150"
          onClick={handleCreateVoucher}
        >
          Thêm mới
        </button>
      </div>
    </Modal>
  );
}
