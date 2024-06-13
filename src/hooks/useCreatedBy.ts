import apiClient from "@/lib/apiClient"
import { User } from "@/types/user.type"
import { useEffect, useState } from "react"

const useCreatedBy = (userId: string) => {

    const [user, setUser] = useState<User>();
    const [error, setError] = useState(null);

    const fetchUserCreated = async() => {
        try {
            const response = await apiClient.get(`/users/${userId}`);
            console.log(response.data);
            if(response && response.data) {
                setUser(response.data);
            }
        } catch (error: any) {
            setError(error);
        }
    }
    useEffect(() => {
        fetchUserCreated();
    }, []);

    return { user, error };
}

export default useCreatedBy;