import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        requierd: true
    },
    password:{
        type:String,
        required: true
    },
    avatar:{
        type: String
    },
    dep_name:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('user', userSchema);
export default User;