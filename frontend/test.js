// import { io } from "socket.io-client";
const socket=io("http://localhost:8000");

document.getElementById("chatForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    let message = document.getElementById("messageInput").value;
    socket.emit("send-message",message);
    document.getElementById("messageInput").value="";
})