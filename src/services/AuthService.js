import api from "../ultils/api";
import store from "../store";
import { setUser } from "../store/userSlice";

const AuthService = {
  async login(credentials, rememberMe = false) {
    try {
      const response = await api.post(`/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, username, role, fullName, email } = response.data.data;

      if (rememberMe) {
        document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; Secure; SameSite=Strict`;
        document.cookie = `role=${role}; path=/; max-age=${30 * 24 * 60 * 60}; Secure; SameSite=Strict`;
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  logout() {
    document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Strict";
    document.cookie = "role=; path=/; max-age=0; Secure; SameSite=Strict";
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  },

  getToken() {
    const tokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const tokenFromSession = sessionStorage.getItem("token");
    return tokenFromCookie || tokenFromSession || null;
  },

  getRole() {
    const roleFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
    const roleFromSession = sessionStorage.getItem("role");
    return roleFromCookie || roleFromSession || null;
  },

  restoreUserSession() {
    const token = this.getToken();
    const role = this.getRole();

    if (token && role) {
      store.dispatch(setUser({ name: "User", email: "", role, token }));
    }
  },

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Không tìm thấy token, vui lòng đăng nhập lại.");
      }

      const response = await api.get("/auth/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data.data;
      store.dispatch(setUser(user));
      return user;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw (
        error.response?.data || {
          message: "Không thể lấy thông tin người dùng.",
        }
      );
    }
  },

  async getCurrentUserAddresses() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Không tìm thấy token, vui lòng đăng nhập lại.");
      }

      const response = await api.get("/auth/current-user/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ người dùng:", error);
      throw (
        error.response?.data || { message: "Không thể lấy địa chỉ người dùng." }
      );
    }
  },
};

export default AuthService;
