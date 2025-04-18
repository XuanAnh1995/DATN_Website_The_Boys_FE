import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import PromotionService from "../../../../../services/PromotionServices";

const UpdateModal = ({
  isOpen,
  setUpdateModal,
  fetchPromotions,
  selectedPromotion,
}) => {
  const [promotion, setPromotion] = useState({
    promotionName: "",
    promotionPercent: "",
    description: "",
    startDate: "",
    endDate: "",
    status: false,
  });
  const [errors, setErrors] = useState({}); // State để lưu thông báo lỗi

  // Khi mở modal, cập nhật dữ liệu từ API
  useEffect(() => {
    if (selectedPromotion) {
      console.log("Dữ liệu API nhận được:", selectedPromotion); // Debug dữ liệu
      setPromotion({
        promotionName: selectedPromotion.promotionName || "",
        promotionPercent: selectedPromotion.promotionPercent || "",
        description: selectedPromotion.description || "",
        startDate: selectedPromotion.startDate
          ? new Date(selectedPromotion.startDate).toISOString().slice(0, 16)
          : "",
        endDate: selectedPromotion.endDate
          ? new Date(selectedPromotion.endDate).toISOString().slice(0, 16)
          : "",
        status: selectedPromotion.status || false,
      });
      setErrors({}); // Reset lỗi khi mở modal
    }
  }, [selectedPromotion]);

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

    // Validate mô tả
    if (promotion.description && promotion.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự!";
    }

    // Validate ngày bắt đầu
    if (!promotion.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống!";
    } else {
      const start = new Date(promotion.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại!";
      }
    }

    // Validate ngày kết thúc
    if (!promotion.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    } else if (promotion.startDate) {
      const start = new Date(promotion.startDate);
      const end = new Date(promotion.endDate);
      if (end < start) {
        newErrors.endDate =
          "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const updatedPromotion = {
        ...selectedPromotion,
        promotionName: promotion.promotionName,
        promotionPercent: parseInt(promotion.promotionPercent),
        description: promotion.description,
        startDate: new Date(promotion.startDate).toISOString(),
        endDate: new Date(promotion.endDate).toISOString(),
        status: promotion.status,
      };

      await PromotionService.updatePromotion(
        selectedPromotion.id,
        updatedPromotion
      );
      toast.success("Cập nhật discouraged mãi thành công!");
      fetchPromotions();
      setUpdateModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật khuyến mãi!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setUpdateModal(false)}
      contentLabel="Cập nhật khuyến mãi"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 border border-gray-200"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Cập Nhật Khuyến Mãi
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên Khuyến Mãi
          </label>
          <input
            type="text"
            name="promotionName"
            value={promotion.promotionName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.promotionName ? "border-red-500" : "border-gray-300"
            }`}
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
            value={promotion.promotionPercent}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.promotionPercent ? "border-red-500" : "border-gray-300"
            }`}
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
            value={promotion.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            rows="3"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={promotion.startDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
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
              type="datetime-local"
              name="endDate"
              value={promotion.endDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
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
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setUpdateModal(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-150"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Cập Nhật
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateModal;
