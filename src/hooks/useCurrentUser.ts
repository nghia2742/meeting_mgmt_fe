import apiClient from "@/lib/apiClient"
import { User } from "@/types/user.type"
import { useEffect, useState } from "react"

const useCurrentUser = async() => {

    const [user, setUser] = useState<User>();
    const [error, setError] = useState(null);

    const fetchCurrentUser = async() => {
        try {
            const response = await apiClient.get('/users/profile');
            if(response && response.data) {
                setUser(response.data);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return { user, error };
}

export default useCurrentUser;