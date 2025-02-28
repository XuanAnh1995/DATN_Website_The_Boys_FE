import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ColorService from "../../../../../services/ColorService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, color, fetchColors }) => {
    const [name, setColorName] = useState("");

    useEffect(() => {
        if (color) {
            setColorName(color.name);
        }
    }, [color]);

    const handleUpdate = async () => {
        if (!name.trim()) {
            toast.error("Tên Color không được để trống!");
            return;
        }
        try {
            await ColorService.updateColor(color.id, { name });
            toast.success("Cập nhật Color thành công!");
            fetchColors();
            setUpdateModal(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật Color:", error);
            toast.error("Không thể cập nhật Color. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setUpdateModal(false)}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-bold mb-4">Cập nhật Color</h2>
            <input
                type="text"
                className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Nhập tên Color"
            />
            <div className="flex justify-end gap-2">
                <button
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    onClick={() => setUpdateModal(false)}
                >
                    Hủy
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleUpdate}
                >
                    Cập nhật
                </button>
            </div>
        </Modal>
    );
};

export default UpdateModal;
