import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL_CHECKOUT = "/api/sale-pos";
const API_URL_PRODUCT_DETAIL = "/api/product-details";
const API_URL_CUSTOMERS = "/api/customers";
const API_URL_VOUCHERS = "/api/vouchers";
const API_Barcode = "/api/barcode/barcode";

const paymentMethodMapping = {
  cash: 0, // Tiền mặt
  vnpay: 1, // VNPay
};

const SalePOS = {
  /** 🛒 Lấy danh sách sản phẩm theo bộ lọc */
  getProductDetails: async (filters) => {
    console.log("📌 Lấy danh sách sản phẩm với bộ lọc:", filters);
    try {
      const response = await api.get(API_URL_PRODUCT_DETAIL, {
        params: filters,
      });
      console.log("✅ Danh sách sản phẩm:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy sản phẩm:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 🧑‍💼 Lấy danh sách khách hàng */
  getCustomers: async (filters) => {
    console.log("📌 Lấy danh sách khách hàng với bộ lọc:", filters);
    try {
      const response = await api.get(API_URL_CUSTOMERS, { params: filters });
      console.log("✅ Dữ liệu khách hàng:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy khách hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 📦 **Tạo đơn hàng rỗng** */
  createOrder: async (orderData) => {
    console.log("📌 Tạo đơn hàng:", orderData);
    try {
      // ✅ Chuyển paymentMethod từ String -> Integer
      orderData.paymentMethod =
        paymentMethodMapping[orderData.paymentMethod] ?? 0; // Mặc định là 0 (Tiền mặt)

      console.log(
        "🔍 Dữ liệu thực sự gửi đi:",
        JSON.stringify(orderData, null, 2)
      );

      const response = await api.post(`${API_URL_CHECKOUT}/orders`, orderData);
      console.log("✅ Đơn hàng tạo thành công:", response.data);

      if (!response.data || !response.data.data || !response.data.data.id) {
        throw new Error("Không thể tạo đơn hàng!");
      }

      return response.data.data; // Trả về orderId
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 🛍️ **Thêm sản phẩm vào đơn hàng** */
  addProductToCart: async (orderId, productData) => {
    console.log(`📌 Thêm sản phẩm vào đơn hàng ${orderId}: `, productData);
    try {
      const response = await api.post(
        `${API_URL_CHECKOUT}/orders/${orderId}/products`,
        productData
      );
      console.log("✅ Sản phẩm đã thêm vào đơn hàng:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi thêm sản phẩm vào đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 💳 **Thanh toán đơn hàng** */
  completePayment: async (orderId, paymentData) => {
    console.log(`📌 Hoàn tất thanh toán cho đơn hàng #${orderId}`);
    try {
      const response = await api.put(
        `${API_URL_CHECKOUT}/orders/${orderId}/payment`,
        paymentData
      );
      console.log("✅ Thanh toán hoàn tất:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi hoàn tất thanh toán:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 💳 Tạo URL thanh toán VNPay */
  async createVNPayPaymentUrl(orderId) {
    console.log(`📌 Tạo URL thanh toán VNPay cho đơn hàng #${orderId}`);
    try {
      const response = await api.post(
        `/payment/create-payment-url-pos/${orderId}`,
        {},
        {
          params: { isPOS: true }, // Chỉ định đơn hàng POS
        }
      );
      console.log("✅ URL thanh toán:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo URL thanh toán:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 🎟️ Lấy danh sách voucher */
  getVouchers: async () => {
    console.log("📌 Lấy danh sách voucher hợp lệ");
    try {
      const response = await api.get(API_URL_VOUCHERS);
      console.log("✅ Danh sách voucher hợp lệ:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách voucher:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // để gọi API /api/sale-pos/checkout
  updateOrderInfo: async (orderId, updateData) => {
    console.log(`📌 Cập nhật thông tin đơn hàng #${orderId}:`, updateData);
    try {
      const response = await api.post(`${API_URL_CHECKOUT}/checkout`, {
        orderId: orderId,
        customerId: updateData.customerId,
        voucherId: updateData.voucherId,
      });
      console.log("✅ Cập nhật thông tin đơn hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi cập nhật thông tin đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** ✅ **Checkout - Luồng chuẩn** */
  checkout: async (orderData) => {
    console.log("📌 Bắt đầu luồng thanh toán với đơn hàng:", orderData);
    try {
      let orderId = orderData.orderId ?? null;

      // Nếu không có orderId, tạo đơn hàng mới
      if (!orderId) {
        console.log("📌 Không có orderId, tiến hành tạo đơn hàng mới.");
        const orderResponse = await SalePOS.createOrder(orderData);
        orderId = orderResponse.id;
      } else {
        console.log("✅ Sử dụng orderId đã có:", orderId);
      }

      // Lấy chi tiết đơn hàng hiện tại từ backend
      const existingOrder = await SalePOS.getOrderDetails(orderId);
      const existingProducts = existingOrder.orderDetails || [];
      // So sánh orderDetails từ frontend với dữ liệu từ backend
      const productsToAdd = [];
      if (orderData.orderDetails && orderData.orderDetails.length > 0) {
        for (let item of orderData.orderDetails) {
          const existingItem = existingProducts.find(
            (existing) => existing.productDetail.id === item.productDetailId
          );
          if (!existingItem) {
            // Nếu sản phẩm chưa có trong đơn hàng, thêm vào danh sách cần thêm
            productsToAdd.push(item);
          } else {
            // Nếu sản phẩm đã có, kiểm tra xem số lượng có thay đổi không
            if (existingItem.quantity !== item.quantity) {
              // Cập nhật số lượng nếu cần (hoặc xử lý theo yêu cầu)
              console.log(
                `🔄 Sản phẩm ${item.productDetailId} đã có, nhưng số lượng thay đổi. Cũ: ${existingItem.quantity}, Mới: ${item.quantity}`
              );
              // Gọi API để cập nhật số lượng (nếu backend hỗ trợ)
              // await SalePOS.updateProductQuantity(orderId, item);
            }
          }
        }
      }

      // Thêm các sản phẩm mới vào đơn hàng (nếu có)
      if (productsToAdd.length > 0) {
        for (let item of productsToAdd) {
          await SalePOS.addProductToCart(orderId, item);
        }
        console.log("✅ Đã thêm các sản phẩm mới vào đơn hàng:", productsToAdd);
      } else {
        console.log("✅ Không có sản phẩm mới để thêm vào đơn hàng.");
      }

      // Cập nhật customerId và voucherId
      const paymentData = {
        customerId: orderData.customerId,
        voucherId: orderData.voucherId,
      };
      await SalePOS.updateOrderInfo(orderId, paymentData);
      console.log("✅ Đã cập nhật customerId và voucherId");

      // Nếu không phải VNPay, hoàn tất thanh toán ngay
      if (orderData.paymentMethod !== "vnpay") {
        console.log("🔍 Xử lý thanh toán tiền mặt cho đơn hàng:", orderId);
        const paymentResponse = await SalePOS.completePayment(
          orderId,
          paymentData
        );
        console.log("✅ Thanh toán thành công:", paymentResponse);
        return { orderId, paymentResponse };
      }

      // Nếu là VNPay, chỉ trả về orderId để frontend xử lý tiếp
      console.log("✅ Đơn hàng sẵn sàng cho VNPay:", orderId);
      return { orderId };
    } catch (error) {
      console.error(
        "❌ Lỗi khi checkout:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 🖨️ Lấy sản phẩm theo mã vạch */
  getProductByBarcode: async (barcode) => {
    console.log("📌 Lấy sản phẩm theo mã vạch:", barcode);
    try {
      const response = await api.get(API_Barcode);
      console.log("✅ Sản phẩm từ mã vạch:", response.data);
      return response.data; // Giả sử backend trả về dữ liệu sản phẩm
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy sản phẩm theo mã vạch:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /** 📋 Lấy chi tiết đơn hàng */
  getOrderDetails: async (orderId) => {
    console.log(`📌 Lấy chi tiết đơn hàng #${orderId}`);
    try {
      const response = await api.get(`${API_URL_CHECKOUT}/orders/${orderId}`);
      console.log("✅ Chi tiết đơn hàng:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy chi tiết đơn hàng:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default SalePOS;
