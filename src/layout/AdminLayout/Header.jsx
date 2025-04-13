import { useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

    // Lấy trạng thái user từ Redux
    const { isLoggedIn, name } = useSelector((state) => state.user);

    const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
    };

  return (
<div className="bg-white text-dark flex justify-between items-center px-6 py-3 shadow-md">

      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="relative">
        <button
          className="flex items-center gap-2 text-dark hover:text-gray-500"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden sm:inline">Admin</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Hồ sơ cá nhân
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" onClick={handleLogout} >
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
