// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import CartService from "../../services/CartService";

// function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const [localQuantities, setLocalQuantities] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const items = await CartService.getAllCartItems();
//         setCartItems(items);

//         const initialQuantities = {};
//         items.forEach((item) => {
//           initialQuantities[item.id] = item.quantity;
//         });
//         setLocalQuantities(initialQuantities);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   const handleRemoveItem = async (cartItemId) => {
//     try {
//       await CartService.removeProductFromCart(cartItemId);
//       setCartItems((prevItems) =>
//         prevItems.filter((item) => item.id !== cartItemId)
//       );
//       setLocalQuantities((prev) => {
//         const newQuantities = { ...prev };
//         delete newQuantities[cartItemId];
//         return newQuantities;
//       });
//     } catch (error) {
//       console.error("Error removing product from cart:", error);
//     }
//   };

//   const handleQuantityInputChange = (cartItemId, value) => {
//     if (value === "" || /^[0-9]+$/.test(value)) {
//       setLocalQuantities((prev) => ({ ...prev, [cartItemId]: value }));
//     }
//   };

//   const handleQuantityBlur = async (cartItemId) => {
//     let newQuantity = parseInt(localQuantities[cartItemId]) || 1;

//     if (newQuantity < 1) newQuantity = 1;

//     try {
//       const updatedItem = await CartService.updateCartItemQuantity(
//         cartItemId,
//         newQuantity
//       );
//       setCartItems((prevItems) =>
//         prevItems.map((item) => (item.id === cartItemId ? updatedItem : item))
//       );
//     } catch (error) {
//       console.error("Error updating cart item quantity:", error);
//     }
//   };

//   const proceedToPayment = () => {
//     const totalAmount = cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//     const checkoutState = {
//       items: cartItems,
//       totalAmount: totalAmount,
//       totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
//     };

//     console.log("Checkout State:", checkoutState); // Debugging line

