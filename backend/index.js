import express from "express";
import { app, io, server, getReceiverSocketId } from "./socket.js";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Chat from "./chatmodel.js";
import Message from "./messagemodel.js";
import User from "./usermodel.js";
import cors from "cors";
import Request from "./requestmodel.js";
configDotenv();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));

const connectDB=async()=>{
    const res=await mongoose.connect(process.env.MONGO_API);
    if(res)
    console.log("Successfully connected to DataBase");
}

app.post("/register",async(req,res)=>{
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
    res.status(201).json({user:newuser});
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

app.get("/chats/:chatid",async(req,res)=>{
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

app.get("/messages/:chatid",async(req,res)=>{
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

app.get("/users/:userid",async(req,res)=>{
    const {userid}=req.params;
    if(!mongoose.isValidObjectId(userid)){
        return res.status(400).json({error:"Invalid userid"});
    }
    const user=await User.findById(userid).select("-password -chats");
    if(!user){
        return res.status(404).json({error:"user not found"});
    }
    res.json(user);
})

app.get("/friends/:userid",async(req,res)=>{
    const {userid}=req.params;
    if(!mongoose.isValidObjectId(userid)){
        return res.status(400).json({error:"Invalid userid"});
    }
    const user=await User.findById(userid);
    if(!user){
        return res.status(404).json({error:"user not found"});
    }
    const friends=user.friends;
    const friendslist=await User.find({_id:{$in:friends}}).select("-password -chats");
    res.json(friendslist);
})

app.post("/sendmessage/:chatid",async(req,res)=>{
    const {chatid}=req.params;
    const {message, from, to} = req.body;
    
    if(!mongoose.isValidObjectId(chatid)){
        return res.status(400).json({error:"Invalid chatid"});
    }
    
    if(!message || !from || !to){
        return res.status(400).json({error:"Message, from, and to are required"});
    }

    const newmessage=new Message({message, from, to, chatid});
    await newmessage.save();
    const receiverSocketId=getReceiverSocketId(to);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("recieve-message",newmessage);
    }
    res.status(201).json({newmessage});
})

app.post("/sendrequest",async(req,res)=>{
    const {senderid,receiverid}=req.body;
    if(!mongoose.isValidObjectId(senderid) || !mongoose.isValidObjectId(receiverid)){
        return res.status(400).json({error:"Invalid senderid or receiverid"});
    }
        const newrequest=new Request({sender:senderid,receiver:receiverid});
    await newrequest.save();
    res.status(201).json({newrequest});
    const receiverSocketId=getReceiverSocketId(receiverid);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("recieve-request",newrequest);
    }
})  

app.get("/requests/:userid",async(req,res)=>{
    const {userid}=req.params;
    if(!mongoose.isValidObjectId(userid)){
        return res.status(400).json({error:"Invalid userid"});
    }
    const requests=await Request.find({$or:[{sender:userid},{receiver:userid}]});
    res.json(requests);
})

app.post("/acceptrequest",async(req,res)=>{
    const {requestid}=req.body;
    if(!mongoose.isValidObjectId(requestid)){
        return res.status(400).json({error:"Invalid requestid"});
    }
    const request=await Request.findById(requestid);
    if(!request){
        return res.status(404).json({error:"request not found"});
    }
    const sender=await User.findById(request.sender);
    const receiver=await User.findById(request.receiver);
    
    // Add friend IDs to both users
    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);
    
    // Create new chat with participant IDs
    const newchat=new Chat({participants:[sender._id,receiver._id]});
    await newchat.save();
    
    // Add chat IDs to both users
    sender.chats.push(newchat._id);
    receiver.chats.push(newchat._id);
    
    await sender.save();
    await receiver.save();
    await Request.findByIdAndDelete(requestid);
    res.status(200).json({message:"request accepted"});
    console.log(receiver);
    const receiverSocketId=getReceiverSocketId(receiver._id);
    console.log(receiverSocketId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("update-user",receiver);
    }
    const senderSocketId=getReceiverSocketId(sender._id);
    if(senderSocketId){
        io.to(senderSocketId).emit("update-user",sender);
    }
})

app.post("/rejectrequest",async(req,res)=>{
    const {requestid}=req.body;
    if(!mongoose.isValidObjectId(requestid)){
        return res.status(400).json({error:"Invalid requestid"});
    }
    const request=await Request.findById(requestid);
    if(!request){
        return res.status(404).json({error:"request not found"});
    }
    await Request.findByIdAndDelete(requestid);
    res.status(200).json({message:"request rejected"});
})  

app.get("/searchusername/:username", async(req, res) => {
    const { username } = req.params;
    
    
    if (!username || username.trim() === '') {
      return res.status(400).json({error: "Invalid search term"});
    }
    
    try {
      const users = await User.find({
        username: { $regex: username.trim(), $options: "i" }
      }).select("-password -chats");
      
      res.json(users);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({error: "Search failed"});
    }
  });
server.listen(8000,()=>{
    connectDB();
    console.log("server running on 8000");
})