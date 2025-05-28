import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
    return useContext(ChatContext);
}

export const ChatContextProvider = ({children}) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    return (
        <ChatContext.Provider value={{chats, setChats, selectedChat, setSelectedChat, messages, setMessages, friends, setFriends, requests, setRequests, users, setUsers}}>
            {children}
        </ChatContext.Provider>
    )
}
