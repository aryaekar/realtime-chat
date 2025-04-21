import { Server } from "socket.io";
import express, { json } from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Chat from "./chatmodel";
import Message from "./messagemodel";
import User from "./usermodel";
configDotenv();
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

app.get("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({error:"All fields are required"});
    }
    const user=await User.findOne({$or:[{username},{email}]});
    if(user){
        return res.status(400).json({error:"User already exists"});
    }
    const newuser=new User({username,email,password});
    await newuser.save();
    res.status(201).json({newuser});
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({error:"User not found"});
    }
    if(user.password!==password){
        return res.status(400).json({error:"Invalid password"});
    }
    res.status(200).json({user});
})
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