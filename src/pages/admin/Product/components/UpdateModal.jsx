import React from "react";

const UpdateModal = ({ isVisible, onConfirm, onCancel, updatedProduct, setUpdatedProduct }) => {

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-96">
                <h2 className="text-xl mb-4">Cập nhật sản phẩm</h2>
                <div className="mb-4">
                    <label className="block mb-2">Thương hiệu</label>
                    <input
                        type="number"
                        className="border rounded-lg px-4 py-2 w-full"
                        value={updatedProduct.brandId}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, brandId: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Danh mục</label>
                    <input
                        type="number"
                        className="border rounded-lg px-4 py-2 w-full"
                        value={updatedProduct.categoryId}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, categoryId: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Chất liệu</label>
                    <input
                        type="number"
                        className="border rounded-lg px-4 py-2 w-full"
                        value={updatedProduct.materialId}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, materialId: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Tên sản phẩm</label>
                    <input
                        type="number"
                        className="border rounded-lg px-4 py-2 w-full"
                        value={updatedProduct.productNameId}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, productNameId: e.target.value })}
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        onClick={() => onConfirm(updatedProduct)}
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;