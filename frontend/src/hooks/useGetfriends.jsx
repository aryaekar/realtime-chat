import {useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../context/authcontext";
import { useChatContext } from "../context/chatcontext";

const useGetFriends = () => {
    const {friends, setFriends, users, setUsers}=useChatContext();
    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${API_URL}/friends/${user._id}`);
                if (response.data) {
                    setFriends(response.data);
                    setUsers([...response.data, ...users]);
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        if (user) {
            fetchFriends();
        }
    }, [user]);

};

export default useGetFriends;