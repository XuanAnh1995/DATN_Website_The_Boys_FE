import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import  SizeService from "../../../../../services/SizeService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, size, fetchSizes }) => {
    const [name, setSizeName] = useState("");

    useEffect(() => {
        if (size) {
            setSizeName(size.name);
        }
    }, [size]);

    const handleUpdate = async () => {
        if (!name.trim()) {
            toast.error("Tên Size không được để trống!");
            return;
        }
        try {
            await SizeService.updateSize(size.id, { name });
            toast.success("Cập nhật Size thành công!");
            fetchSizes();
            setUpdateModal(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật Size:", error);
            toast.error("Không thể cập nhật Size. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setUpdateModal(false)}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-bold mb-4">Cập nhật Size</h2>
            <input
                type="text"
                className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setSizeName(e.target.value)}
                placeholder="Nhập tên Size"
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
