import { useChatContext } from "../context/chatcontext.jsx";
import axios from "axios";
import { useEffect } from "react";
import { useAuthContext } from "../context/authcontext.jsx";
const useGetMessages = () => {
    const {user}=useAuthContext();
    const {messages,setMessages} = useChatContext();
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchMessages = async () => {
            try {
              for (const chatid of user.chats) {
                const response = await axios.get(`${API_URL}/messages/${chatid}`);
                const messages = response.data.reverse();
                if (response.error) {
                  throw new Error(response.error);
                }
                setMessages((prevMessages) => ({
                  ...prevMessages,
                  [chatid]: [...(prevMessages[chatid] || []), ...messages],
                }));
              }
            } catch (error) {
              console.error(error.message);
            }
        };
        if(user?.chats?.length)
        fetchMessages();
    }, [user]);
    
}

export default useGetMessages;