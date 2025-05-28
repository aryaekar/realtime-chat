import { useAuthContext } from "../context/authcontext";
import { useEffect } from "react";
import { useSocketContext } from "../context/socketcontext";

const useUpdateuser=()=>{
    const {setUser}=useAuthContext();
    const {socket}=useSocketContext();
    useEffect(()=>{
        if(!socket) return;
        const handleUpdateUser = (user) => {
            console.log("User updated:", user);
            setUser(user);
            localStorage.setItem("chat-user", JSON.stringify(user));
        };
    
        socket.on("update-user", handleUpdateUser);
    
        return () => {
            socket.off("update-user", handleUpdateUser);
        };
    },[socket])
}
export default useUpdateuser;