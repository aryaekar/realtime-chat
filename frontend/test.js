// import { io } from "socket.io-client";
const socket=io("http://localhost:8000");

let userid,friendId;
document.getElementById("userForm").addEventListener("change",(e)=>{
    e.preventDefault();
    userid = document.getElementById("userid").value;
    socket.emit("join",userid);
})
document.getElementById("partForm").addEventListener("change",(e)=>{
    e.preventDefault();
    friendId=document.getElementById("participant").value;
})

function addmessage(message,owner){
    const mess = document.createElement("p");
    const node = document.createTextNode(message);
    mess.appendChild(node);
    if(owner==="friend")
    mess.style.backgroundColor='LightBlue';
    if(owner==="me")
    mess.style.backgroundColor='LightGreen';
    document.getElementById("messagebox").appendChild(mess);
}

document.getElementById("chatForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    let message = document.getElementById("messageInput").value;
    socket.emit("send-message",message,friendId);
    addmessage(message,"me");
    document.getElementById("messageInput").value="";
})

socket.on("recieve-message",(message)=>{
    addmessage(message,"friend");
})