import  mongoose from "mongoose";


const formschema=new mongoose.Schema({

    
    file:{
        type: String,
        
    },
    dep_name:{
        type: String,
        required: true
    },
    identifier:{
        type: String,
       
    }
    
});


const form = mongoose.model("Forms",formschema);
export default form;