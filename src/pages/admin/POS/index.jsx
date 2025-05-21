
import React, { useState, useEffect, useMemo } from "react";
import SalePOS from "../../../services/POSService";
import ColorService from "../../../services/ColorService";
import SizeService from "../../../services/SizeService";
import CustomerService from "../../../services/CustomerService";
import { FaShoppingCart, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";
import Toast from "../../../components/ui/ToastModal";
import { debounce } from "lodash";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import AlertModal from "../../../components/ui/AlertModal";

const SalePOSPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [filter, setFilter] = useState({
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!newCustomer.fullname.trim()) {
      errors.fullname = "Họ tên không được để trống";
    }
    if (!newCustomer.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10}$/.test(newCustomer.phone.trim())) {
      errors.phone = "Số điện thoại phải có đúng 10 chữ số";
    }
    if (
      newCustomer.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email.trim())
    ) {
      errors.email = "Email không hợp lệ";
    }
    return errors;
  };

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const [vouchers, setVouchers] = useState([]);

  // Thêm state để lưu voucher tối ưu
  const [optimalVoucher, setOptimalVoucher] = useState(null);

  // Thêm một trạng thái hasSelectedVoucher để kiểm tra xem người dùng đã chọn voucher (kể cả "Không sử dụng voucher") hay chưa.
  const [hasSelectedVoucher, setHasSelectedVoucher] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [orders, setOrders] = useState([]);
  const [activeOrderIndex, setActiveOrderIndex] = useState(null);

  const currentOrder = useMemo(() => {
    return activeOrderIndex !== null && activeOrderIndex < orders.length
      ? orders[activeOrderIndex]
      : { items: [], totalAmount: 0, discount: 0 };
  }, [activeOrderIndex, orders]);

  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullname: "",
    phone: "",
    email: "",
  });

  const [currentEmployee] = useState({ id: 1, name: "Nhân viên mặc định" });

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  // State cho đồng hồ đếm ngược
  const [timeRemaining, setTimeRemaining] = useState({});

  // Hàm định dạng thời gian còn lại
  const formatTimeRemaining = (expiresAt) => {
    const now = new Date().getTime();
    const timeLeft = Math.max(0, expiresAt - now);
    if (timeLeft === 0) return 'Hết hạn';
    const minutes = Math.floor(timeLeft / 1000 / 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchProductDetails();
    fetchCustomers();
    fetchVouchers();
    fetchColors();
    fetchSizes();
  }, []);

  // Tải hóa đơn từ localStorage khi mount
  useEffect(() => {
    const loadOrdersFromStorage = () => {
      const savedOrders = localStorage.getItem('pendingOrders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        const now = new Date().getTime();
        const validOrders = parsedOrders.filter(order => order.expiresAt > now);
        if (validOrders.length > 0) {
          setOrders(validOrders);
          setActiveOrderIndex(validOrders.length - 1);
        }
        localStorage.setItem('pendingOrders', JSON.stringify(validOrders));
      }
    };

    loadOrdersFromStorage();
  }, []);

  // Lưu hóa đơn và xóa hóa đơn hết hạn
  useEffect(() => {
    const saveOrdersToStorage = () => {
      const ordersWithTimestamps = orders.map(order => ({
        ...order,
        createdAt: order.createdAt || new Date().getTime(),
        expiresAt: order.expiresAt || new Date().getTime() + 15 * 60 * 1000,
      }));
      localStorage.setItem('pendingOrders', JSON.stringify(ordersWithTimestamps));
    };

    saveOrdersToStorage();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiredOrders = orders.filter(order => order.expiresAt <= now);
      const validOrders = orders.filter(order => order.expiresAt > now);

      if (expiredOrders.length > 0) {
        setOrders(validOrders);
        localStorage.setItem('pendingOrders', JSON.stringify(validOrders));

        if (activeOrderIndex !== null && activeOrderIndex >= validOrders.length) {
          setActiveOrderIndex(validOrders.length - 1 >= 0 ? validOrders.length - 1 : null);
        }

        const expiredOrderNumbers = expiredOrders.map((_, index) => index + 1).join(', #');
        setNotification({
          type: 'info',
          message: `Hóa đơn #${expiredOrderNumbers} đã hết hạn và bị xóa.`,
        });
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [orders, activeOrderIndex]);

  // Cập nhật đồng hồ đếm ngược
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const updated = {};
        orders.forEach((order) => {
          updated[order.id] = formatTimeRemaining(order.expiresAt);
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orders]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer.id);
    setCustomerName(customer.fullname);
    setPhone(customer.phone);
    setEmail(customer.email);
    setSearchKeyword(customer.fullname);
    setFilteredCustomers([]);
    setIsSearching(false);
    if (activeOrderIndex !== null) {
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        updatedOrders[activeOrderIndex].customerId = customer.id;
        return updatedOrders;
      });
    }
  };

  useEffect(() => {
    let filtered = allProducts;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) => {
        const now = new Date();
        const startDate = product.promotion?.startDate
          ? new Date(product.promotion.startDate)
          : null;
        const endDate = product.promotion?.endDate
          ? new Date(product.promotion.endDate)
          : null;
        const isPromotionActive =
          startDate && endDate && now >= startDate && now <= endDate;
        const discountPercent = isPromotionActive
          ? product.promotion?.promotionPercent || 0
          : 0;
        const effectivePrice =
          discountPercent > 0
            ? product.salePrice * (1 - discountPercent / 100)
            : product.salePrice;

        const fields = [
          product.id?.toString() || "",
          product.product?.productName?.toLowerCase() || "",
          product.size?.name?.toLowerCase() || "",
          product.color?.name?.toLowerCase() || "",
          product.promotion?.promotionPercent?.toString() || "",
          product.collar?.name?.toLowerCase() || "",
          product.sleeve?.name?.toLowerCase() || "",
          product.photo?.toLowerCase() || "",
          product.productDetailCode?.toLowerCase() || "",
          product.importPrice?.toString() || "",
          product.salePrice?.toString() || "",
          effectivePrice?.toString() || "",
          product.quantity?.toString() || "",
          product.description?.toLowerCase() || "",
          product.status?.toString() || "",
        ];

        return fields.some((field) => field.includes(searchLower));
      });
    }

    if (filter.color) {
      filtered = filtered.filter((product) =>
        product.color?.name?.toLowerCase().includes(filter.color.toLowerCase())
      );
    }

    if (filter.size) {
      filtered = filtered.filter((product) =>
        product.size?.name?.toLowerCase().includes(filter.size.toLowerCase())
      );
    }

    const minPrice = Number(filter.minPrice) || 0;
    const maxPrice = Number(filter.maxPrice) || Infinity;
    filtered = filtered.filter((product) => {
      const now = new Date();
      const startDate = product.promotion?.startDate
        ? new Date(product.promotion.startDate)
        : null;
      const endDate = product.promotion?.endDate
        ? new Date(product.promotion.endDate)
        : null;
      const isPromotionActive =
        startDate && endDate && now >= startDate && now <= endDate;
      const discountPercent = isPromotionActive
        ? product.promotion?.promotionPercent || 0
        : 0;
      const effectivePrice =
        discountPercent > 0
          ? product.salePrice * (1 - discountPercent / 100)
          : product.salePrice;

      return effectivePrice >= minPrice && effectivePrice <= maxPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, allProducts, filter]);

  useEffect(() => {
    if (currentOrder?.totalAmount > 0) {
      const validVouchers = vouchers.filter((v) => {
        const now = new Date();
        const startDate = new Date(v.startDate);
        const endDate = new Date(v.endDate);
        return (
          v.status === true &&
          currentOrder.totalAmount >= v.minCondition &&
          now >= startDate &&
          now <= endDate
        );
      });

      const vouchersWithDiscount = validVouchers.map((voucher) => ({
        ...voucher,
        discountValue: calculateDiscount(voucher, currentOrder.totalAmount),
      }));

      const maxDiscountValue = Math.max(
        ...vouchersWithDiscount.map((v) => v.discountValue),
        0
      );

      const bestVouchers = vouchersWithDiscount.filter(
        (v) => v.discountValue === maxDiscountValue
      );

      const bestVoucher =
        bestVouchers.length > 0
          ? bestVouchers[Math.floor(Math.random() * bestVouchers.length)]
          : null;

      setOptimalVoucher(bestVoucher || null);

      // Chỉ áp dụng bestVoucher nếu người dùng chưa chọn thủ công
      if (bestVoucher && !hasSelectedVoucher) {
        handleVoucherChange(bestVoucher.voucherCode);
      } else if (!bestVoucher) {
        setSelectedVoucher("");
        setCalculatedDiscount(0);
      }
    } else {
      setOptimalVoucher(null);
      setSelectedVoucher("");
      setCalculatedDiscount(0);
    }
  }, [currentOrder.totalAmount, vouchers]);

  useEffect(() => {
    if (activeOrderIndex !== null && selectedVoucher) {
      const voucher = vouchers.find((v) => v.voucherCode === selectedVoucher);
      if (voucher && currentOrder.totalAmount >= voucher.minCondition) {
        const discountAmount = calculateDiscount(
          voucher,
          currentOrder.totalAmount
        );
        setCalculatedDiscount(discountAmount);
      } else {
        setCalculatedDiscount(0);
      }
    } else {
      setCalculatedDiscount(0);
    }
  }, [currentOrder.totalAmount, selectedVoucher, vouchers, activeOrderIndex]);

  const fetchProductDetails = async () => {
    try {
      const response = await SalePOS.getProductDetails({});
      setAllProducts(response?.content || []);
      setFilteredProducts(response?.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await SalePOS.getCustomers();
      setCustomers(response?.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await SalePOS.getVouchers();
      setVouchers(response?.content || []);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách voucher", error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await ColorService.getAllColors();
      setColors(response.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách màu sắc:", error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await SizeService.getAllSizes();
      setSizes(response.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kích thước:", error);
    }
  };

  const handleSearchCustomer = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (!keyword) {
      setFilteredCustomers([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const results = customers.filter((customer) => {
      const fullname = (customer.fullname || "").trim().toLowerCase();
      const phone = (customer.phone || "").trim().toLowerCase();
      const email = (customer.email || "").trim().toLowerCase();

      return (
        fullname.includes(keyword) ||
        phone.includes(keyword) ||
        email.includes(keyword)
      );
    });

    setFilteredCustomers(results);
    setIsSearching(false);
  };

  const handleVoucherChange = (voucherCode) => {
    setSelectedVoucher(voucherCode);
    setHasSelectedVoucher(true); // Đánh dấu rằng người dùng đã chọn

    const voucher = vouchers.find((v) => v.voucherCode === voucherCode);
    if (voucher && currentOrder.totalAmount >= voucher.minCondition) {
      const discountAmount = calculateDiscount(voucher, currentOrder.totalAmount);
      setCalculatedDiscount(discountAmount);
      if (activeOrderIndex !== null) {
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders[activeOrderIndex].voucherId = voucher.id;
          return updatedOrders;
        });
      }
    } else {
      setCalculatedDiscount(0);
      if (activeOrderIndex != null) {
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders[activeOrderIndex].voucherId = null;
          return updatedOrders;
        });
      }
    }
  };

  const calculateDiscount = (voucher, totalAmount) => {
    if (!voucher || totalAmount < voucher.minCondition) return 0;
    const discount = (totalAmount * voucher.reducedPercent) / 100;
    return Math.min(discount, voucher.maxDiscount || discount);
  };

  const handleAddNewCustomerClick = () => {
    setShowAddCustomerForm(true);
  };

  const handleCancelAddCustomer = () => {
    setShowAddCustomerForm(false);
    setNewCustomer({
      fullname: "",
      phone: "",
      email: "",
    });
  };

  const handleNewCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseWalkInCustomer = () => {
    setSelectedCustomer("walk-in");
    setCustomerName("Khách vãng lai");
    setPhone("");
    setEmail("");
    setShowAddCustomerForm(false);
    setNotification({
      type: "info",
      message: "Đã chọn khách vãng lai",
    });
  };

  const resetNewCustomer = () => {
    setNewCustomer({
      fullname: "",
      phone: "",
      email: "",
    });
    setShowAddCustomerForm(false);
  };

  const handleSaveNewCustomer = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      const trimmedCustomer = {
        fullname: newCustomer.fullname.trim(),
        phone: newCustomer.phone.trim(),
        email: newCustomer.email.trim(),
      };

      const response = await CustomerService.add(trimmedCustomer);

      if (response?.data?.id) {
        setCustomers((prev) => [...prev, response.data]);
        handleSelectCustomer(response.data);
        setNotification({
          type: "success",
          message: "Thêm mới khách hàng thành công !",
        });
        resetNewCustomer();
      } else {
        setNotification({
          type: "error",
          message: "Không thể thêm khách hàng. Vui lòng thử lại",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Lỗi khi thêm khách hàng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        customerId:
          selectedCustomer && selectedCustomer !== "walk-in"
            ? selectedCustomer
            : -1,
        employeeId: 1,
        voucherId: selectedVoucher
          ? vouchers.find((v) => v.voucherCode === selectedVoucher)?.id
          : null,
        paymentMethod: "cash",
      };

      const newOrder = await SalePOS.createOrder(orderData);

      setOrders((prevOrders) => [
        ...prevOrders,
        {
          id: newOrder.id,
          items: [],
          totalAmount: 0,
          discount: 0,
          customerId: orderData.customerId,
          voucherId: orderData.voucherId,
          paymentMethod: orderData.paymentMethod,
          createdAt: new Date().getTime(),
          expiresAt: new Date().getTime() + 30 * 60 * 1000,
        },
      ]);

      setActiveOrderIndex(orders.length);
      setHasSelectedVoucher(false); // Reset để áp dụng bestVoucher cho hóa đơn mới
      console.log("✅ Đơn hàng mới đã được tạo:", newOrder);
    } catch (error) {
      setAlertMessage("Lỗi khi tạo hóa đơn: " + error.message);
      setIsAlertModalOpen(true);
    }
  };

  useEffect(() => {
    let barcode = "";
    let timer = null;

    const handleKeyDown = (event) => {
      const currentTime = Date.now();

      if (event.key === "Enter" && barcode.trim() !== "") {
        handleBarcodeScan(barcode);
        barcode = "";
      } else if (event.key.length === 1) {
        barcode += event.key;
        clearTimeout(timer);
        timer = setTimeout(() => {
          barcode = "";
        }, 500);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [activeOrderIndex, allProducts]);

  const handleBarcodeScan = (scannedBarcode) => {
    if (!scannedBarcode) return;

    if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
      setAlertMessage("Bạn cần chọn hóa đơn trước khi quét mã vạch!");
      setIsAlertModalOpen(true);
      return;
    }

    const product = allProducts.find(
      (p) => p.productDetailCode === scannedBarcode
    );

    if (product) {
      if (product.quantity <= 0) {
        setAlertMessage(
          `Sản phẩm "${product.product?.productName}" đã hết hàng!`
        );
        setIsAlertModalOpen(true);
        return;
      }
      handleAddToCart(product);
    } else {
      setAlertMessage("Không tìm thấy sản phẩm với mã vạch này!");
      setIsAlertModalOpen(true);
    }
  };

  const handleAddToCart = async (product) => {
    if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
      setAlertMessage("Vui lòng tạo hóa đơn trước!");
      setIsAlertModalOpen(true);
      return;
    }

    if (product.quantity <= 0) {
      setAlertMessage(`Sản phẩm ${product.product?.productName} đã hết hàng!`);
      setIsAlertModalOpen(true);
      return;
    }

    const orderId = orders[activeOrderIndex].id;
    const productData = { productDetailId: product.id, quantity: 1 };

    try {
      await SalePOS.addProductToCart(orderId, productData);

      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        const currentOrder = updatedOrders[activeOrderIndex];

        const existingItemIndex = currentOrder.items.findIndex(
          (item) => item.id === product.id
        );
        if (existingItemIndex !== -1) {
          const existingItem = currentOrder.items[existingItemIndex];
          if (existingItem.quantity >= product.quantity) {
            setAlertMessage(
              `Sản phẩm "${product.product?.productName}" chỉ còn ${product.quantity} sản phẩm trong kho.`
            );
            setIsAlertModalOpen(true);
            return updatedOrders;
          }
          currentOrder.items[existingItemIndex].quantity += 1;
        } else {
          currentOrder.items.push({
            ...product,
            quantity: 1,
            quantityAvailable: product.quantity,
          });
        }

        currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
          const salePrice = Number(item.salePrice) || 0;
          const discountPercent = Number(item.promotion?.promotionPercent) || 0;
          const discountedPrice = salePrice * (1 - discountPercent / 100);
          return sum + discountedPrice * item.quantity;
        }, 0);

        return updatedOrders;
      });
    } catch (error) {
      setAlertMessage("Có lỗi xảy ra khi thêm sản phẩm: " + error.message);
      setIsAlertModalOpen(true);
    }
  };

  const handleRemoveFromCart = (productId) => {
    if (activeOrderIndex === null) {
      return;
    }

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const currentOrder = updatedOrders[activeOrderIndex];

      currentOrder.items = currentOrder.items.filter(
        (item) => item.id !== productId
      );

      currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
        const salePrice = Number(item.salePrice) || 0;
        const discountPercent = Number(item.promotion?.promotionPercent) || 0;
        const discountedPrice = salePrice * (1 - discountPercent / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);

      return updatedOrders;
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (activeOrderIndex === null) {
      return;
    }

    if (newQuantity <= 0) {
      return;
    }

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const currentOrder = updatedOrders[activeOrderIndex];

      const itemIndex = currentOrder.items.findIndex(
        (item) => item.id === productId
      );

      if (itemIndex !== -1) {
        currentOrder.items[itemIndex].quantity = newQuantity;
      } else {
        return updatedOrders;
      }

      currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
        const salePrice = Number(item.salePrice) || 0;
        const discountPercent = Number(item.promotion?.promotionPercent) || 0;
        const discountedPrice = salePrice * (1 - discountPercent / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);

      return updatedOrders;
    });
  };

  const handleSwitchOrder = (index) => {
    setActiveOrderIndex(index);

    if (orders[index]) {
      const order = orders[index];
      setSelectedCustomer(order.customerId);
      setDiscount(order.discount);
      setPaymentMethod(order.paymentMethod);

      if (order.customerId === "walk-in") {
        setCustomerName("Khách vãng lai");
        setPhone("");
        setEmail("");
      } else {
        const selected = customers.find((c) => c.id === order.customerId);
        if (selected) {
          setPhone(selected.phone || "");
          setCustomerName(selected.fullname || "");
          setEmail(selected.email || "");
        }
      }
    }
  };

  const handleRemoveOrder = (index) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      updatedOrders.splice(index, 1);
      localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    if (activeOrderIndex === index) {
      setActiveOrderIndex(null);
    } else if (activeOrderIndex > index) {
      setActiveOrderIndex(activeOrderIndex - 1);
    }
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);

    if (activeOrderIndex !== null) {
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        updatedOrders[activeOrderIndex].discount = value;
        return updatedOrders;
      });
    }
  };

  useEffect(() => {
    if (activeOrderIndex !== null && orders[activeOrderIndex]) {
      const totalAmount = orders[activeOrderIndex].totalAmount;
      const finalAmount = totalAmount - calculatedDiscount;
      setChangeAmount(Math.max(customerPaid - finalAmount, 0));
    }
  }, [customerPaid, activeOrderIndex, orders, calculatedDiscount]);

  const handleVNPayPayment = async (orderId) => {
    try {
      const paymentUrl = await SalePOS.createVNPayPaymentUrl(orderId);

      localStorage.setItem("pendingOrderId", orderId);
      localStorage.setItem("pendingCustomerId", selectedCustomer || -1);
      localStorage.setItem(
        "pendingVoucherId",
        selectedVoucher
          ? vouchers.find((v) => v.voucherCode === selectedVoucher)?.id
          : null
      );

      window.location.href = paymentUrl;
    } catch (error) {
      setAlertMessage("Lỗi khi tạo URL thanh toán: " + error.message);
      setIsAlertModalOpen(true);
    }
  };

  const handlePayment = async () => {
    if (activeOrderIndex === null) {
      setAlertMessage("Vui lòng chọn hoặc tạo hóa đơn!");
      setIsAlertModalOpen(true);
      return;
    }

    const currentOrder = orders[activeOrderIndex];
    if (currentOrder.items.length === 0) {
      setAlertMessage("Giỏ hàng trống, vui lòng thêm sản phẩm!");
      setIsAlertModalOpen(true);
      return;
    }

    if (!selectedCustomer) {
      setAlertMessage("Vui lòng chọn khách hàng!");
      setIsAlertModalOpen(true);
      return;
    }

    const amountToPay = currentOrder.totalAmount - calculatedDiscount;

    if (paymentMethod === "cash" && customerPaid < amountToPay) {
      setAlertMessage(
        `Số tiền khách thanh toán (${customerPaid.toLocaleString()} VND) không đủ. Khách cần trả ít nhất ${amountToPay.toLocaleString()} VND.`
      );
      setIsAlertModalOpen(true);
      return;
    }

    const messageContent = (
      <div>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {currentOrder.totalAmount.toLocaleString()} VND
        </p>
        <p>
          <strong>Giảm giá:</strong> {calculatedDiscount.toLocaleString()} VND
        </p>
        <p>
          <strong>Khách phải trả:</strong>{" "}
          {(currentOrder.totalAmount - calculatedDiscount).toLocaleString()} VND
        </p>
        <p>
          <strong>Phương thức:</strong>{" "}
          {paymentMethod === "cash" ? "Tiền mặt" : "VNPay"}
        </p>
        {paymentMethod === "cash" && (
          <>
            <p>
              <strong>Khách thanh toán:</strong> {customerPaid.toLocaleString()}{" "}
              VND
            </p>
            <p>
              <strong>Tiền thừa:</strong> {changeAmount.toLocaleString()} VND
            </p>
          </>
        )}
      </div>
    );

    setConfirmMessage(messageContent);
    setConfirmAction(() => async () => {
      const customerId = selectedCustomer === "walk-in" ? -1 : selectedCustomer;
      const orderRequest = {
        orderId: currentOrder.id ?? null,
        customerId: customerId,
        employeeId: currentEmployee.id,
        voucherId: selectedVoucher
          ? vouchers.find((v) => v.voucherCode === selectedVoucher)?.id
          : null,
        paymentMethod: paymentMethod,
        orderDetails: currentOrder.items.map((item) => ({
          productDetailId: item.id,
          quantity: item.quantity,
        })),
      };

      try {
        const response = await SalePOS.checkout(orderRequest);
        const { orderId, paymentResponse } = response;

        if (paymentMethod === "vnpay") {
          if (orderId) {
            const qrData = await SalePOS.createVNPayPaymentUrl(orderId);
            setPaymentUrl(qrData);
            setShowQRCode(true);

            localStorage.setItem("pendingOrderId", orderId);
            localStorage.setItem("pendingCustomerId", selectedCustomer || -1);
            localStorage.setItem(
              "pendingVoucherId",
              selectedVoucher
                ? vouchers.find((v) => v.voucherCode === selectedVoucher)?.id
                : null
            );
          } else {
            throw new Error("Không thể lấy orderId cho thanh toán VNPay.");
          }
        } else {
          if (paymentResponse && paymentResponse.status === "success") {
            setOrders((prevOrders) => {
              const updatedOrders = [...prevOrders];
              updatedOrders.splice(activeOrderIndex, 1);
              localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
              return updatedOrders;
            });
            setActiveOrderIndex(null);
            resetAfterPayment();
            await fetchProductDetails();
            setNotification({
              type: "success",
              message: "Thanh toán thành công!",
            });
          } else {
            throw new Error("Thanh toán thất bại!");
          }
        }
      } catch (error) {
        setAlertMessage("Có lỗi xảy ra khi thanh toán: " + error.message);
        setIsAlertModalOpen(true);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const resetAfterPayment = () => {
    setSelectedCustomer("");
    setCustomerName("");
    setPhone("");
    setEmail("");
    setSearchKeyword("");
    setFilteredCustomers([]);
    setTotalAmount(0);
    setCustomerPaid(0);
    setChangeAmount(0);
    setSelectedVoucher("");
    setCalculatedDiscount(0);
    setShowAddCustomerForm(false);
    setNewCustomer({
      fullname: "",
      phone: "",
      email: "",
    });

    setPaymentUrl(null); // Reset URL thanh toán
    setShowQRCode(false); // Ẩn mã QR
    setHasSelectedVoucher(false); // Reset để áp dụng bestVoucher cho lần tiếp theo
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen relative">
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          if (confirmAction) {
            await confirmAction();
          }
          setIsConfirmModalOpen(false);
        }}
        title="Xác nhận thanh toán"
        message={confirmMessage}
      />
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        message={alertMessage}
      />

      {showAddCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm khách hàng mới</h3>
              <button
                onClick={handleCancelAddCustomer}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={newCustomer.fullname}
                  onChange={handleNewCustomerInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.fullname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập họ tên khách hàng"
                />
                {formErrors.fullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.fullname}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleNewCustomerInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={handleNewCustomerInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập email (không bắt buộc)"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleUseWalkInCustomer}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                title="Sử dụng khách vãng lai mà không lưu thông tin"
              >
                Sử dụng khách vãng lai
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelAddCustomer}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveNewCustomer}
                  disabled={isLoading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : null}
                  Lưu khách hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center bg-blue-600 p-3 text-white">
        <input
          type="text"
          placeholder="F3) Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-2 border rounded text-black"
        />
        <button
          onClick={handleCreateOrder}
          className="ml-2 bg-white text-blue-600 px-4 py-2 rounded"
        >
          Tạo hóa đơn mới
        </button>
      </div>

      {orders.length > 0 && (
        <div className="flex overflow-x-auto my-2 bg-white p-2 rounded shadow">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className={`min-w-[150px] cursor-pointer p-2 mr-2 rounded ${index === activeOrderIndex ? "bg-blue-100 border border-blue-500" : "bg-gray-100"}`}
              onClick={() => handleSwitchOrder(index)}
            >
              <div className="flex justify-between items-center">
                <span>Hóa đơn #{index + 1}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOrder(index);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>
              <div className="text-sm">{order.items.length} sản phẩm</div>
              <div className="font-bold">
                {order.totalAmount.toLocaleString()} VND
              </div>
              <div className="text-sm text-red-600 font-semibold">
                {timeRemaining[order.id] || formatTimeRemaining(order.expiresAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            Giỏ hàng{" "}
            {activeOrderIndex !== null
              ? `(Hóa đơn #${activeOrderIndex + 1})`
              : ""}
          </h3>

          {!activeOrderIndex && activeOrderIndex !== 0 ? (
            <div className="text-center text-gray-500 p-4">
              <img
                src="/src/assets/empty_box.png"
                alt="Empty"
                className="w-32 mx-auto"
              />
              <p>Vui lòng tạo hoặc chọn một hóa đơn</p>
            </div>
          ) : currentOrder.items.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              <img
                src="/src/assets/empty_box.png"
                alt="Empty"
                className="w-32 mx-auto"
              />
              <p>Giỏ hàng của bạn chưa có sản phẩm nào!</p>
            </div>
          ) : (
            <table className="min-w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Mã Sản Phẩm</th>
                  <th className="p-2">Tên Sản Phẩm</th>
                  <th className="p-2">Màu Sắc</th>
                  <th className="p-2">Kích Thước</th>
                  <th className="p-2">Giá Bán</th>
                  <th className="p-2">Giảm Giá</th>
                  <th className="p-2">Số Lượng</th>
                  <th className="p-2">Thành Tiền</th>
                  <th className="p-2">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item) => {
                  const discountPercent = item.promotion?.promotionPercent || 0;
                  const discountedPrice =
                    discountPercent > 0
                      ? item.salePrice * (1 - discountPercent / 100)
                      : item.salePrice;

                  return (
                    <tr key={item.id} className="text-center border">
                      <td className="p-2">
                        {item.productDetailCode || "Không có mã"}
                      </td>
                      <td className="p-2">
                        {item.product?.productName || "Không có tên"}
                      </td>
                      <td className="p-2">
                        {item.color?.name || "Không có mã"}
                      </td>
                      <td className="p-2">
                        {item.size?.name || "Không có mã"}
                      </td>
                      <td className="p-2 text-blue-600 font-bold">
                        {item.salePrice?.toLocaleString()} VND
                      </td>
                      <td className="p-2 text-blue-600 font-bold">
                        {(item.salePrice - discountedPrice).toLocaleString()}{" "}
                        VND
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          max={item.quantityAvailable || 1}
                          value={
                            isNaN(item.quantity) || item.quantity < 1
                              ? 1
                              : item.quantity
                          }
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            if (newQuantity > item.quantityAvailable) {
                              setAlertMessage(
                                `Sản phẩm "${item.product?.productName}" chỉ còn ${item.quantityAvailable} sản phẩm trong kho.`
                              );
                              setIsAlertModalOpen(true);
                              return;
                            }
                            handleQuantityChange(item.id, newQuantity);
                          }}
                          className="w-16 p-1 text-center border rounded"
                        />
                      </td>
                      <td className="p-2 text-blue-600 font-bold">
                        {(discountedPrice * item.quantity).toLocaleString()} VND
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h3>

            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Giá tối thiểu (VND)
                </label>
                <input
                  type="number"
                  min="0"
                  value={filter.minPrice}
                  onChange={(e) =>
                    setFilter({ ...filter, minPrice: e.target.value })
                  }
                  placeholder="Nhập giá tối thiểu"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Giá tối đa (VND)
                </label>
                <input
                  type="number"
                  min="0"
                  value={filter.maxPrice}
                  onChange={(e) =>
                    setFilter({ ...filter, maxPrice: e.target.value })
                  }
                  placeholder="Nhập giá tối đa"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Màu sắc
                </label>
                <select
                  value={filter.color}
                  onChange={(e) =>
                    setFilter({ ...filter, color: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Chọn màu sắc</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Kích thước
                </label>
                <select
                  value={filter.size}
                  onChange={(e) =>
                    setFilter({ ...filter, size: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Chọn kích thước</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.name}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Mã sản phẩm</th>
                  <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                  <th className="py-2 px-4 border-b text-left">Màu sắc</th>
                  <th className="py-2 px-4 border-b text-left">Kích thước</th>
                  <th className="py-2 px-4 border-b text-left">Số lượng</th>
                  <th className="py-2 px-4 border-b text-left">Giá bán</th>
                  <th className="py-2 px-4 border-b text-left">Giảm giá</th>
                  <th className="py-2 px-4 border-b text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    const now = new Date();
                    const startDate = product.promotion?.startDate
                      ? new Date(product.promotion.startDate)
                      : null;
                    const endDate = product.promotion?.endDate
                      ? new Date(product.promotion.endDate)
                      : null;

                    const isPromotionActive =
                      startDate &&
                      endDate &&
                      now >= startDate &&
                      now <= endDate;
                    const discountPercent = isPromotionActive
                      ? product.promotion.promotionPercent
                      : 0;
                    const discount =
                      discountPercent > 0 ? `${discountPercent}%` : "___";

                    const discountedPrice =
                      discountPercent > 0
                        ? product.salePrice * (1 - discountPercent / 100)
                        : product.salePrice;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                          {product.productDetailCode || "Không có mã"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.product?.productName || "Không có tên"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.color?.name || "Không xác định"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.size?.name || "Không xác định"}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {product.quantity || 0}
                        </td>
                        <td className="py-2 px-4 border-b text-blue-600 font-bold">
                          {product.salePrice?.toLocaleString()} VND
                        </td>
                        <td className="py-2 px-4 border-b text-blue-600 font-bold">
                          {discount}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                          >
                            <FaShoppingCart size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-2 px-4 text-center text-gray-500"
                    >
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from(
                {
                  length: Math.ceil(filteredProducts.length / productsPerPage),
                },
                (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm khách hàng
          </label>
          <div className="flex items-center space-x-2 w-80">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchCustomer}
                placeholder="Nhập tên, số điện thoại hoặc email..."
                className="border p-2 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {isSearching && (
                <div className="absolute right-2 top-2">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                </div>
              )}

              {filteredCustomers.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-md w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <li
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="p-3 hover:bg-blue-50 cursor-pointer flex items-center space-x-2 border-b last:border-b-0"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-800">
                          {customer.fullname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.phone}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!isSearching &&
                searchKeyword &&
                filteredCustomers.length === 0 && (
                  <div className="absolute z-10 bg-white border rounded-md w-full mt-1 shadow-lg p-3 text-gray-500">
                    Không tìm thấy khách hàng.{" "}
                    <button
                      onClick={handleAddNewCustomerClick}
                      className="text-blue-600 hover:underline"
                    >
                      Thêm khách hàng mới
                    </button>
                  </div>
                )}
            </div>
            <button
              onClick={handleAddNewCustomerClick}
              className="bg-blue-600 text-white p-2 rounded flex items-center justify-center w-10 h-10 hover:bg-blue-700"
              title="Thêm khách hàng mới"
            >
              <FaPlus />
            </button>
          </div>

          {customerName && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <p>
                <strong>Tên:</strong> {customerName}
              </p>
              {phone && (
                <p>
                  <strong>SĐT:</strong> {phone}
                </p>
              )}
              {email && (
                <p>
                  <strong>Email:</strong> {email}
                </p>
              )}
            </div>
          )}

          <h3 className="text-lg font-semibold mt-4">Thanh toán</h3>
          <p>Tổng tiền: {currentOrder.totalAmount.toLocaleString()} VND</p>

          <div className="mt-2">
            <select
              value={selectedVoucher}
              onChange={(e) => handleVoucherChange(e.target.value)}
              className="border p-2 w-full mt-1 rounded-md"
            >
              <option value="" disabled>
                Chọn voucher
              </option>
              {vouchers
                .filter((v) => {
                  const now = new Date();
                  const startDate = new Date(v.startDate);
                  const endDate = new Date(v.endDate);
                  return (
                    v.status === true &&
                    currentOrder?.totalAmount >= v.minCondition &&
                    now >= startDate &&
                    now <= endDate
                  );
                })
                .sort((a, b) => {
                  const discountA = calculateDiscount(
                    a,
                    currentOrder.totalAmount
                  );
                  const discountB = calculateDiscount(
                    b,
                    currentOrder.totalAmount
                  );
                  if (discountB !== discountA) {
                    return discountB - discountA;
                  }
                  return a.voucherCode.localeCompare(b.voucherCode);
                })
                .map((v) => (
                  <option key={v.id} value={v.voucherCode}>
                    {v.voucherCode} - {v.voucherName} - {v.reducedPercent}%
                    (Giảm{" "}
                    {calculateDiscount(
                      v,
                      currentOrder.totalAmount
                    ).toLocaleString()}{" "}
                    VND)
                  </option>
                ))}
              <option value="">Không sử dụng voucher</option>
            </select>
          </div>

          <p className="font-bold text-lg mt-2">
            KHÁCH PHẢI TRẢ:{" "}
            {(currentOrder.totalAmount - calculatedDiscount).toLocaleString()}{" "}
            VND
          </p>

          <div className="mt-2">
            <label>Phương thức thanh toán:</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setShowQRCode(false);
                setPaymentUrl(null);
              }}
              className="border p-2 w-full mt-1"
            >
              <option value="cash">Tiền mặt</option>
              <option value="vnpay">VNPay</option>
            </select>
          </div>

          {paymentMethod !== "vnpay" && (
            <div className="mt-2">
              <label>Khách thanh toán:</label>
              <input
                type="number"
                min="0"
                value={customerPaid || ""}
                onChange={(e) => setCustomerPaid(Number(e.target.value) || 0)}
                className="border p-2 w-full mt-1"
              />
              <p className="mt-2">
                Tiền thừa trả khách: {changeAmount.toLocaleString()} VND
              </p>
            </div>
          )}

          <button
            onClick={handlePayment}
            className="bg-blue-600 text-white w-full py-2 mt-4 rounded"
            disabled={!activeOrderIndex && activeOrderIndex !== 0}
          >
            {paymentMethod === "vnpay" ? "Chuyển đến VNPay" : "Thanh toán"}
          </button>

          {paymentMethod === "vnpay" && showQRCode && paymentUrl && (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p className="text-lg font-semibold mb-2">Thanh toán chuyển khoản</p>
        <p className="text-sm mb-4">Vui lòng quét mã QR để thanh toán.</p>
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", display: "inline-block" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
                <img src="/path/to/vietqr-logo.png" alt="VietQR" style={{ height: "30px", marginRight: "10px" }} />
                <img src="/path/to/vietcombank-logo.png" alt="Vietcombank" style={{ height: "30px" }} />
            </div>
            <QRCode
                value={paymentUrl}
                size={200}
                level="H"
            />
            <p className="mt-2 text-sm font-medium">
                THE BOY
            </p>
            <p className="text-sm">
                Số tài khoản: 1017095584
            </p>
            <p className="text-sm">
                Số tiền: {(currentOrder.totalAmount - calculatedDiscount).toLocaleString()} VND
            </p>
            <p className="text-sm">
                Mã giao dịch: HD1-{currentOrder.id}
            </p>
        </div>
        <div className="mt-4 flex justify-center space-x-2">
            <button
                onClick={() => {
                    setShowQRCode(false);
                    setPaymentUrl(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded"
            >
                Hủy
            </button>
            <button
                onClick={async () => {
                    const paymentData = {
                        customerId: selectedCustomer === "walk-in" ? -1 : selectedCustomer,
                        voucherId: selectedVoucher ? vouchers.find((v) => v.voucherCode === selectedVoucher)?.id : null,
                    };
                    await SalePOS.completePayment(currentOrder.id, paymentData);
                    handleRemoveOrder(activeOrderIndex);
                    resetAfterPayment();
                    await fetchProductDetails();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Đã thanh toán
            </button>
        </div>
    </div>
)}
        </div>
      </div>
    </div>
  );
};

export default SalePOSPage;
