import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import CollarService from "../../../../../services/CollarService";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchCollars }) {
    const [name, setCollarName] = useState("");

    const handleCreateCollar = async () => {
        if (!name.trim()) {
            toast.error("Tên Collar không được để trống!");
            return;
        }

        try {
            await CollarService.createCollar({ name });
            toast.success("Thêm Collar thành công!");
            fetchCollars(); // Load lại danh sách collar
            onConfirm(); // Đóng modal
            setCollarName(""); // Reset input
        } catch (error) {
            console.error("Lỗi khi tạo Collar:", error);
            toast.error("Không thể thêm Collar. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Thêm Collar"
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-semibold mb-4">Thêm Collar mới</h2>

            <input
                type="text"
                placeholder="Nhập tên Collar"
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setCollarName(e.target.value)}
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
                    onClick={handleCreateCollar}
                >
                    Thêm mới
                </button>
            </div>
        </Modal>
    );
}
