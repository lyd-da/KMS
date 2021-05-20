import  mongoose from "mongoose";

const announceschema=new mongoose.Schema({

    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    dep_name:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    },
    announceImage: {
        type: String
    }
    
   
    
});



const Announcements = mongoose.model("Announcements",announceschema);

export default Announcements;