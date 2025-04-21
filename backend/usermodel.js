import mongoose, { SchemaTypes, Types } from "mongoose";

const usermodel=new mongoose.Schema({
    username: String,
    friends:[{
        type:SchemaTypes.ObjectId,
        ref:'User',
        default:[]
    }],
    chats:[{
        type:SchemaTypes.ObjectId,
        ref:'Chat',
        default:[]
    }],
    email: String,
    password: String
})

const User=mongoose.model('User',usermodel);
export default User;