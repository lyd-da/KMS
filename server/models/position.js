import  mongoose from "mongoose";


const positionschema=new mongoose.Schema({
   
    position:{
        type: String,
        
    }  
});


const position = mongoose.model("Positions",positionschema);
export default position;