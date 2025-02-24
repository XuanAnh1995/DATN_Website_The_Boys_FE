//Tạo một hàm giả, kiểm tra xác thực người dùng
const CheckAuth = async () => {
  //Giả lập API để lấy token và role
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      resolve({ token, role });
    } else {
      reject("No token");
    }
  });
};
export default CheckAuth;
