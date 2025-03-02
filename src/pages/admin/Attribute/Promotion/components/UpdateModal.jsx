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

  // Cập nhật state khi mở modal
  useEffect(() => {
    if (selectedPromotion) {
      setPromotion({
        promotionName: selectedPromotion.promotionName || "",
        promotionPercent: selectedPromotion.promotionPercent || "",
        description: selectedPromotion.description || "",
        startDate: selectedPromotion.startDate
          ? selectedPromotion.startDate.split("T")[0]
          : "",
        endDate: selectedPromotion.endDate
          ? selectedPromotion.endDate.split("T")[0]
          : "",
        status: selectedPromotion.status || false,
      });
    }
  }, [selectedPromotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !promotion.promotionName ||
      !promotion.promotionPercent ||
      !promotion.startDate ||
      !promotion.endDate
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (new Date(promotion.startDate) > new Date(promotion.endDate)) {
      toast.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
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
      toast.success("Cập nhật khuyến mãi thành công!");

      fetchPromotions();
      setUpdateModal(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật khuyến mãi!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setUpdateModal(false)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={promotion.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={promotion.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={promotion.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={promotion.status}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm">Kích hoạt khuyến mãi</label>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setUpdateModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateModal;