//     navigate("/pay", { state: checkoutState });
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg mx-auto max-w-3xl mt-10">
//         <div className="text-center">
//           <h2 className="mt-2 text-2xl font-bold text-gray-900">
//             Giỏ hàng của bạn đang trống
//           </h2>
//           <p className="mt-2 text-gray-500 max-w-md mx-auto">
//             Hãy quay lại cửa hàng để chọn những sản phẩm yêu thích của bạn.
//           </p>
//           <div className="mt-8">
//             <button
//               onClick={() => navigate("/")}
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
//             >
//               Tiếp tục mua sắm
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">
//           Giỏ hàng của bạn
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="divide-y divide-gray-200">
//                 {cartItems.map((item) => (
//                   <div
//                     key={item.id}
//                     className="px-6 py-6 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
//                         <img
//                           src={item.photo}
//                           alt={item.productName}
//                           className="h-full w-full object-cover object-center"
//                         />
//                       </div>
//                       <div className="ml-4 flex-1">
//                         <h2 className="text-lg font-medium text-gray-900">
//                           {item.productName}
//                         </h2>
//                         <p className="text-sm text-gray-500">
//                           {item.productDetailName}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Thương hiệu: {item.brandName}
//                         </p>
//                       </div>
//                       <div className="flex items-center">
//                         <button
//                           onClick={() =>
//                             handleQuantityInputChange(
//                               item.id,
//                               Math.max(
//                                 1,
//                                 (parseInt(localQuantities[item.id]) || 1) - 1
//                               )
//                             )
//                           }
//                           className="px-3 py-1 text-orange-500 hover:bg-orange-50 transition-colors"
//                         >
//                           −
//                         </button>
//                         <input
//                           type="text"
//                           value={localQuantities[item.id] || ""}
//                           onChange={(e) =>
//                             handleQuantityInputChange(item.id, e.target.value)
//                           }
//                           onBlur={() => handleQuantityBlur(item.id)}
//                           className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                         />
//                         <button
//                           onClick={() =>
//                             handleQuantityInputChange(
//                               item.id,
//                               (parseInt(localQuantities[item.id]) || 1) + 1
//                             )
//                           }
//                           className="px-3 py-1 text-orange-500 hover:bg-orange-50 transition-colors"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <div className="ml-4">
//                         <button
//                           onClick={() => handleRemoveItem(item.id)}
//                           className="text-sm text-red-600 hover:text-red-800"
//                         >
//                           Xóa
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow sticky top-8">
//               <div className="px-6 py-6">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Tóm tắt đơn hàng
//                 </h2>
//                 <div className="mt-6 space-y-4">
//                   <div className="flex justify-between items-center">
//                     <p className="text-gray-600">Tổng sản phẩm</p>
//                     <p className="text-gray-900 font-medium">
//                       {cartItems.reduce(
//                         (total, item) => total + item.quantity,
//                         0
//                       )}{" "}
//                       sản phẩm
//                     </p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-gray-600">Tổng tạm tính</p>
//                     <p className="text-gray-900 font-medium">
//                       {cartItems
//                         .reduce(
//                           (total, item) => total + item.price * item.quantity,
//                           0
//                         )
//                         .toLocaleString()}
//                       ₫
//                     </p>
//                   </div>
//                   <div className="border-t border-gray-200 pt-4 mt-4">
//                     <div className="flex justify-between items-center text-lg font-bold">
//                       <p className="text-gray-900">Tổng tiền</p>
//                       <p className="text-2xl text-orange-600">
//                         {cartItems
//                           .reduce(
//                             (total, item) => total + item.price * item.quantity,
//                             0
//                           )
//                           .toLocaleString()}
//                         ₫
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <button
//                     onClick={proceedToPayment}
//                     className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-sm transition-colors"
//                   >
//                     Tiến hành thanh toán
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cart;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartService from "../../services/CartService";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]); // Danh sách sản phẩm được chọn
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCartItems = async () => {
    try {
      const items = await CartService.getAllCartItems();
      if (items && items.length > 0) {
        setCartItems(items);
        const quantities = {};
        items.forEach((item) => {
          quantities[item.id] = Math.min(
            item.quantity,
            item.maxQuantity || Infinity
          );
        });
        setLocalQuantities(quantities);
        // Mặc định chọn tất cả sản phẩm
        setSelectedItems(items.map((item) => item.id));
      } else {
        setCartItems([]);
        setLocalQuantities({});
        setSelectedItems([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng.");
    }
  };

  useEffect(() => {
    const paymentSuccess = location.state?.paymentSuccess;
    if (paymentSuccess && location.state?.orderedItemIds) {
      // Lọc bỏ các sản phẩm đã thanh toán
      setCartItems((prev) =>
        prev.filter((item) => !location.state.orderedItemIds.includes(item.id))
      );
      setLocalQuantities((prev) => {
        const newQuantities = { ...prev };
        location.state.orderedItemIds.forEach((id) => delete newQuantities[id]);
        return newQuantities;
      });
      setSelectedItems((prev) =>
        prev.filter((id) => !location.state.orderedItemIds.includes(id))
      );
      toast.success(
        "Đặt hàng thành công! Các sản phẩm đã chọn đã được xóa khỏi giỏ."
      );
    } else {
      fetchCartItems();
    }
  }, [location.state]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item) return;

    const maxQty = item.maxQuantity || Infinity;
    if (newQuantity > maxQty) {
      toast.warn(`Số lượng tối đa trong kho là ${maxQty}!`);
      setLocalQuantities((prev) => ({ ...prev, [cartItemId]: maxQty }));
      return;
    }

    try {
      const updatedItem = await CartService.updateCartItemQuantity(
        cartItemId,
        newQuantity
      );
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === cartItemId ? updatedItem : item))
      );
      setLocalQuantities((prev) => ({ ...prev, [cartItemId]: newQuantity }));
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Không thể cập nhật số lượng.");
    }
  };

  const handleIncrease = (cartItemId, maxQuantity) => {
    const currentQuantity = localQuantities[cartItemId] || 1;
    const newQuantity = currentQuantity + 1;
    if (newQuantity > maxQuantity) {
      toast.warn(`Số lượng tối đa trong kho là ${maxQuantity}!`);
      return;
    }
    setLocalQuantities((prev) => ({ ...prev, [cartItemId]: newQuantity }));
    updateQuantity(cartItemId, newQuantity);
  };

  const handleDecrease = (cartItemId) => {
    const currentQuantity = localQuantities[cartItemId] || 1;
    const newQuantity = Math.max(1, currentQuantity - 1);
    if (newQuantity !== currentQuantity) {
      setLocalQuantities((prev) => ({ ...prev, [cartItemId]: newQuantity }));
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleQuantityChange = (cartItemId, value, maxQuantity) => {
    const parsedValue = parseInt(value) || 1;
    const newQuantity = Math.max(1, Math.min(parsedValue, maxQuantity));
    setLocalQuantities((prev) => ({ ...prev, [cartItemId]: newQuantity }));
    if (parsedValue > maxQuantity) {
      toast.warn(`Số lượng tối đa trong kho là ${maxQuantity}!`);
    }
    updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await CartService.removeProductFromCart(cartItemId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      setLocalQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[cartItemId];
        return newQuantities;
      });
      setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm.");
    }
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const proceedToPayment = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const invalidItems = selectedCartItems.filter(
      (item) => (localQuantities[item.id] || 1) > (item.maxQuantity || Infinity)
    );
    if (invalidItems.length > 0) {
      const errorMessage = invalidItems
        .map(
          (item) =>
            `${item.productName} (Số lượng: ${localQuantities[item.id]}, Tồn kho: ${item.maxQuantity})`
        )
        .join(", ");
      toast.error(
        `Không thể thanh toán! Số lượng vượt quá tồn kho cho các sản phẩm: ${errorMessage}. Vui lòng điều chỉnh số lượng.`
      );
      return;
    }

    const totalAmount = selectedCartItems.reduce(
      (total, item) => total + item.price * localQuantities[item.id],
      0
    );
    const checkoutState = {
      items: selectedCartItems.map((item) => ({
        ...item,
        quantity: localQuantities[item.id],
      })),
      totalAmount,
      totalItems: selectedCartItems.length,
    };
    navigate("/pay", { state: checkoutState });
  };

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg shadow-lg mx-auto max-w-3xl mt-10">
        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Giỏ hàng trống
        </h2>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm!
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors shadow-md"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center lg:text-left">
          Giỏ hàng của bạn
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-6 flex items-center border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-4 h-5 w-5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full text-gray-500 text-xs">
                        Không có ảnh
                      </span>
                    )}
                  </div>
                  <div className="ml-6 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.productName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {item.productDetailName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Thương hiệu: {item.brandName}
                    </p>
                    <p className="text-base font-medium text-orange-600 mt-1">
                      {(item.price || 0).toLocaleString()}₫
                    </p>
                    <p className="text-xs text-gray-500">
                      Tồn kho: {item.maxQuantity || "Không giới hạn"}
                    </p>
                  </div>
                  <div className="ml-6 flex items-center space-x-2">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={localQuantities[item.id] <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={localQuantities[item.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          e.target.value,
                          item.maxQuantity || Infinity
                        )
                      }
                      className="w-16 text-center border border-gray-300 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="1"
                      max={item.maxQuantity || undefined}
                    />
                    <button
                      onClick={() =>
                        handleIncrease(item.id, item.maxQuantity || Infinity)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={
                        localQuantities[item.id] >=
                        (item.maxQuantity || Infinity)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-6 text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {(
                        (item.price || 0) * (localQuantities[item.id] || 1)
                      ).toLocaleString()}
                      ₫
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 sticky top-8 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng sản phẩm được chọn:</span>
                  <span className="font-medium">
                    {selectedItems.length} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-medium">
                    {cartItems
                      .filter((item) => selectedItems.includes(item.id))
                      .reduce(
                        (total, item) =>
                          total + item.price * localQuantities[item.id],
                        0
                      )
                      .toLocaleString()}
                    ₫
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Tổng thanh toán:</span>
                    <span className="text-orange-600">
                      {cartItems
                        .filter((item) => selectedItems.includes(item.id))
                        .reduce(
                          (total, item) =>
                            total + item.price * localQuantities[item.id],
                          0
                        )
                        .toLocaleString()}
                      ₫
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={proceedToPayment}
                className="w-full mt-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors shadow-md"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
