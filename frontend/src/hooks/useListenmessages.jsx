import { useChatContext } from "../context/chatcontext.jsx";
import { useSocketContext } from "../context/socketcontext.jsx";
import { useEffect } from "react";

const useListenMessages = () => {
    const { messages, setMessages } = useChatContext();
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.on("recieve-message", (message) => {
            const { chatid } = message;
            setMessages(prevMessages => ({
                ...prevMessages,
                [chatid]: [...(prevMessages[chatid] || []), message]
            }));
        });

        return () => {
            socket.off("recieve-message");
        };
    }, [socket]);
}

export default useListenMessages;