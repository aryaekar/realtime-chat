import { useChatContext } from "../context/chatcontext";
import { useAuthContext } from "../context/authcontext";
import { useEffect } from "react";
import axios from "axios";
import { useSocketContext } from "../context/socketcontext";

const useGetrequests=()=>{
    const {requests,setRequests,users,setUsers}=useChatContext();
    const API_URL=import.meta.env.VITE_API_URL;
    const {user}=useAuthContext();
    const {socket}=useSocketContext();
    useEffect(()=>{
        const fetchRequests=async()=>{
            try{
                const response=await axios.get(`${API_URL}/requests/${user._id}`);
                setRequests(response.data);

                const requestsPromises = response.data.map(request => {
                    return axios.get(`${API_URL}/users/${request.sender}`);
                });
                const requestsResponses = await Promise.all(requestsPromises);
                setUsers([...requestsResponses.map(r => r.data), ...users]);
                
            }catch(error){
                console.error("Error fetching requests:",error);
            }
        }
        if(user){
            fetchRequests();
        }
    },[user]);

    useEffect(()=>{
        if(!socket) return;
        socket.on("recieve-request",(request)=>{
            setRequests(prev=>[...prev,request]);
        })
        return ()=>socket.off("recieve-request");
        
    },[socket])
}
export default useGetrequests;