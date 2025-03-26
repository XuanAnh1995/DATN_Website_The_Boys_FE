import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import PromotionService from "../../../../../services/PromotionServices";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onCancel, fetchPromotions }) {
  const [promotion, setPromotion] = useState({
    promotionName: "",
    promotionPercent: "",
    description: "",
    startDate: "",
    endDate: "",
    status: true,
  });
  const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Xóa lỗi của trường khi người dùng bắt đầu nhập
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate tên khuyến mãi
    if (!promotion.promotionName.trim()) {
      newErrors.promotionName = "Tên khuyến mãi không được để trống!";
    } else if (promotion.promotionName.length > 100) {
      newErrors.promotionName = "Tên khuyến mãi không được vượt quá 100 ký tự!";
    }

    // Validate phần trăm giảm giá
    if (!promotion.promotionPercent) {
      newErrors.promotionPercent = "Phần trăm giảm giá không được để trống!";
    } else {
      const percent = Number(promotion.promotionPercent);
      if (isNaN(percent) || percent < 1 || percent > 100) {
        newErrors.promotionPercent = "Phần trăm giảm giá phải từ 1 đến 100!";
      }
    }

    // Validate mô tả (không bắt buộc, nhưng nếu có thì kiểm tra độ dài)
    if (promotion.description && promotion.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự!";
    }

    // Validate ngày bắt đầu
    if (!promotion.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống!";
    }

    // Validate ngày kết thúc
    if (!promotion.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    }

    // Validate ngày bắt đầu và ngày kết thúc
    if (promotion.startDate && promotion.endDate) {
      const start = new Date(promotion.startDate);
      const end = new Date(promotion.endDate);
      const today = new Date().setHours(0, 0, 0, 0);
      if (start > end) {
        newErrors.endDate =
          "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!";
      }
      if (start < today) {
        newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleCreatePromotion = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const formattedPromotion = {
        ...promotion,
        promotionPercent: parseInt(promotion.promotionPercent),
        startDate: new Date(promotion.startDate).toISOString(),
        endDate: new Date(promotion.endDate).toISOString(),
      };

      console.log("Data sent to API:", formattedPromotion);
      await PromotionService.createPromotion(formattedPromotion);
      toast.success("Thêm khuyến mãi thành công!");

      // Reset form và đóng modal
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
      console.error(error);
      toast.error("Lỗi khi tạo khuyến mãi!");
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
            min="1"
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
            Ngày bắt đầu
          </label>
          <input
            type="date"
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
            Ngày kết thúc
          </label>
          <input
            type="date"
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
        <div className="flex items-center">
          <input
            type="checkbox"
            name="status"
            checked={promotion.status}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Kích hoạt khuyến mãi
          </label>
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
