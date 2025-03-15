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

  const validateVoucher = () => {
    if (!voucher.voucherCode.trim()) {
      toast.error("Mã voucher không được để trống");
      return false;
    }
    if (!voucher.voucherName.trim()) {
      toast.error("Tên voucher không được để trống");
      return false;
    }
    if (
      isNaN(Number(voucher.minCondition)) ||
      Number(voucher.minCondition) < 0
    ) {
      toast.error("Điều kiện tối thiểu phải là số không âm");
      return false;
    }
    if (isNaN(Number(voucher.maxDiscount)) || Number(voucher.maxDiscount) < 0) {
      toast.error("Mức giảm tối đa phải là số không âm");
      return false;
    }
    if (
      isNaN(Number(voucher.reducedPercent)) ||
      Number(voucher.reducedPercent) < 0 ||
      Number(voucher.reducedPercent) > 100
    ) {
      toast.error("Phần trăm giảm giá phải từ 0 đến 100");
      return false;
    }
    if (!voucher.startDate || !voucher.endDate) {
      toast.error("Ngày bắt đầu và ngày kết thúc không được để trống");
      return false;
    }
    if (new Date(voucher.startDate) >= new Date(voucher.endDate)) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc");
      return false;
    }
    return true;
  };

  const handleCreateVoucher = async () => {
    if (!validateVoucher()) return;
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
      if (onConfirm) onConfirm();
      if (onCancel) onCancel();
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
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Thêm Voucher Mới
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          "voucherCode",
          "voucherName",
          "description",
          "minCondition",
          "maxDiscount",
          "reducedPercent",
        ].map((name) => (
          <div key={name}>
            <label className="font-semibold">
              {name === "voucherCode"
                ? "Mã voucher"
                : name === "voucherName"
                  ? "Tên voucher"
                  : name === "description"
                    ? "Mô tả"
                    : name === "minCondition"
                      ? "Điều kiện tối thiểu Hóa Đơn"
                      : name === "maxDiscount"
                        ? "Mức giảm được giảm tối đa"
                        : "Phần trăm giảm giá"}
              :
            </label>
            <input
              type="text"
              name={name}
              value={voucher[name]}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full bg-white"
            />
          </div>
        ))}
        {["startDate", "endDate"].map((name) => (
          <div key={name}>
            <label className="font-semibold">
              {name === "startDate" ? "Ngày bắt đầu" : "Ngày kết thúc"}:
            </label>
            <input
              type="datetime-local"
              name={name}
              value={voucher[name]}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full bg-white"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
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
