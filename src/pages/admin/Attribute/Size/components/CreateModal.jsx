import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import SizeService from "../../../../../services/SizeService";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchSizes }) {
    const [name, setSizeName] = useState("");

    const handleCreateSize = async () => {
        if (!name.trim()) {
            toast.error("Tên Size không được để trống!");
            return;
        }

        try {
            await SizeService.createSize({ name });
            toast.success("Thêm Size thành công!");
            fetchSizes(); // Load lại danh sách size
            onConfirm(); // Đóng modal
            setSizeName(""); // Reset input
        } catch (error) {
            console.error("Lỗi khi tạo Size:", error);
            toast.error("Không thể thêm Size. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Thêm Size"
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-semibold mb-4">Thêm Size mới</h2>

            <input
                type="text"
                placeholder="Nhập tên Size"
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setSizeName(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                    onClick={onCancel}
                >
                    Hủy
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleCreateSize}
                >
                    Thêm mới
                </button>
            </div>
        </Modal>
    );
}
