import { Server } from "socket.io";
import express, { json } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Chat from "./chatmodel";
import Message from "./messagemodel";

configDotenv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const connectDB=async()=>{
    const res=await mongoose.connect(process.env.MONGO_API);
    if(res)
        console.log("Successfully connected to DataBase");
}
connectDB();
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

app.get("/retrivechats/:chatid",async(req,res)=>{
    const chatid=req.params.chatid;
    if(!mongoose.isValidObjectId(chatid)){
        return res.status(400).json({error:"Invalid chatid"});
    }
    const chat=await Chat.findById(chatid);
    if(!chat){
        return res.status(404).json({error:"chat not found"});
    }
    res.json(chat);
})

app.get("/retrivemessages/:chatid",async(req,res)=>{
    const chatid=req.params.chatid;
    if(!mongoose.isValidObjectId(chatid)){
        return res.status(400).json({error:"Invalid chatid"});
    }
    const messages=await Message.find({chatid}).sort({createdAt:-1});
    if(!messages){
        return res.status(404).json({error:"messages not found"});
    }
    res.json(messages);
})

io.on('connection',(socket)=>{
    console.log("user is connected",socket.id);
    socket.on("send-message",(message,to,from,chatid)=>{
        const mess=({
            message:message,
            chatid:chatid,
            from:from,
            to:to
        })
        socket.to(to).emit("recieve-message",mess);
    })

    socket.on("join",(userid)=>{
        socket.join(userid);
    })
})

httpserver.listen(8000,()=>{
    console.log("server running on 8000");
})