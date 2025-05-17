import React, { useState, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ProductVariants from "./components/ProductVariants";
import ProductService from "../../../services/ProductService";
import ProductDetailService from "../../../services/ProductDetailService";
import CollarService from "../../../services/CollarService";
import SleeveService from "../../../services/SleeveService";
import ColorService from "../../../services/ColorService";
import SizeService from "../../../services/SizeService";
import PromotionService from "../../../services/PromotionServices";

export default function CreateProduct() {
  const [products, setProducts] = useState([]);
  const [collars, setCollars] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const [generateData, setGenerateData] = useState({
    productId: null,
    sizeId: [],
    colorId: [],
    collarId: [],
    sleeveId: [],
    promotionId: null,
    importPrice: 0,
    salePrice: 0,
    quantity: 0,
    description: "",
  });

  useEffect(() => {
    fetchSelectOptions();
  }, []);

  useEffect(() => {
    if (
      collars.length > 0 ||
      sleeves.length > 0 ||
      colors.length > 0 ||
      sizes.length > 0
    ) {
      setGenerateData((prevData) => ({
        ...prevData,
        collar: collars.length > 0 ? [collars[0].id] : [],
        sleeve: sleeves.length > 0 ? [sleeves[0].id] : [],
        color: colors.length > 0 ? [colors[0].id] : [],
        size: sizes.length > 0 ? [sizes[0].id] : [],
      }));
    }
  }, [collars, sleeves, colors, sizes]);

  const fetchSelectOptions = async () => {
    try {
      const productData = await ProductService.getAllProducts(0, 1000);
      setProducts(productData.content);

      const collarData = await CollarService.getAllCollars();
      setCollars(collarData.content);

      const sizeData = await SizeService.getAllSizes();
      setSizes(sizeData.content);

      const colorData = await ColorService.getAllColors();
      setColors(colorData.content);

      const sleeveData = await SleeveService.getAllSleeves();
      setSleeves(sleeveData.content);

      const promotionData = await PromotionService.getAllPromotions();

      const today = new Date();

      // Lọc các khuyến mãi còn hiệu lực
      const validPromotions = promotionData.content.filter((promotion) => {
        const end = new Date(promotion.endDate);
        return promotion.status === true && end >= today;
      });


      setPromotions(validPromotions);

    } catch (error) {
      console.error("Error fetching select options:", error);
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    const newGenerateData = { ...generateData };

    if (selectedOption) {
      if (name === "product") {
        newGenerateData.productId = selectedOption.value;
      } else if (name === "collar") {
        newGenerateData.collarId = selectedOption.map((opt) => opt.value);
      } else if (name === "sleeve") {
        newGenerateData.sleeveId = selectedOption.map((opt) => opt.value);
      } else if (name === "color") {
        newGenerateData.colorId = selectedOption.map((opt) => opt.value);
      } else if (name === "size") {
        newGenerateData.sizeId = selectedOption.map((opt) => opt.value);
      } else if (name === "promotion") {
        newGenerateData.promotionId = selectedOption.value;
      }
    }

    setGenerateData(newGenerateData);
  };

  const handleCreateOption = async (name, newOption) => {
    try {
      let createdOption;
      if (name === "collar") {
        createdOption = await CollarService.createCollar({ name: newOption });
        setCollars((prev) => [...prev, createdOption]);
      } else if (name === "sleeve") {
        createdOption = await SleeveService.createSleeve({ name: newOption });
        setSleeves((prev) => [...prev, createdOption]);
      } else if (name === "color") {
        createdOption = await ColorService.createColor({ name: newOption });
        setColors((prev) => [...prev, createdOption]);
      } else if (name === "size") {
        createdOption = await SizeService.createSize({ name: newOption });
        setSizes((prev) => [...prev, createdOption]);
      }
      fetchSelectOptions();
      return createdOption;
    } catch (error) {
      console.error("Error creating new option:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenerateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Ensure lists are not null
      const productDetailData = {
        productId: generateData.productId,
        sizeId: generateData.sizeId || [],
        colorId: generateData.colorId || [],
        collarId: generateData.collarId || [],
        sleeveId: generateData.sleeveId || [],
        promotionId: generateData.promotionId,
        importPrice: generateData.importPrice,
        salePrice: generateData.salePrice,
        quantity: generateData.quantity,
        description: generateData.description || "",
      };

      await ProductDetailService.generateProductDetails(productDetailData);
      alert("Product detail generated successfully!");
    } catch (error) {
      console.error("Error generating product detail:", error);
      alert("Error generating product detail");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-5 gap-6">
        {/* Thuộc tính sản phẩm */}
        <div className="col-span-2 p-6 border rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Thuộc tính sản phẩm</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black">Tên sản phẩm</label>
              <Select
                name="product"
                options={products.map(product => ({ value: product.id, label: product.productName }))}
                isClearable
                placeholder="Chọn sản phẩm"
                onChange={(selectedOption) => {
                  setGenerateData((prevData) => ({
                    ...prevData,
                    productId: selectedOption ? selectedOption.value : null,
                  }));
                }}
                className="rounded-lg text-sm w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">Cổ áo</label>
                <CreatableSelect
                  name="collar"
                  options={collars.map(collar => ({ value: collar.id, label: collar.name }))}
                  value={collars
                    .filter(collar => generateData.collarId.includes(collar.id))
                    .map(collar => ({ value: collar.id, label: collar.name }))}
                  isMulti
                  onChange={(selectedOption) => handleSelectChange("collar", selectedOption)}
                  onCreateOption={(newOption) => handleCreateOption("collar", newOption)}
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Tay áo</label>
                <CreatableSelect
                  name="sleeve"
                  options={sleeves.map(sleeve => ({ value: sleeve.id, label: sleeve.sleeveName }))}
                  value={sleeves
                    .filter(sleeve => generateData.sleeveId.includes(sleeve.id))
                    .map(sleeve => ({ value: sleeve.id, label: sleeve.sleeveName }))}
                  isMulti
                  onChange={(selectedOption) => handleSelectChange("sleeve", selectedOption)}
                  onCreateOption={(newOption) => handleCreateOption("sleeve", newOption)}
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Màu sắc</label>
                <CreatableSelect
                  name="color"
                  options={colors.map(color => ({ value: color.id, label: color.name }))}
                  value={colors
                    .filter(color => generateData.colorId.includes(color.id))
                    .map(color => ({ value: color.id, label: color.name }))}
                  isMulti
                  onChange={(selectedOption) => handleSelectChange("color", selectedOption)}
                  onCreateOption={(newOption) => handleCreateOption("color", newOption)}
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Kích thước</label>
                <CreatableSelect
                  name="size"
                  options={sizes.map(size => ({ value: size.id, label: size.name }))}
                  value={sizes
                    .filter(size => generateData.sizeId.includes(size.id))
                    .map(size => ({ value: size.id, label: size.name }))}
                  isMulti
                  onChange={(selectedOption) => handleSelectChange("size", selectedOption)}
                  onCreateOption={(newOption) => handleCreateOption("size", newOption)}
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Khuyến mãi</label>
                <Select
                  name="promotion"
                  options={promotions.map(promotion => ({
                    value: promotion.id,
                    label: `${promotion.promotionName} - ${promotion.promotionPercent}% (Từ ${new Date(promotion.startDate).toLocaleDateString("vi-VN")} đến ${new Date(promotion.endDate).toLocaleDateString("vi-VN")})`
                  }))}

                  value={promotions
                    .filter(promotion => generateData.promotionId === promotion.id)
                    .map(promotion => ({ value: promotion.id, label: promotion.promotionName }))}
                  onChange={(selectedOption) => setGenerateData((prevData) => ({
                    ...prevData,
                    promotionId: selectedOption ? selectedOption.value : null,
                  }))}
                  className="rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  value={generateData.quantity}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số lượng"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Giá nhập</label>
                <input
                  type="number"
                  name="importPrice"
                  value={generateData.importPrice}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá nhập"
                  min={0}
                  step={10000}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Giá bán</label>
                <input
                  type="number"
                  name="salePrice"
                  value={generateData.salePrice}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá bán"
                  min={0}
                  step={10000}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-black mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={generateData.description}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả"
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biến thể sản phẩm */}
        {Object.values(generateData).every(
          (value) => (typeof value === "number" && value >= 0) || value && (!Array.isArray(value) || value.length > 0)
        ) ? (
          <div className="col-span-3 mt-6 bg-white p-6 border rounded-lg shadow-lg">
            <ProductVariants generateData={generateData} />
          </div>
        ) : (
          <div className="col-span-3 mt-6 p-6 border rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 flex items-center justify-center">
              <FaInfoCircle className="text-5xl text-blue-500" />
            </div>
            <p className="text-gray-600 mt-4">Chọn các thuộc tính để hiển thị sản phẩm chi tiết.</p>
          </div>
        )}
      </div>
    </div>
  );
}