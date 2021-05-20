import  mongoose from "mongoose";

var projectschema=new mongoose.Schema({

    dep_name:{
        type: String,
        required: true,
        unique: true
    },
    dep_desc:{
        type:String,
        required: true
    },
     identifier:{
        type:String,
        required: true
    },
    completed:[
        {
            name:{
                type:String,
                required: true
            },
            description:{
                type:String,
                required: true
            },
            date:{
                type: Date
            }
        }
    ],
    ongoing:[
        {
            name:{
                type:String,
                required: true
            },
            description:{
                type:String,
                required: true
            },
            date:{
                type: Date
            }
        }
    ],
    faq:[
        {
            questions:[
                {
                    question:{
                        type:String
                    },
                    answers:[
                        {
                            answer:{
                                type: String
                            }
                        }
                    ]
                }
            ]
        }
    ],  
    total_members:{
        type: String
    },
       
});


const Department = mongoose.model("Departments",projectschema);
export default Department;