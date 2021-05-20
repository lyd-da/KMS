import  mongoose from "mongoose";


const eventschema=new mongoose.Schema({

    event_name:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    dep_name:{
        type: String
    },
    date:{
        type:Date,
        
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
   
    
});


const events = mongoose.model("Events",eventschema);
export default events;
