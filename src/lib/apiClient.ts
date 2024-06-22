import axios from "axios";
import useAuthStore from "@/stores/authStore";
import { GetServerSidePropsContext } from "next";
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        // const { accessToken, refreshToken } = useAuthStore.getState();
        // if (accessToken) {
        //     config.headers["Authorization"] = `Bearer ${accessToken}`;
        // } 
        // // else {
        // //     config.headers["Authorization"] = `Bearer ${refreshToken}`;
        // // }
        // return config;
        
        const accessToken = Cookies.get('accessToken') || '';
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.data.statusCode === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

            if (refreshToken) {
                try {
                    const response = await apiClient.post(
                        "/auth/refresh-token",
                        { refreshToken },
                        { withCredentials: true }
                    );
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                        response.data;
                    setTokens(newAccessToken, newRefreshToken);
                    Cookies.set('accessToken', newAccessToken, { expires: 1 / 24 });
                    Cookies.set('refreshToken', refreshToken, { expires: 1 });
                    apiClient.defaults.headers[
                        "Authorization"
                    ] = `Bearer ${newAccessToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    return apiClient(originalRequest);
                } catch (e) {
                    clearTokens();
                    return Promise.reject(e);
                }
            } else {
                clearTokens();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
