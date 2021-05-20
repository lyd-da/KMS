import  mongoose from "mongoose";


const docschema=new mongoose.Schema({

    doc_name:{
        type: String,
        required:true
    },
    dep_name:{
        type:String
    },
    description:{
        type:String
    },
    docFile:{
        type:String
    },
   
    
});


const doc = mongoose.model("Documents",docschema);
export default doc;
