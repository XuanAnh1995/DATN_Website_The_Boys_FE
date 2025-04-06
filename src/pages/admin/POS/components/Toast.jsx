import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Toast = ({ type, message, onClose }) => {
  // Tự động đóng thông báo sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Xác định màu sắc dựa trên type
  const toastStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white flex items-center space-x-2 ${
        toastStyles[type] || "bg-gray-500"
      } animate-slide-in`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <FaTimes size={16} />
      </button>
    </div>
  );
};

export default Toast;