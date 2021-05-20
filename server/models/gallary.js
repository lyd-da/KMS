import  mongoose from "mongoose";

const gallaryschema=new mongoose.Schema({

    title:{
        type: String,
        required:true
    },
    image: {
        type: String,
        
    },
    link:{
        type:String,
    },
    date:{
        type:Date,
        default: Date.now
    },
   
    
   
    
});



const Gallary = mongoose.model("Gallary",gallaryschema);

export default Gallary;