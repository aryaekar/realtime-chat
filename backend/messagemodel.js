import mongoose, { SchemaTypes, Types } from "mongoose";

const messagemodel=new mongoose.Schema({
    message: String,
    chatid:{
        type:SchemaTypes.ObjectId,
        ref:'Chat',
        index:true
    },
    from:{
        type:SchemaTypes.ObjectId,
        ref:'User'
    },
    to:{
        type:SchemaTypes.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

messagemodel.index({ chatid: 1, createdAt: -1 });

const Message = mongoose.model('Message', messagemodel);
export default Message;
