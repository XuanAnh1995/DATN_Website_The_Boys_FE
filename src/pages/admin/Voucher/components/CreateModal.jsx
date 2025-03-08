import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import VoucherService from "../../../../services/VoucherServices";

Modal.setAppElement("#root");

export default function CreateModal({
  isOpen,
  onConfirm,
  onCancel,
  fetchVouchers,
}) {
  const [voucher, setVoucher] = useState({
    voucherCode: "",
    voucherName: "",
    description: "",
    minCondition: "",
    maxDiscount: "",
    reducedPercent: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateVoucher = async () => {
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
      fetchVouchers();
      setVoucher({
        voucherCode: "",
        voucherName: "",
        description: "",
        minCondition: "",
        maxDiscount: "",
        reducedPercent: "",
        startDate: "",
        endDate: "",
        isActive: true,
      });
      onConfirm();
      onCancel();
    } catch (error) {
      toast.error("Không thể thêm voucher. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Thêm voucher"
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 border border-gray-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Thêm Voucher Mới
      </h2>
      <div className="space-y-3">
        {[
          { label: "Mã Voucher", name: "voucherCode" },
          { label: "Tên Voucher", name: "voucherName" },
          { label: "Mô tả", name: "description" },
          { label: "Điều kiện tối thiểu", name: "minCondition" },
          { label: "Giảm tối đa", name: "maxDiscount" },
          { label: "Phần trăm giảm", name: "reducedPercent" },
        ].map((field) => (
          <div key={field.name}>
            <label className="font-semibold">{field.label}:</label>
            <input
              type="text"
              name={field.name}
              value={voucher[field.name]}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full"
            />
          </div>
        ))}
        <div>
          <label className="font-semibold">Ngày bắt đầu:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={voucher.startDate}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="font-semibold">Ngày kết thúc:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={voucher.endDate}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="font-semibold">Trạng thái:</label>
          <div>
            <input
              type="checkbox"
              name="isActive"
              checked={voucher.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Hoạt động</span>
          </div>
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
          onClick={handleCreateVoucher}
        >
          Thêm mới
        </button>
      </div>
    </Modal>
  );
}
