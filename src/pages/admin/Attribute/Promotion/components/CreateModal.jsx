import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import PromotionService from "../../../../../services/PromotionServices";

Modal.setAppElement("#root");

const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function CreateModal({ isOpen, onCancel, fetchPromotions }) {
  const [promotion, setPromotion] = useState({
    promotionName: "",
    promotionPercent: "",
    description: "",
    startDate: "",
    endDate: "",
    status: true, // Sửa từ 1 thành true
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!promotion.promotionName.trim()) {
      newErrors.promotionName = "Tên khuyến mãi không được để trống!";
    } else if (promotion.promotionName.length > 255) {
      newErrors.promotionName = "Tên khuyến mãi không được vượt quá 255 ký tự!";
    }

    if (!promotion.promotionPercent) {
      newErrors.promotionPercent = "Phần trăm giảm giá không được để trống!";
    } else {
      const percent = Number(promotion.promotionPercent);
      if (isNaN(percent) || percent < 0 || percent > 100) {
        newErrors.promotionPercent = "Phần trăm giảm giá phải từ 0 đến 100!";
      }
    }

    if (!promotion.description.trim()) {
      newErrors.description = "Mô tả không được để trống!";
    } else if (promotion.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự!";
    }

    if (!promotion.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống!";
    } else if (isNaN(new Date(promotion.startDate).getTime())) {
      newErrors.startDate = "Ngày và giờ bắt đầu không hợp lệ!";
    }

    if (!promotion.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    } else if (isNaN(new Date(promotion.endDate).getTime())) {
      newErrors.endDate = "Ngày và giờ kết thúc không hợp lệ!";
    } else if (promotion.startDate && promotion.endDate) {
      const start = new Date(promotion.startDate);
      const end = new Date(promotion.endDate);
      if (end <= start) {
        newErrors.endDate = "Ngày và giờ kết thúc phải sau ngày bắt đầu!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePromotion = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const formattedPromotion = {
        promotionName: promotion.promotionName,
        promotionPercent: parseInt(promotion.promotionPercent),
        description: promotion.description,
        startDate: formatDateTime(new Date(promotion.startDate)),
        endDate: formatDateTime(new Date(promotion.endDate)),
        status: promotion.status,
      };

      console.log("Dữ liệu gửi API:", formattedPromotion);
      await PromotionService.createPromotion(formattedPromotion);
      toast.success("Thêm khuyến mãi thành công!");
      setPromotion({
        promotionName: "",
        promotionPercent: "",
        description: "",
        startDate: "",
        endDate: "",
        status: true,
      });
      setErrors({});
      fetchPromotions();
      onCancel();
    } catch (error) {
      console.error("Error creating promotion:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi không xác định từ server!";
      toast.error(`Lỗi khi tạo khuyến mãi: ${errorMessage}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Thêm khuyến mãi"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 border border-gray-200"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Thêm khuyến mãi
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên khuyến mãi
          </label>
          <input
            type="text"
            name="promotionName"
            className={`border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.promotionName ? "border-red-500" : "border-gray-300"
            }`}
            value={promotion.promotionName}
            onChange={handleChange}
          />
          {errors.promotionName && (
            <p className="text-red-500 text-xs mt-1">{errors.promotionName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phần trăm giảm giá (%)
          </label>
          <input
            type="number"
            name="promotionPercent"
            className={`border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.promotionPercent ? "border-red-500" : "border-gray-300"
            }`}
            value={promotion.promotionPercent}
            onChange={handleChange}
            min="0"
            max="100"
          />
          {errors.promotionPercent && (
            <p className="text-red-500 text-xs mt-1">
              {errors.promotionPercent}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            className={`border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            value={promotion.description}
            onChange={handleChange}
            rows="3"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày và giờ bắt đầu
          </label>
          <input
            type="datetime-local"
            name="startDate"
            className={`border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            }`}
            value={promotion.startDate}
            onChange={handleChange}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày và giờ kết thúc
          </label>
          <input
            type="datetime-local"
            name="endDate"
            className={`border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            }`}
            value={promotion.endDate}
            onChange={handleChange}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            name="status"
            value={promotion.status}
            onChange={(e) =>
              setPromotion((prev) => ({
                ...prev,
                status: e.target.value === "true",
              }))
            }
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          >
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-150"
        >
          Hủy
        </button>
        <button
          onClick={handleCreatePromotion}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150"
        >
          Thêm mới
        </button>
      </div>
    </Modal>
  );
}
