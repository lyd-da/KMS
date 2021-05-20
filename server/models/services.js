import  mongoose from "mongoose";


const serviceschema=new mongoose.Schema({

    service_name:{
        type: String,
        required: true,
        unique: true
    },
    dep_name:{
        type: String,
        
    },
    description:{
        type: String,
        required: true
    },
    icons: {
        type: Buffer
    },
   
    
});


const services = mongoose.model("Services",serviceschema);
export default services;
