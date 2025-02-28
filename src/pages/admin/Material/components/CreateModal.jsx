import React, { useState } from "react";
import Modal from "react-modal";
import MaterialService from "../../../../services/MaterialService";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function CreateModal({ isOpen, onConfirm, onCancel, fetchMaterials }) {
    const [materialName, setMaterialName] = useState("");

    const handleCreateMaterial = async () => {
        if (!materialName.trim()) {
            toast.error("Tên chất liệu không được để trống!");
            return;
        }

        try {
            await MaterialService.createMaterial({ materialName });
            toast.success("Thêm chất liệu thành công!");
            fetchMaterials();
            onConfirm(); // Đóng modal
            setMaterialName(""); // Reset input
        } catch (error) {
            toast.error("Thêm thất bại!");
        }
    };

    return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onCancel}
                contentLabel="Thêm chất liệu"
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-lg font-semibold mb-4">Thêm chất liệu mới</h2>
    
                <input
                    type="text"
                    placeholder="Nhập tên chất liệu"
                    className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
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
                        onClick={handleCreateMaterial}
                    >
                        Thêm mới
                    </button>
                </div>
            </Modal>
        );
    }
    
    
