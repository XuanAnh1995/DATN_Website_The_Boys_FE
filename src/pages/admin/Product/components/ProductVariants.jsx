import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaFileImage } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import { toast } from "react-toastify";
import ProductDetailService from "../../../../services/ProductDetailService";
import UploadFileService from "../../../../services/UploadFileService";
import { useNavigate } from "react-router-dom";

export default function ProductVariants({ generateData }) {
  const navigate = useNavigate();
  const [variantsList, setVariantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (event) => {
    event.stopPropagation(); 
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmSave = () => {
    handleSave();
    handleCloseModal();
  };

  const generateProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ProductDetailService.generateProductDetails(generateData);

      console.log(response)

      if (response) {
        const productDetails = response?.map((item) => ({
          colorId: item?.maMauSac,
          colorName: item?.tenMauSac,
          productName: item?.tenSanPham,
          variants: item?.sanPhamChiTiet
        }));

        console.log(response)
        setVariantsList(productDetails);
      } else {
        setError("Không có dữ liệu chi tiết sản phẩm.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tạo chi tiết sản phẩm.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [generateData]);

  useEffect(() => {
    if (generateData && Object.keys(generateData).length > 0) {
      generateProductDetails();
    }
  }, [generateData, generateProductDetails]);

  const handleInputChange = (colorIndex, variantIndex, field, value) => {
    const updatedVariantsList = [...variantsList];

    if (updatedVariantsList[colorIndex]?.variants) {
      updatedVariantsList[colorIndex].variants = updatedVariantsList[colorIndex].variants.map(
        (variant, index) => {
          if (index === variantIndex) {
            return { ...variant, [field]: value };
          }
          return variant;
        }
      );
      setVariantsList(updatedVariantsList);
    }
  };


  const handleRemoveVariant = (colorIndex, variantIndex) => {
    const updatedVariantsList = [...variantsList];
    updatedVariantsList[colorIndex].variants.splice(variantIndex, 1);
    setVariantsList(updatedVariantsList);
  };


  const isVariantsListValid = () => {
    if (!variantsList || variantsList.length === 0) return false;

    return variantsList.every((variantData) =>
      variantData.variants.every(
        (variant) =>
          variant.soLuong > 0 &&
          variant.donGia > 0 &&
          variant.sanPham &&
          variant.kichThuoc &&
          variant.mauSac
      )
    );
  };

  const handleImageUpload = async (colorId, file) => {
    if (!file) return;

    try {
      const fileURL = URL.createObjectURL(file);
      setVariantsList((prevList) =>
        prevList.map((item) =>
          item.colorId === colorId
            ? { ...item, previewImage: fileURL }
            : item
        )
      );

      const uploadedImageUrl = await UploadFileService.uploadProductImage(file);

      setVariantsList((prevList) =>
        prevList.map((color) =>
          color.colorId === colorId
            ? {
              ...color,
              variants: color.variants.map((variant) => ({
                ...variant,
                hinhAnh: uploadedImageUrl,
              })),
            }
            : color
        )
      );
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
    }
  };



  const handleSave = () => {
    const productDetailData = [];

    variantsList.forEach((variantData) => {
      variantData.variants.forEach((variant) => {
        const newVariant = {
          sanPham: variant.sanPham, // ID sản phẩm
          thuongHieu: variant.thuongHieu, // ID thương hiệu
          xuatXu: variant.xuatXu, // ID xuất xứ
          chatLieu: variant.chatLieu, // ID chất liệu
          coAo: variant.coAo, // ID kiểu cổ áo
          tayAo: variant.tayAo, // ID kiểu tay áo
          mauSac: variant.mauSac, // Mã màu sắc
          kichThuoc: variant.kichThuoc, // ID kích thước
          soLuong: variant.soLuong, // Số lượng
          donGia: variant.donGia, // Giá
          hinhAnh: variant.hinhAnh || null, // Hình ảnh (nếu có, nếu không để null)
        };

        productDetailData.push(newVariant);
      });
    });

    ProductDetailService.createProductDetail(productDetailData)
      .then((response) => {
        console.log("Dữ liệu chi tiết sản phẩm đã được lưu", response);
        toast.success("Dữ liệu chi tiết sản phẩm đã được lưu thành công!");

        const maSanPham = response?.[0]?.sanPham.maSanPham;
        console.log(response)

        if (maSanPham) {
          navigate(`/admin/product/${maSanPham}`);
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lưu chi tiết sản phẩm", error);
        toast.error("Có lỗi xảy ra khi lưu chi tiết sản phẩm.");
      });
  };

  return (
    <div className="border-2 h-full rounded-xl flex flex-col ">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div>
        </div>
      ) : variantsList.length === 0 ? (
        <div className="col-span-3 h-full border rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-center">
          <AiFillWarning className="text-5xl text-orange-500" />
          <p className="text-gray-600 mt-4">Sản phẩm đã tồn tại, vui lòng chọn thuộc tính khác</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-6">
          {variantsList.map((variantData, idx) => (
            <div key={variantData.colorId} className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Chi tiết sản phẩm {variantData.productName} màu {variantData.colorName}
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      {["STT", "Sản phẩm", "Giá", "Số lượng", "Xóa"].map((header) => (
                        <th key={header} className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {variantData?.variants?.length > 0 ? (
                      variantData.variants.map((variant, index) => (
                        <tr key={`${variant.maMauSac}-${variant.tenKichThuoc}-${index}`} className="border-b hover:bg-blue-50 transition-colors">
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{`${variant.tenThuongHieu} ${variant.tenXuatXu} ${variant.tenChatLieu} ${variant.tenCoAo} ${variant.tenTayAo} size ${variant.tenKichThuoc}`}</td>
                          <td className="py-3 px-6">
                            <input
                              type="text"
                              value={variant.donGia}
                              onChange={(e) => handleInputChange(idx, index, "donGia", e.target.value)}
                              placeholder="Nhập giá"
                              className="border-2 border-blue-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-300"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="text"
                              value={variant.soLuong}
                              onChange={(e) => handleInputChange(idx, index, "soLuong", e.target.value)}
                              placeholder="Nhập số lượng"
                              className="border-2 border-blue-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleRemoveVariant(idx, index)} className="text-red-500 hover:text-red-700">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
                          Không có chi tiết sản phẩm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300 relative">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(variantData.colorId, e.target.files[0])}
                    className="hidden"
                  />
                  {variantData.previewImage ? (
                    <img
                      src={variantData.previewImage}
                      alt="Ảnh đã chọn"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <FaFileImage className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500">
                        Thả hình ảnh của bạn ở đây, hoặc <span className="text-blue-500">duyệt</span>
                      </p>
                      <p className="text-gray-400 text-sm">Hỗ trợ: jpeg, png</p>
                    </div>
                  )}
                </label>

              </div>


            </div>
          ))}
        </div>
      )}

      {isVariantsListValid() && (
        <div className="p-6 flex justify-end mt-auto">
          <button onClick={handleOpenModal} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Lưu chi tiết sản phẩm
          </button>
        </div>
      )}

{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-10 rounded-xl shadow-2xl w-[500px] max-w-lg text-center flex flex-col items-center">
      <AiFillWarning className="text-5xl text-orange-500 " />
      <h3 className="text-2xl mt-3 font-semibold text-gray-800">Thông báo</h3>
      <p className="text-gray-600 mt- text-lg">Vui lòng xác nhận trước khi lưu?</p>
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleCloseModal}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-400 transition-all"
        >
          Hủy
        </button>
        <button
          onClick={handleConfirmSave}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-all"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );

}
