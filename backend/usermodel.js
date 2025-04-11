import mongoose, { SchemaTypes, Types } from "mongoose";

const usermodel=new mongoose.Schema({
    username: String,
    friends:[{
        type:SchemaTypes.ObjectId,
        ref:'User'
    }],
    chats:[{
        type:SchemaTypes.ObjectId,
        ref:'Chat'
    }],
    email: String,
    password: String
})

const User=mongoose.model('User',usermodel);
export default User;