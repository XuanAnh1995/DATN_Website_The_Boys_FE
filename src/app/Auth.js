import { setUser } from '../store/userSlice';
import store from './store';

const CheckAuth = async () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      // Lưu thông tin người dùng vào Redux store
      store.dispatch(
        setUser({
          name: 'User', // Thay bằng dữ liệu thực tế
          email: 'user@example.com', // Thay bằng dữ liệu thực tế
          role, // Lưu vai trò
        })
      );
      resolve({ token, role });
    } else {
      reject('No token');
    }
  });
};

export default CheckAuth;