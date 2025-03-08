import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import PromotionService from "../../../../../services/PromotionServices";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onCancel, fetchPromotions }) {
  const [promotion, setPromotion] = useState({
    promotionName: "",
    promotionPercent: "", // 🔹 Thêm mới
    description: "",
    startDate: "",
    endDate: "",
    status: true, // 🔹 Đổi tên từ isActive → status
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreatePromotion = async () => {
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
      const formattedPromotion = {
        ...promotion,
        promotionPercent: parseInt(promotion.promotionPercent), // 🔹 Chuyển về số
        startDate: new Date(promotion.startDate).toISOString(), // 🔹 Chuyển về Instant
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
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Thêm khuyến mãi</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Tên khuyến mãi</label>
          <input
            type="text"
            name="promotionName"
            className="border p-2 rounded w-full"
            value={promotion.promotionName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Phần trăm giảm giá (%)
          </label>
          <input
            type="number"
            name="promotionPercent"
            className="border p-2 rounded w-full"
            value={promotion.promotionPercent}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mô tả</label>
          <textarea
            name="description"
            className="border p-2 rounded w-full"
            value={promotion.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            className="border p-2 rounded w-full"
            value={promotion.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ngày kết thúc</label>
          <input
            type="date"
            name="endDate"
            className="border p-2 rounded w-full"
            value={promotion.endDate}
            onChange={handleChange}
          />
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
      </div>

      <div className="flex justify-end mt-4 space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Hủy
        </button>
        <button
          onClick={handleCreatePromotion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm mới
        </button>
      </div>
    </Modal>
  );
}
