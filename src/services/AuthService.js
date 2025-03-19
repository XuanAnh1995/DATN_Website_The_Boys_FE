import api from "../ultils/api";
import store from "../store";
import { setUser, logout } from "../store/userSlice";

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

            // Lưu vào Redux
            store.dispatch(
                setUser({
                    name: fullName,
                    email,
                    role,
                    token,
                })
            );

            return response.data;
        } catch (error) {
            console.log(error);
            throw error.response?.data || { message: "Login failed" };
        }
    },

    logout() {
        try {
            // Xóa token khỏi cookie
            document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Strict";
            document.cookie = "role=; path=/; max-age=0; Secure; SameSite=Strict";

            // Xóa token khỏi sessionStorage
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");

            // Cập nhật Redux store
            store.dispatch(logout());

            return { message: "Logged out successfully" };
        } catch (error) {
            console.error("Logout Error:", error);
            return { message: "Logout failed" };
        }
    },

    getToken() {
        // Lấy token từ cookie
        const tokenFromCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        // Lấy token từ sessionStorage
        const tokenFromSession = sessionStorage.getItem("token");

        // Lấy token từ localStorage
        const tokenFromLocal = localStorage.getItem("token");

        return tokenFromCookie || tokenFromSession || tokenFromLocal || null;
    },

    getRole() {
        // Lấy role từ cookie
        const roleFromCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("role="))
            ?.split("=")[1];

        // Lấy role từ sessionStorage
        const roleFromSession = sessionStorage.getItem("role");

        // Lấy role từ localStorage
        const roleFromLocal = localStorage.getItem("role");

        return roleFromCookie || roleFromSession || roleFromLocal || null;
    },

    restoreUserSession() {
        const token = this.getToken();
        const role = this.getRole();

        if (token && role) {
            store.dispatch(setUser({ name: "User", email: "", role, token }));
        }
    },
};

export default AuthService;
