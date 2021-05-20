import  mongoose from "mongoose";

const memberschema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, 
    position:{
        type: String,
        required: true
    },
    picture:{
        type:Buffer
    },
    dep_name:{
        type:String,
        required:true
    }
   
    
});


const profile = mongoose.model('Profile', memberschema);
export default profile;
