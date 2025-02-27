import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import BrandService from "../../../../services/BrandService";
import { toast } from "react-toastify";

const UpdateModal = ({ isOpen, setUpdateModal, brand, fetchBrands }) => {
    const [brandName, setBrandName] = useState("");

    useEffect(() => {
        if (brand) {
            setBrandName(brand.brandName);
        }
    }, [brand]);

    const handleUpdate = async () => {
        if (!brandName.trim()) {
            toast.error("Tên thương hiệu không được để trống!");
            return;
        }
        try {
            await BrandService.updateBrand(brand.id, { brandName });
            toast.success("Cập nhật thương hiệu thành công!");
            fetchBrands();
            setUpdateModal(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thương hiệu:", error);
            toast.error("Không thể cập nhật thương hiệu. Vui lòng thử lại!");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setUpdateModal(false)}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-lg font-bold mb-4">Cập nhật thương hiệu</h2>
            <input
                type="text"
                className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Nhập tên thương hiệu"
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
