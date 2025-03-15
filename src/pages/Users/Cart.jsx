import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartView = () => {
  const navigate = useNavigate();

  return (
    <section className="p-6 mt-4 bg-gray-100 rounded-lg shadow-lg text-center">
      <div className="flex flex-col items-center justify-center py-10">
        <FaShoppingCart className="text-6xl text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-700 mt-4">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-500">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-red-700"
        >
          <FaArrowLeft /> Tiếp tục mua sắm
        </button>
      </div>
    </section>
  );
};

export default CartView;
