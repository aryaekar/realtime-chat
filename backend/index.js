import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpserver = createServer(app);
const io =new Server(httpserver,{
    cors: { origin: "*" } // Allow all clients to connect
});

// app.get("/",(req,res)=>{
//     res.json({stat:"workinf fine"});
// })
app.use(express.static(path.join(__dirname, "../Frontend")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "test.html"));
});
io.on('connection',(socket)=>{
    console.log("user is connected",socket.id);

    socket.on("send-message",(message,friendId)=>{
        socket.to(friendId).emit("recieve-message",message);
    })

    socket.on("join",(userid)=>{
        socket.join(userid);
    })
})

httpserver.listen(8000,()=>{
    console.log("server running on 8000");
})