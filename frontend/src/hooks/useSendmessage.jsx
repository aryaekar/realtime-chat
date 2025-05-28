import { useChatContext } from "../context/chatcontext.jsx";
import axios from "axios";

const useSendMessage = () => {
    const { messages, setMessages } = useChatContext();
    const API_URL = import.meta.env.VITE_API_URL;

    const sendMessage = async (message, chatid, from, to) => {
        try {
            const response = await axios.post(`${API_URL}/sendmessage/${chatid}`, {
                message,
                from,
                to
            });
            
            if (response.status === 201) {
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [chatid]: [...(prevMessages[chatid] || []), response.data.newmessage]
                }));
                // console.log(messages);
            } else {
                console.error("Failed to send message:", response);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return { sendMessage };
}

export default useSendMessage;