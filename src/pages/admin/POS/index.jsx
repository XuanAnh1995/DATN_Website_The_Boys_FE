import React, { useState, useEffect, useMemo } from "react";
import SalePOS from "../../../services/POSService";
import ColorService from "../../../services/ColorService";
import SizeService from "../../../services/SizeService";
import CustomerService from "../../../services/CustomerService";
import { FaShoppingCart, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";
import { debounce } from "lodash";
import { data } from "autoprefixer";

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

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [orderTimers, setOrderTimers] = useState({});

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

  // Thêm state hasSelectedVoucher
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

  useEffect(() => {
    fetchProductDetails();
    fetchCustomers();
    fetchVouchers();
    fetchColors();
    fetchSizes();
  }, []);

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

  // Cập nhật logic áp dụng voucher tự động
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

      const sortedVouchers = vouchersWithDiscount.sort(
        (a, b) => b.discountValue - a.discountValue
      );

      const bestVoucher = sortedVouchers[0];
      setOptimalVoucher(bestVoucher || null);

      // Chỉ tự động áp dụng nếu người dùng chưa chọn voucher thủ công
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
  }, [currentOrder.totalAmount, vouchers, hasSelectedVoucher]); // Thêm hasSelectedVoucher vào dependencies

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

    console.log("Từ khóa tìm kiếm:", keyword);
    console.log("Danh sách khách hàng:", customers);
    console.log("Kết quả tìm kiếm:", results);

    setFilteredCustomers(results);
    setIsSearching(false);
  };

  // Cập nhật hàm handleVoucherChange
  const handleVoucherChange = (voucherCode) => {
    console.log("📌 Voucher được chọn:", voucherCode);

    setSelectedVoucher(voucherCode);
    setHasSelectedVoucher(true); // Đánh dấu rằng người dùng đã chọn voucher

    const voucher = vouchers.find((v) => v.voucherCode === voucherCode);

    console.log("📌 Voucher tìm thấy:", voucher);

    if (voucher && currentOrder.totalAmount >= voucher.minCondition) {
      const discountAmount = calculateDiscount(
        voucher,
        currentOrder.totalAmount
      );

      console.log("✅ Giảm giá áp dụng:", discountAmount);

      setCalculatedDiscount(discountAmount);
      if (activeOrderIndex !== null) {
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          updatedOrders[activeOrderIndex].voucherId = voucher.id;
          return updatedOrders;
        });
      }
    } else {
      console.log("❌ Không đủ điều kiện để áp dụng voucher.");

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
    return Math.min(
      (totalAmount * voucher.reducedPercent) / 100,
      voucher.maxDiscount
    );
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
    console.log("🔄 Resetting newCustomer...");
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
    console.log("📝 [TẠO HÓA ĐƠN] Bắt đầu tạo hóa đơn mới...");
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

      setOrders((prevOrders) => {
        const updatedOrders = [
          ...prevOrders,
          {
            id: newOrder.id,
            items: [],
            totalAmount: 0,
            discount: 0,
            customerId: orderData.customerId,
            voucherId: orderData.voucherId,
            paymentMethod: orderData.paymentMethod,
            createdAt: new Date(),
          },
        ];

        // Thêm thông báo khi tạo hóa đơn thành công
        setNotification({
          type: "success",
          message: `Đã tạo hóa đơn #${updatedOrders.length} thành công!`,
        });

        // Tự động xóa thông báo sau 3 giây
        setTimeout(() => {
          setNotification(null);
        }, 3000);

        console.log("✅ [SUCCESS] Đơn hàng mới đã được tạo:", newOrder);
        return updatedOrders;
      });

      setActiveOrderIndex(orders.length);
      setHasSelectedVoucher(false); // Reset để áp dụng bestVoucher cho hóa đơn mới
    } catch (error) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error);
      setNotification({
        type: "error",
        message: "Lỗi khi tạo hóa đơn mới. Vui lòng thử lại!",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order) => ({
        ...order,
        createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
      }));
      setOrders(parsedOrders);

      const initialTimers = {};
      parsedOrders.forEach((order, index) => {
        if (order.createdAt) {
          const elapsed = Math.floor(
            (new Date() - new Date(order.createdAt)) / 1000
          );
          const maxTime = 30 * 60;
          initialTimers[index] = Math.max(maxTime - elapsed, 0);
        }
      });
      setOrderTimers(initialTimers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrderTimers((prevTimers) => {
        const newTimers = {};
        const updatedOrders = [...orders];

        orders.forEach((order, index) => {
          if (order.createdAt) {
            const elapsed = Math.floor(
              (new Date() - new Date(order.createdAt)) / 1000
            );
            const maxTime = 30 * 60;
            const remainingTime = Math.max(maxTime - elapsed, 0);
            newTimers[index] = remainingTime;

            if (remainingTime <= 0 && updatedOrders[index]) {
              updatedOrders.splice(index, 1);
              if (activeOrderIndex === index) {
                setActiveOrderIndex(null);
              } else if (activeOrderIndex > index) {
                setActiveOrderIndex(activeOrderIndex - 1);
              }
              setNotification({
                type: "warning",
                message: `Hóa đơn #${index + 1} đã hết thời gian chờ và bị xóa.`,
              });
            }
          }
        });

        if (updatedOrders.length !== orders.length) {
          setOrders(updatedOrders);
        }

        return newTimers;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orders, activeOrderIndex]);

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

    console.log("📌 Nhận mã vạch:", scannedBarcode);
    console.log(
      "📌 [CHECK] activeOrderIndex:",
      activeOrderIndex,
      "orders.length:",
      orders.length
    );

    if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
      alert("⚠ Bạn cần chọn hóa đơn trước khi quét mã vạch!");
      return;
    }

    const product = allProducts.find(
      (p) => p.productDetailCode === scannedBarcode
    );

    if (product) {
      if (product.quantity <= 0) {
        alert(`Sản phẩm "${product.product?.productName}" đã hết hàng!`);
        console.warn(
          `⚠ Sản phẩm ${product.id} đã hết hàng (số lượng: ${product.quantity}).`
        );
        return;
      }
      console.log("✅ Tìm thấy sản phẩm:", product);
      handleAddToCart(product);
    } else {
      alert("⚠ Không tìm thấy sản phẩm với mã vạch này!");
    }
  };

  const handleAddToCart = (product) => {
    console.log("🛒 [THÊM VÀO GIỎ HÀNG] Bắt đầu thêm sản phẩm vào giỏ hàng...");
    if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
      alert("Vui lòng tạo hóa đơn trước!");
      console.warn("⚠ Không có đơn hàng nào được chọn. Hãy tạo đơn hàng trước!");
      return;
    }

    if (product.quantity <= 0) {
      alert(`Sản phẩm ${product.product?.productName} đã hết hàng !`);
      return;
    }

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const currentOrder = updatedOrders[activeOrderIndex];

      console.log("📌 [ĐƠN HÀNG] Đơn hàng hiện tại:", currentOrder);

      const existingItemIndex = currentOrder.items.findIndex(
        (item) => item.id === product.id
      );
      if (existingItemIndex !== -1) {
        const existingItem = currentOrder.items[existingItemIndex];

        if (existingItem.quantity >= product.quantity) {
          alert(
            `Sản phẩm "${product.product?.productName}" chỉ còn ${product.quantity} sản phẩm trong kho.`
          );
          return updatedOrders;
        }

        console.log(
          `🔄 [CẬP NHẬT] Sản phẩm ${product.id} đã có trong giỏ hàng, tăng số lượng lên.`
        );
        currentOrder.items[existingItemIndex].quantity += 1;
      } else {
        console.log(`➕ [MỚI] Thêm sản phẩm mới:`, product);
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

      console.log(
        "💰 [TỔNG] Tổng tiền đơn hàng sau khi thêm sản phẩm:",
        currentOrder.totalAmount
      );

      // Thêm thông báo khi thêm sản phẩm thành công
      setNotification({
        type: "success",
        message: `Đã thêm sản phẩm "${product.product?.productName}" vào giỏ hàng!`,
      });

      // Tùy chọn: Xóa thông báo sau vài giây
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return updatedOrders;
    });
  };
  const handleRemoveFromCart = (productId) => {
    console.log("🗑 [XÓA KHỎI GIỎ HÀNG] Bắt đầu xóa sản phẩm khỏi giỏ hàng...");
    if (activeOrderIndex === null) {
      console.warn("⚠ Không có đơn hàng nào được chọn.");
      alert("Vui lòng chọn hoặc tạo hóa đơn!");
      return;
    }

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const currentOrder = updatedOrders[activeOrderIndex];

      console.log(
        "📌 [ORDER] Trước khi xóa, danh sách sản phẩm:",
        currentOrder.items
      );

      // Lấy thông tin sản phẩm trước khi xóa để hiển thị trong thông báo
      const productToRemove = currentOrder.items.find(
        (item) => item.id === productId
      );

      // Xóa sản phẩm
      currentOrder.items = currentOrder.items.filter(
        (item) => item.id !== productId
      );

      currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
        const salePrice = Number(item.salePrice) || 0;
        const discountPercent = Number(item.promotion?.promotionPercent) || 0;
        const discountedPrice = salePrice * (1 - discountPercent / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);

      console.log(
        "💰 [TỔNG] Tổng tiền sau khi xóa sản phẩm:",
        currentOrder.totalAmount
      );
      console.log("✅ [SUCCESS] Sản phẩm đã được xóa thành công!");

      // Thêm thông báo khi xóa sản phẩm thành công
      if (productToRemove) {
        setNotification({
          type: "success",
          message: `Đã xóa sản phẩm "${productToRemove.product?.productName}" khỏi giỏ hàng!`,
        });

        // Tự động xóa thông báo sau 3 giây
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }

      return updatedOrders;
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (activeOrderIndex === null) {
      console.warn("⚠ Không có đơn hàng nào được chọn.");
      return;
    }

    if (newQuantity <= 0) {
      console.warn(
        `⚠ Số lượng sản phẩm ID ${productId} không hợp lệ (${newQuantity}).`
      );
      return;
    }

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const currentOrder = updatedOrders[activeOrderIndex];

      const itemIndex = currentOrder.items.findIndex(
        (item) => item.id === productId
      );

      if (itemIndex !== -1) {
        console.log(
          `🔄 [UPDATE] Cập nhật số lượng sản phẩm ID ${productId} từ ${currentOrder.items[itemIndex].quantity} → ${newQuantity}`
        );
        currentOrder.items[itemIndex].quantity = newQuantity;
      } else {
        console.warn(
          `⚠ Không tìm thấy sản phẩm ID ${productId} trong giỏ hàng!`
        );
        return updatedOrders;
      }

      currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
        const salePrice = Number(item.salePrice) || 0;
        const discountPercent = Number(item.promotion?.promotionPercent) || 0;
        const discountedPrice = salePrice * (1 - discountPercent / 100);
        return sum + discountedPrice * item.quantity;
      }, 0);

      console.log(
        "💰 [TOTAL] Tổng tiền đơn hàng sau khi cập nhật số lượng:",
        currentOrder.totalAmount
      );
      console.log("✅ [SUCCESS] Cập nhật số lượng thành công!");
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
    console.log(`🗑 [XÓA HÓA ĐƠN] Bắt đầu xóa hóa đơn #${index + 1}...`);
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      updatedOrders.splice(index, 1);

      // Thêm thông báo khi xóa hóa đơn thành công
      setNotification({
        type: "success",
        message: `Đã xóa hóa đơn #${index + 1} thành công!`,
      });

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      console.log("✅ [SUCCESS] Hóa đơn đã được xóa thành công!");
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
      console.error("❌ Lỗi khi tạo URL thanh toán VNPay:", error);
      alert("Lỗi khi tạo URL thanh toán: " + error.message);
    }
  };

  const handlePayment = async () => {
    if (activeOrderIndex === null) {
      console.log("⚠ Không có hóa đơn nào được chọn.");
      alert("Vui lòng chọn hoặc tạo hóa đơn!");
      return;
    }

    const currentOrder = orders[activeOrderIndex];
    if (currentOrder.items.length === 0) {
      console.log("⚠ Giỏ hàng trống!");
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm!");
      return;
    }

    if (!selectedCustomer) {
      console.log("⚠ Không có khách hàng nào được chọn.");
      alert("Vui lòng chọn khách hàng!");
      return;
    }

    const amountToPay = currentOrder.totalAmount - calculatedDiscount;

    if (paymentMethod === "cash") {
      if (customerPaid < amountToPay) {
        console.log("⚠ Số tiền khách thanh toán không đủ.");
        alert(
          `Số tiền khách thanh toán (${customerPaid.toLocaleString()} VND) không đủ. Khách cần trả ít nhất ${amountToPay.toLocaleString()} VND.`
        );
        return;
      }
    }

    const confirmMessage = `Bạn có chắc chắn muốn thanh toán?\n\nTổng tiền: ${currentOrder.totalAmount.toLocaleString()} VND\nGiảm giá: ${calculatedDiscount.toLocaleString()} VND\nKhách phải trả: ${amountToPay.toLocaleString()} VND\nPhương thức: ${paymentMethod === "cash" ? "Tiền mặt" : "VNPay"}${paymentMethod === "cash" ? `\nKhách thanh toán: ${customerPaid.toLocaleString()} VND\nTiền thừa: ${changeAmount.toLocaleString()} VND` : ""}`;
    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      console.log("❌ Người dùng đã hủy thanh toán.");
      return;
    }

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
          console.log("QR Data:", qrData);
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
          console.log("✅ Thanh toán thành công!");
          handleRemoveOrder(activeOrderIndex);
          resetAfterPayment();
          await fetchProductDetails();
        } else {
          throw new Error("Thanh toán thất bại!");
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán: " + error.message);
    }
  };

  // Cập nhật hàm resetAfterPayment
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

      {/* Hiển thị thông báo */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white ${notification.type === "success"
            ? "bg-green-500"
            : notification.type === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
            }`}
        >
          {notification.message}
        </div>
      )}




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
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${formErrors.fullname ? "border-red-500" : "border-gray-300"
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
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${formErrors.phone ? "border-red-500" : "border-gray-300"
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
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${formErrors.email ? "border-red-500" : "border-gray-300"
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
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
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
          {orders.map((order, index) => {
            const remainingTime = orderTimers[index] !== undefined
              ? orderTimers[index]
              : order.createdAt
                ? Math.max(
                  30 * 60 - Math.floor((new Date() - new Date(order.createdAt)) / 1000),
                  0
                )
                : 30 * 60;

            return (
              <div
                key={order.id}
                className={`min-w-[150px] cursor-pointer p-2 mr-2 rounded ${index === activeOrderIndex ? "bg-blue-100 border border-blue-500" : "bg-gray-100"
                  }`}
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
                <div className="text-sm text-gray-500">
                  Thời gian còn lại: {`${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')} phút`}
                </div>
              </div>
            );
          })}
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
                              alert(
                                `Sản phẩm "${item.product?.productName}" chỉ còn ${item.quantityAvailable} sản phẩm trong kho.`
                              );
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
                    className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
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
                filteredCustomers.length === 0 &&
                !selectedCustomer && (
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
                  return discountB - discountA;
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
              <option value="">Không sử dụng voucher</option> {/* Thêm tùy chọn không sử dụng voucher */}
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
                  includeMargin={true}
                />
                <div style={{ marginTop: "10px" }}>
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Mở URL thanh toán trực tiếp
                    </button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalePOSPage;