import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import ProductDetailService from "../../../../services/ProductDetailService";
import UploadFileService from "../../../../services/UploadFileService";
import PromotionService from "../../../../services/PromotionServices";
import Barcode from "react-barcode";

export default function ProductUpdateModal({
  modalVisible,
  currentProduct,
  onClose,
  onUpdate,
  collars,
  sleeves,
  colors,
  sizes,
  promotions
}) {
  const [quantity, setQuantity] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [collar, setCollar] = useState(null);
  const [sleeve, setSleeve] = useState(null);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (currentProduct) {
      setQuantity(currentProduct.quantity || "");
      setImportPrice(currentProduct.importPrice || "");
      setSalePrice(currentProduct.salePrice || "");
      setDescription(currentProduct.description || "");
      setPhoto(currentProduct.photo || "");
      setCollar(currentProduct.collar ? { value: currentProduct.collar.id, label: currentProduct.collar.name } : null);
      setSleeve(currentProduct.sleeve ? { value: currentProduct.sleeve.id, label: currentProduct.sleeve.sleeveName } : null);
      setColor(currentProduct.color ? { value: currentProduct.color.id, label: currentProduct.color.name } : null);
      setSize(currentProduct.size ? { value: currentProduct.size.id, label: currentProduct.size.name } : null);
      setPromotion(currentProduct.promotion ? { value: currentProduct.promotion.id, label: currentProduct.promotion.promotionName } : null);
    }
  }, [currentProduct]);

  const handleUpdateSubmit = async () => {
    const productData = {
      productId: currentProduct.product.id,
      collarId: collar?.value,
      sleeveId: sleeve?.value,
      colorId: color?.value,
      sizeId: size?.value,
      promotionId: promotion?.value,
      quantity: Number(quantity),
      importPrice: Number(importPrice),
      salePrice: Number(salePrice),
      description: description,
      photo: selectedImage || photo,
    };

    try {
      const result = await ProductDetailService.updateProductDetail(currentProduct.id, productData);
      onUpdate(result);
      toast.success("Cập nhật sản phẩm thành công!");
      setPreviewImage("");
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  if (!modalVisible) return null;

  const handleImageUpload = async (file) => {
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ định dạng JPEG, PNG!");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    fileReader.readAsDataURL(file);

    try {
      const uploadedImageUrl = await UploadFileService.uploadProductImage(file);

      setPreviewImage(uploadedImageUrl);
      setSelectedImage(uploadedImageUrl);
    } catch (error) {
      console.error("Lỗi tải ảnh lên Firebase:", error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    setQuantity("");
    setImportPrice("");
    setSalePrice("");
    setDescription("");
    setPhoto("");
    setCollar(null);
    setSleeve(null);
    setColor(null);
    setSize(null);
    setPromotion(null);
    setSelectedImage(null);
    setPreviewImage("");

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật chi tiết sản phẩm</h2>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Main grid container with responsive columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product information section - takes 2/3 on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin sản phẩm</h2>

              {/* Form fields in responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cổ áo</label>
                  <Select
                    value={collar}
                    onChange={(option) => setCollar(option)}
                    options={collars.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                    className="w-full"
                    classNamePrefix="select"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tay áo</label>
                  <Select
                    value={sleeve}
                    onChange={(option) => setSleeve(option)}
                    options={sleeves.map(item => ({
                      value: item.id,
                      label: item.sleeveName
                    }))}
                    className="w-full"
                    classNamePrefix="select"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                  <Select
                    value={color}
                    onChange={(option) => setColor(option)}
                    options={colors.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                    className="w-full"
                    classNamePrefix="select"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                  <Select
                    value={size}
                    onChange={(option) => setSize(option)}
                    options={sizes.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                    className="w-full"
                    classNamePrefix="select"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khuyến mãi</label>
                  <Select
                    value={promotion}
                    onChange={(option) => setPromotion(option)}
                    options={promotions.map(promotion => ({
                    value: promotion.id,
                    label: `${promotion.promotionName} - ${promotion.promotionPercent}% (${new Date(promotion.startDate).toLocaleDateString("vi-VN")} - ${new Date(promotion.endDate).toLocaleDateString("vi-VN")})`
                  }))}
                    className="w-full"
                    classNamePrefix="select"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhập</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={importPrice}
                      onChange={(e) => setImportPrice(e.target.value)}
                      className="border border-gray-300 rounded-lg pl-4 pr-10 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      min="0"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">VND</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="border border-gray-300 rounded-lg pl-4 pr-10 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      min="0"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">VND</span>
                  </div>
                </div>
              </div>

              {/* Description field - spans full width */}
              <div className="form-group mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Image and barcode section - takes 1/3 on large screens */}
            <div className="lg:col-span-1 space-y-6">
              {/* Image upload section */}
              <div className="bg-white rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Hình ảnh</h3>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-100 transition-colors duration-200 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {previewImage || photo ? (
                    <div className="relative">
                      <img
                        src={previewImage || photo}
                        className="h-48 w-full object-contain rounded-lg"
                        onError={() => previewImage ? setPreviewImage(null) : setPhoto(null)}
                        alt="Product Image"
                      />
                      <button
                        onClick={() => { setPreviewImage(null); setPhoto(null); }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 text-center">Thả hình ảnh vào đây hoặc <span className="text-blue-500 font-medium">chọn ảnh</span></p>
                      <p className="text-gray-400 text-sm mt-1">Hỗ trợ: jpeg, png</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Barcode section */}
              <div className="bg-white rounded-lg pt-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mã vạch sản phẩm</h3>
                <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {currentProduct?.productDetailCode ? (
                    <div className="w-full flex justify-center">
                      <Barcode value={currentProduct.productDetailCode} />
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <p>Mã sản phẩm sẽ hiển thị ở đây</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* Nút hành động */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleClose} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200">Hủy</button>
          <button onClick={handleUpdateSubmit} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">Cập nhật</button>
        </div>
      </div>
    </div>
  );
}