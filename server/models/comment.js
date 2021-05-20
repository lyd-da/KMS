import  mongoose from "mongoose";


const commnetschema=new mongoose.Schema({

    comment:{
        type:String,
        required: true
    },
    dep_name:{
        type: String
    },
    commented_on:{
        type:String
    },
    date:{
        type:Date,
        default: Date.now
    }
   
    
});


const comment = mongoose.model("Comments",commnetschema);
export default comment;
