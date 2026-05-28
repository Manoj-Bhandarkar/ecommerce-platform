import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest.url || "";
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !requestUrl.includes("/refresh") &&
            !requestUrl.includes("/login") && 
            !requestUrl.includes("/account/me")
        ) {
            originalRequest._retry = true;
            try {
                await api.post("/api/v1/account/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token expired");
                if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default api;