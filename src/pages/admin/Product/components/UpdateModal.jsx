import React, { useEffect, useState } from "react";
import Select from 'react-select';
import BrandService from "../../../../services/BrandService";
import CategoryService from "../../../../services/CategoryService";
import MaterialService from "../../../../services/MaterialService";

const UpdateModal = ({ isVisible, onConfirm, onCancel, updatedProduct, setUpdatedProduct }) => {
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [materialOptions, setMaterialOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const brands = await BrandService.getAllBrands();
                setBrandOptions(brands.content.map(brand => ({ value: brand.id, label: brand.brandName })));

                const categories = await CategoryService.getAll();
                setCategoryOptions(categories.content.map(category => ({ value: category.id, label: category.name })));

                const materials = await MaterialService.getAllMaterials();
                setMaterialOptions(materials.content.map(material => ({ value: material.id, label: material.materialName })));
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchOptions();
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-96">
                <h2 className="text-xl mb-4">Cập nhật sản phẩm</h2>
                <div className="mb-4">
                    <label className="block mb-2">Tên sản phẩm</label>
                    <input
                        type="text"
                        className="border rounded-lg px-4 py-2 w-full"
                        value={updatedProduct.productName}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, productName: e.target.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Thương hiệu</label>
                    <Select
                        options={brandOptions}
                        value={brandOptions.find(option => option.value === updatedProduct.brandId)}
                        onChange={(selected) => setUpdatedProduct({ ...updatedProduct, brandId: selected.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Danh mục</label>
                    <Select
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === updatedProduct.categoryId)}
                        onChange={(selected) => setUpdatedProduct({ ...updatedProduct, categoryId: selected.value })}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Chất liệu</label>
                    <Select
                        options={materialOptions}
                        value={materialOptions.find(option => option.value === updatedProduct.materialId)}
                        onChange={(selected) => setUpdatedProduct({ ...updatedProduct, materialId: selected.value })}
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