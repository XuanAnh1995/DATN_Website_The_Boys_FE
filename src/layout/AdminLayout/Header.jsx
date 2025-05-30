import { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";
import LoginInfoService from "../../services/LoginInfoService";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy trạng thái user từ Redux
  const { isLoggedIn, name } = useSelector((state) => state.user);

  // Lấy thông tin người dùng khi component mount hoặc khi cần
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await LoginInfoService.getCurrentUser();
        console.log("Thông tin người dùng: ", user);
        setUserInfo(user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    if (isLoggedIn) {
      fetchUserInfo();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
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
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              Hồ sơ cá nhân
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        )}

        {/* Modal hiển thị thông tin hồ sơ cá nhân */}
        {showProfile && userInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
              <div className="space-y-2">
                <p>
                  <strong>Họ và tên:</strong> {userInfo.fullname || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email || "N/A"}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {userInfo.phone || "N/A"}
                </p>
                <p>
                  <strong>Mã nhân viên:</strong>{" "}
                  {userInfo.employeeCode || "N/A"}
                </p>
                <p>
                  <strong>Quyền:</strong> {userInfo.role?.name || "N/A"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {userInfo.address || "N/A"}
                </p>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                onClick={closeProfile}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
