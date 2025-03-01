import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import VoucherService from "../../../../services/VoucherServices";

Modal.setAppElement("#root");

export default function UpdateModal({
  isOpen,
  onCancel,
  fetchVouchers,
  selectedVoucher,
}) {
  const [voucher, setVoucher] = useState(selectedVoucher || {});

  useEffect(() => {
    setVoucher(selectedVoucher || {});
  }, [selectedVoucher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateVoucher = async () => {
    try {
      const updatedVoucher = {
        ...voucher,
        minCondition: Number(voucher.minCondition) || 0,
        maxDiscount: Number(voucher.maxDiscount) || 0,
        reducedPercent: Number(voucher.reducedPercent) || 0,
        startDate: new Date(voucher.startDate).toISOString(),
        endDate: new Date(voucher.endDate).toISOString(),
        status: voucher.status,
      };

      await VoucherService.updateVoucher(voucher.id, updatedVoucher);
      toast.success("Cập nhật voucher thành công!");
      fetchVouchers();
      onCancel();
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
      toast.error("Không thể cập nhật voucher. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Cập nhật voucher"
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 border border-gray-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Cập Nhật Voucher
      </h2>
      <div className="space-y-3">
        {[
          "voucherCode",
          "voucherName",
          "description",
          "minCondition",
          "maxDiscount",
          "reducedPercent",
        ].map((field) => (
          <div key={field}>
            <label className="font-semibold">{field}:</label>
            <input
              type="text"
              name={field}
              value={voucher[field] || ""}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
        ))}
        <div>
          <label className="font-semibold">Ngày bắt đầu:</label>
          <input
            type="date"
            name="startDate"
            value={voucher.startDate ? voucher.startDate.split("T")[0] : ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="font-semibold">Ngày kết thúc:</label>
          <input
            type="date"
            name="endDate"
            value={voucher.endDate ? voucher.endDate.split("T")[0] : ""}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleUpdateVoucher}
        >
          Cập nhật
        </button>
      </div>
    </Modal>
  );
}
