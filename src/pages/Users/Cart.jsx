import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartService from "../../services/CartService";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
        try {
          const items = await CartService.getAllCartItems();
          setCartItems(items);
  
          const initialQuantities = {};
          items.forEach(item => {
            initialQuantities[item.id] = item.quantity;
          });
          setLocalQuantities(initialQuantities);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };
  
      fetchCartItems();
    }, []);

    const handleRemoveItem = async (cartItemId) => {
      try {
        await CartService.removeProductFromCart(cartItemId);
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
        setLocalQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[cartItemId];
          return newQuantities;
        });
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    };

    const handleQuantityInputChange = (cartItemId, value) => {
      if (value === "" || /^[0-9]+$/.test(value)) { 
        setLocalQuantities((prev) => ({ ...prev, [cartItemId]: value }));
      }
    };

    const handleQuantityBlur = async (cartItemId) => {
      let newQuantity = parseInt(localQuantities[cartItemId]) || 1;  
  
      if (newQuantity < 1) newQuantity = 1;
  
      try {
        const updatedItem = await CartService.updateCartItemQuantity(cartItemId, newQuantity);
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.id === cartItemId ? updatedItem : item))
        );
      } catch (error) {
        console.error("Error updating cart item quantity:", error);
      }
    };

  const proceedToPayment = () => {
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const checkoutState = {
      items: cartItems,
      totalAmount: totalAmount,
      totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
    };

    console.log("Checkout State:", checkoutState); // Debugging line

    navigate("/pay", { state: checkoutState });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg mx-auto max-w-3xl mt-10">
        <div className="text-center">
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Hãy quay lại cửa hàng để chọn những sản phẩm yêu thích của bạn.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={item.photo}
                          alt={item.productName}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h2 className="text-lg font-medium text-gray-900">{item.productName}</h2>
                        <p className="text-sm text-gray-500">{item.productDetailName}</p>
                        <p className="text-sm text-gray-500">Thương hiệu: {item.brandName}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityInputChange(item.id, Math.max(1, (parseInt(localQuantities[item.id]) || 1) - 1))}
                          className="px-3 py-1 text-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={localQuantities[item.id] || ""}
                          onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                          onBlur={() => handleQuantityBlur(item.id)}
                          className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          onClick={() => handleQuantityInputChange(item.id, (parseInt(localQuantities[item.id]) || 1) + 1)}
                          className="px-3 py-1 text-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Tổng sản phẩm</p>
                    <p className="text-gray-900 font-medium">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Tổng tạm tính</p>
                    <p className="text-gray-900 font-medium">
                      {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}₫
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <p className="text-gray-900">Tổng tiền</p>
                      <p className="text-2xl text-orange-600">
                        {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={proceedToPayment}
                    className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-sm transition-colors"
                  >
                    Tiến hành thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;