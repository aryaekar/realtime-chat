import { useChatContext } from "../context/chatcontext.jsx";
import { useAuthContext } from "../context/authcontext.jsx";
import axios from "axios";
import { useEffect } from "react";

const useGetChats = () => {
    const {chats,setChats} = useChatContext();
    const {user}=useAuthContext(); 
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchChats = async () => {
          if (!user?.chats || user.chats.length === 0) return;
          
          try {
            const chatPromises = user.chats.map(chatId => 
              axios.get(`${API_URL}/chats/${chatId}`)
            );
            
            const responses = await Promise.all(chatPromises);
            const fetchedChats = responses.map(response => response.data);
            
            setChats(fetchedChats);
            
          } catch (error) {
            console.error('Error fetching chats:', error);
          }
        };
      
        if (user) {
          fetchChats();
        }
      }, [user]);
}

export default useGetChats;