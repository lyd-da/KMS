import  mongoose from "mongoose";
import  passportLocalMongoose from "passport-local-mongoose";

const quickschema=new mongoose.Schema({

    name:String,
    
    
});


quickschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("QuikLinks",quickschema);
