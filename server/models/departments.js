import  mongoose from "mongoose";

var departmentschema=new mongoose.Schema({

    dep_name:{
        type: String,
        required: true,
        unique: true
    },
    dep_desc:{
        type:String,
        
    },
     identifier:{
        type:String,
       
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
            progress:{
                type: Number,
                default: 25
            },
            date:{
                type: Date
            }
        }
    ],
    faq:[
        
           { questions:[
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


const Department = mongoose.model("Departments",departmentschema);
export default Department;