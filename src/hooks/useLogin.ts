import useAuthStore from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { LoginRequest, LoginResponse } from "@/types/auth.type";
import { useRouter } from "next/router";
import useUserStore from "@/stores/userStore";
import Cookies from 'js-cookie';

const fetchLogin = async (credentials: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
    );
    return response.data;
};


const useLogin = (handleLoginError: (error: any) => void) => {
    const setTokens = useAuthStore((state) => state.setTokens);
    const router = useRouter();
    const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

    return useMutation({
        mutationFn: (credentials: LoginRequest) => fetchLogin(credentials),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data;
            setTokens(accessToken, refreshToken);
            Cookies.set('accessToken', accessToken, { expires: 1 / 24 });
            Cookies.set('refreshToken', refreshToken, { expires: 1 });
            fetchUserProfile();
            router.replace("/dashboard");
        },
    });

};

export default useLogin;
