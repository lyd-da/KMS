import  mongoose from "mongoose";


const roleschema=new mongoose.Schema({
   
    type:{
        type: String,
        
    }  
});


const role = mongoose.model("Roles",roleschema);
export default role;