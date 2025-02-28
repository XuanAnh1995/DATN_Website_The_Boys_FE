import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import SleeveService from "../../../../../services/SleeveService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, sleeve, fetchSleeves }) => {
    const [sleeveName, setSleeveName] = useState("");

    useEffect(() => {
        if (sleeve) {
            setSleeveName(sleeve.sleeveName);
        }
    }, [sleeve]);

    const handleUpdate = async () => {
        if (!sleeveName.trim()) {
            toast.error("Tên Sleeve không được để trống!");
            return;
        }
        try {
            await SleeveService.updateSleeve(sleeve.id, { sleeveName });
            toast.success("Cập nhật Sleeve thành công!");
            fetchSleeves(); // Load lại danh sách sau cập nhật
            setUpdateModal(false); // Đóng modal sau khi cập nhật thành công
        } catch (error) {
            console.error("Lỗi khi cập nhật Sleeve:", error);
            toast.error("Không thể cập nhật Sleeve. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setUpdateModal(false)}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-bold mb-4">Cập nhật Sleeve</h2>
            <input
                type="text"
                className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sleeveName}
                onChange={(e) => setSleeveName(e.target.value)}
                placeholder="Nhập tên Sleeve"
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
