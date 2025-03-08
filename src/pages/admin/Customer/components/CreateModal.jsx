import React, { useState, useEffect } from 'react';
import CustomerService from '../../../../services/CustomerService';
import CustomerAddressService from '../../../../services/CustomerAddressService';
import GHNService from '../../../../services/GHNService';
import { toast } from 'react-toastify';

const CreateModal = ({ isOpen, onCancel, setCreateModal, fetchCustomers }) => {
    const [newCustomer, setNewCustomer] = useState({
        fullname: '',
        username: '',
        email: '',
        phone: '',
        gender: 0,
        birthdate: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [newAddress, setNewAddress] = useState({
        provinceId: '',
        provinceName: '',
        districtId: '',
        districtName: '',
        wardId: '',
        wardName: '',
        addressDetail: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            resetForm(); // Reset form when modal opens
            fetchProvinces();
        }
    }, [isOpen]);

    const fetchProvinces = async () => {
        try {
            const response = await GHNService.getProvinces();
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await GHNService.getDistrictsByProvince(provinceId);
            setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await GHNService.getWardsByDistrict(districtId);
            setWards(response.data);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));

        if (name === 'provinceId') {
            const selectedProvince = provinces.find(p => p.ProvinceID == value);
            setNewAddress(prev => ({ ...prev, provinceName: selectedProvince?.ProvinceName || '' }));
            fetchDistricts(value);
        }

        if (name === 'districtId') {
            const selectedDistrict = districts.find(d => d.DistrictID == value);
            setNewAddress(prev => ({ ...prev, districtName: selectedDistrict?.DistrictName || '' }));
            fetchWards(value);
        }

        if (name === 'wardId') {
            const selectedWard = wards.find(w => w.WardCode === value);
            setNewAddress(prev => ({ ...prev, wardName: selectedWard?.WardName || '' }));
        }
    };

    const handleCreateCustomer = async () => {
        setLoading(true);
        try {
            const response = await CustomerService.add(newCustomer);
            const createdCustomer = response.data;

            // Hiển thị thông báo thành công ngay lập tức
            toast.success("Tạo khách hàng thành công!");

            if (newAddress.provinceId && newAddress.districtId && newAddress.wardId && newAddress.addressDetail) {
                await CustomerAddressService.create({
                    customerId: createdCustomer.id,
                    provinceId: newAddress.provinceId,
                    provinceName: newAddress.provinceName,
                    districtId: newAddress.districtId,
                    districtName: newAddress.districtName,
                    wardId: newAddress.wardId,
                    wardName: newAddress.wardName,
                    addressDetail: newAddress.addressDetail
                });
            }

            // Đóng modal và refresh danh sách khách hàng không chặn UI
            setCreateModal(false);
            fetchCustomers();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNewCustomer({
            fullname: '',
            username: '',
            email: '',
            phone: '',
            gender: 0,
            birthdate: ''
        });
        setNewAddress({
            provinceId: '',
            provinceName: '',
            districtId: '',
            districtName: '',
            wardId: '',
            wardName: '',
            addressDetail: ''
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box relative max-w-5xl w-full">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onCancel}>✖</button>
                    <h3 className="font-bold text-lg text-blue-600 text-center">Tạo khách hàng mới</h3>
                    <div className="flex">
                        <div className="w-1/2 pr-4 border-r">
                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                                    <input type="text" name="fullname" value={newCustomer.fullname} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập tên khách hàng" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                                    <input type="text" name="username" value={newCustomer.username} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập tên đăng nhập" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                    <input type="text" name="phone" value={newCustomer.phone} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập số điện thoại" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <input type="email" name="email" value={newCustomer.email} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập email" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                                    <input type="date" name="birthdate" value={newCustomer.birthdate} onChange={handleChange} className="input input-bordered w-full" placeholder="Nhập ngày sinh" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Giới tính</label>
                                    <select name="gender" value={newCustomer.gender} onChange={handleChange} className="select select-bordered w-full">
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="w-1/2 pl-4">
                            <h4 className="text-sm font-medium text-gray-600">Địa chỉ</h4>
                            <div className="flex gap-2 mt-4">
                                <div className="w-1/3">
                                    <label htmlFor="provinceId" className="text-sm font-medium text-gray-600">Tỉnh/Thành</label>
                                    <select name="provinceId" id="provinceId" value={newAddress.provinceId} onChange={(e) => { handleAddressChange(e); fetchDistricts(e.target.value); }} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map(province => (
                                            <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label htmlFor="districtId" className="text-sm font-medium text-gray-600">Quận/Huyện</label>
                                    <select name="districtId" id="districtId" value={newAddress.districtId} onChange={(e) => { handleAddressChange(e); fetchWards(e.target.value); }} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map(district => (
                                            <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label htmlFor="wardId" className="text-sm font-medium text-gray-600">Phường/Xã</label>
                                    <select name="wardId" id="wardId" value={newAddress.wardId} onChange={handleAddressChange} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map(ward => (
                                            <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <input type="text" name="addressDetail" value={newAddress.addressDetail} onChange={handleAddressChange} className="input input-bordered w-full mt-2" placeholder="Nhập địa chỉ chi tiết" />
                        </div>
                    </div>

                    <button
                        className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                        onClick={handleCreateCustomer}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Đang tạo...
                            </>
                        ) : (
                            'Tạo khách hàng'
                        )}
                    </button>

                </div>
            </div>
        </>
    );
};

export default CreateModal;