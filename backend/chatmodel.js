import mongoose from "mongoose";

const chatmodel= new mongoose.Schema({
    participants:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }]
})

const Chat= mongoose.model('Chat',chatmodel);
export default Chat;