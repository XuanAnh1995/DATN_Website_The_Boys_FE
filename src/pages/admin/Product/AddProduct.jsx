import React, { useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ProductVariants from "./components/ProductVariants";
import ProductDetailService from "./services/ProductDetailService";

export default function AddProduct() {
  const [sanPhams, setSanPhams] = useState([]);
  const [chatLieus, setChatLieus] = useState([]);
  const [coAos, setCoAos] = useState([]);
  const [kichThuocs, setKichThuocs] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);
  const [tayAos, setTayAos] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [xuatXus, setXuatXus] = useState([]);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const [generateData, setGenerateData] = useState({
    sanPham: "",
    thuongHieu: [],
    xuatXu: [],
    chatLieu: [],
    coAo: [],
    tayAo: [],
    mauSac: [],
    kichThuoc: [],
    soLuong: 0,
    donGia: 0,
  });

  useEffect(() => {
    fetchSelectOptions();
  }, []);

  useEffect(() => {
    if (
      thuongHieus.length > 0 ||
      xuatXus.length > 0 ||
      chatLieus.length > 0 ||
      coAos.length > 0 ||
      tayAos.length > 0 ||
      mauSacs.length > 0 ||
      kichThuocs.length > 0
    ) {
      setGenerateData((prevData) => ({
        ...prevData,
        thuongHieu: thuongHieus.length > 0 ? [thuongHieus[0].id] : [],
        xuatXu: xuatXus.length > 0 ? [xuatXus[0].id] : [],
        chatLieu: chatLieus.length > 0 ? [chatLieus[0].id] : [],
        coAo: coAos.length > 0 ? [coAos[0].id] : [],
        tayAo: tayAos.length > 0 ? [tayAos[0].id] : [],
        mauSac: mauSacs.length > 0 ? [mauSacs[0].id] : [],
        kichThuoc: kichThuocs.length > 0 ? [kichThuocs[0].id] : [],
      }));
    }
  }, [thuongHieus, xuatXus, chatLieus, coAos, tayAos, mauSacs, kichThuocs]);

  const fetchSelectOptions = async () => {
    try {
      const sanPhamdata = await ProductDetailService.getSanPham();
      setSanPhams(sanPhamdata);

      const chatLieuData = await ProductDetailService.getChatLieu();
      setChatLieus(chatLieuData);

      const coAoData = await ProductDetailService.getCoAo();
      setCoAos(coAoData);

      const kichThuocData = await ProductDetailService.getKichThuoc();
      setKichThuocs(kichThuocData);

      const mauSacData = await ProductDetailService.getMauSac();
      setMauSacs(mauSacData);

      const tayAoData = await ProductDetailService.getTayAo();
      setTayAos(tayAoData);

      const thuongHieuData = await ProductDetailService.getThuongHieu();
      setThuongHieus(thuongHieuData);

      const xuatXuData = await ProductDetailService.getXuatXu();
      setXuatXus(xuatXuData);
    } catch (error) {
      setError("Error fetching select options");
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    const newGenerateData = { ...generateData };

    if (selectedOption) {
      if (name === "sanPham") {
        newGenerateData.sanPham = selectedOption.value;
      } else if (name === "thuongHieu") {
        newGenerateData.thuongHieu = selectedOption.map((opt) => opt.value);
      } else if (name === "xuatXu") {
        newGenerateData.xuatXu = selectedOption.map((opt) => opt.value);
      } else if (name === "chatLieu") {
        newGenerateData.chatLieu = selectedOption.map((opt) => opt.value);
      } else if (name === "coAo") {
        newGenerateData.coAo = selectedOption.map((opt) => opt.value);
      } else if (name === "tayAo") {
        newGenerateData.tayAo = selectedOption.map((opt) => opt.value);
      } else if (name === "mauSac") {
        newGenerateData.mauSac = selectedOption.map((opt) => opt.value);
      } else if (name === "kichThuoc") {
        newGenerateData.kichThuoc = selectedOption.map((opt) => opt.value);
      }
    }

    setGenerateData(newGenerateData);
  };

  const handleCreateOption = async (name, newOption) => {
    try {
      let createdOption;
      if (name === "thuongHieu") {
        createdOption = await ProductDetailService.addBrand({ tenThuongHieu: newOption });
        setThuongHieus((prev) => [...prev, createdOption]);
      } else if (name === "xuatXu") {
        createdOption = await ProductDetailService.addOrigin({ tenXuatXu: newOption });
        setXuatXus((prev) => [...prev, createdOption]);
      } else if (name === "chatLieu") {
        createdOption = await ProductDetailService.addMaterial({ tenChatLieu: newOption });
        setChatLieus((prev) => [...prev, createdOption]);
      } else if (name === "coAo") {
        createdOption = await ProductDetailService.addCollar({ tenCoAo: newOption });
        setCoAos((prev) => [...prev, createdOption]);
      } else if (name === "tayAo") {
        createdOption = await ProductDetailService.addSleeve({ tenTayAo: newOption });
        setTayAos((prev) => [...prev, createdOption]);
      } else if (name === "mauSac") {
        createdOption = await ProductDetailService.addColor({ tenMauSac: newOption });
        setMauSacs((prev) => [...prev, createdOption]);
      } else if (name === "kichThuoc") {
        createdOption = await ProductDetailService.addSize({ tenKichThuoc: newOption });
        setKichThuocs((prev) => [...prev, createdOption]);
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



  return (
    <div className="min-h-screen">
      <div>
        <div className="grid grid-cols-5 gap-3 px-2">
          {/* Thuộc tính sản phẩm */}
          <div className="col-span-2 mt-6 p-6 border rounded-lg bg-white shadow-lg">
            <h2 className="text-2xl font-semibold  mb-6">Thuộc tính sản phẩm</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <CreatableSelect
                  name="tenSanPham"
                  options={sanPhams.map(sanPham => ({ value: sanPham.id, label: sanPham.tenSanPham }))}
                  isClearable
                  placeholder="Chọn sản phẩm hoặc nhập tên mới !"
                  onChange={(selectedOption) => {
                    if (selectedOption && !selectedOption.__isNew__) {
                      setGenerateData((prevData) => ({
                        ...prevData,
                        sanPham: selectedOption.value,
                      }));
                    } else if (selectedOption && selectedOption.__isNew__) {
                      const newSanPham = { tenSanPham: selectedOption.label };
                      ProductDetailService.createSanPham(newSanPham).then((newProduct) => {
                        setSanPhams((prev) => [...prev, { id: newProduct.id, tenSanPham: newProduct.tenSanPham }]);
                        setGenerateData((prevData) => ({
                          ...prevData,
                          sanPham: newProduct.id,
                        }));
                      });
                    }
                  }}
                  className="rounded-lg text-sm w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Thương hiệu</label>
                  <CreatableSelect
                    name="thuongHieuId"
                    options={thuongHieus.map(th => ({ value: th.id, label: th.tenThuongHieu }))}
                    isMulti
                    value={thuongHieus
                      .filter(th => generateData.thuongHieu.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenThuongHieu }))}
                    onChange={(selectedOption) => handleSelectChange("thuongHieu", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("thuongHieu", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Xuất xứ</label>
                  <CreatableSelect
                    name="xuatXuId"
                    options={xuatXus.map(x => ({ value: x.id, label: x.tenXuatXu }))}
                    value={xuatXus
                      .filter(th => generateData.xuatXu.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenXuatXu }))}
                    isMulti
                    onChange={(selectedOption) => handleSelectChange("xuatXu", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("xuatXu", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Chất liệu</label>
                  <CreatableSelect
                    name="chatLieuId"
                    options={chatLieus.map(c => ({ value: c.id, label: c.tenChatLieu }))}
                    value={chatLieus
                      .filter(th => generateData.chatLieu.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenChatLieu }))}
                    isMulti
                    onChange={(selectedOption) => handleSelectChange("chatLieu", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("chatLieu", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cổ áo</label>
                  <CreatableSelect
                    name="coAoId"
                    options={coAos.map(c => ({ value: c.id, label: c.tenCoAo }))}
                    value={coAos
                      .filter(th => generateData.coAo.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenCoAo }))}
                    isMulti
                    onChange={(selectedOption) => handleSelectChange("coAo", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("coAo", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tay áo</label>
                  <CreatableSelect
                    name="tayAoId"
                    options={tayAos.map(t => ({ value: t.id, label: t.tenTayAo }))}
                    value={tayAos
                      .filter(th => generateData.tayAo.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenTayAo }))}
                    isMulti
                    onChange={(selectedOption) => handleSelectChange("tayAo", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("tayAo", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Màu sắc</label>
                  <CreatableSelect
                    name="mauSacId"
                    options={mauSacs.map(m => ({ value: m.id, label: m.tenMauSac }))}
                    value={mauSacs
                      .filter(th => generateData.mauSac.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenMauSac }))}
                    isMulti
                    onChange={(selectedOption) => handleSelectChange("mauSac", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("mauSac", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kích thước</label>
                  <CreatableSelect
                    name="kichThuocId"
                    options={kichThuocs.map(k => ({ value: k.id, label: k.tenKichThuoc }))}
                    value={kichThuocs
                      .filter(th => generateData.kichThuoc.includes(th.id))
                      .map(th => ({ value: th.id, label: th.tenKichThuoc }))}
                    isMulti
                    onChange={(selectedOption) => handleSelectChange("kichThuoc", selectedOption)}
                    onCreateOption={(newOption) => handleCreateOption("kichThuoc", newOption)}
                    className="rounded-lg text-sm w-full"
                  />
                </div>

                <div></div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    name="soLuong"
                    value={generateData.soLuong}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập số lượng"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Đơn giá</label>
                  <input
                    type="number"
                    name="donGia"
                    value={generateData.donGia}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Nhập đơn giá"
                    min={0}
                    step={10000}
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Biến thể sản phẩm */}
          {Object.values(generateData).every(
            (value) => (typeof value === "number" && value >= 0) || value && (!Array.isArray(value) || value.length > 0)
          ) ? (
            <div className="col-span-3 mt-6 bg-white ">
              <ProductVariants generateData={generateData} />
            </div>
          ) : (
            
            <div className="col-span-3 mt-6 p-6 border rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-center">
              
              <div className="w-24 h-24 flex items-center justify-center">
                <FaLightbulb className="text-5xl text-orange-500" />
              </div>
              <p className="text-gray-600 mt-4">Chọn các thuộc tính để hiển thị sản phẩm chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
