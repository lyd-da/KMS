import express from 'express';
import {check, validationResult } from 'express-validator';
import Forms from '../../models/forms.js';

import multer from 'multer';
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, './client/public/uploads/forms/')
    },
    filename: (req, file, callback) =>{
        callback(null, file.originalname)
    }
})
const upload = multer({storage: storage});

router.post('/', upload.single('file'), [ 
    check('dep_name', 'Department name is required').not().isEmpty(),
    
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newDoc = req.body;
        if(req.file){
            newDoc.file = req.file.originalname
        }
        else{
            newDoc.file= ''
        }
        //create new department
        let doc = new Forms(newDoc);
        await doc.save();
        res.json(doc);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all services
router.get('/', async (req,res)=>{
    try {
        const doc = await Forms.find().sort({ _id: -1 });
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//get service/:service_id
router.get('/:id', async (req,res)=>{
    try {
        const doc = await Forms.findOne({
            _id: req.params.id});
        if(!doc) 
        return res.status(400).json({msg: 'Form not found'});

        res.json(doc);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Form not found'});
        }
        res.status(500).send('server error');
    }
});
//get form by dep name
router.get('/dep/:dep_name', async (req,res)=>{
    try {
        const doc = await Forms.find({
            dep_name: req.params.dep_name});
        if(!doc) 
        return res.status(400).json({msg: 'Form not found'});

        res.json(doc);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Form not found'});
        }
        res.status(500).send('server error');
    }
});
//update service
router.put('/:id',upload.single('file'), async (req,res)=>{
    try {
        
        const newDoc = {
            dep_name: req.body.dep_name,
            
        };  
        let doc = await Forms.findOne({_id: req.params.id});
        if(req.file){
            newDoc.file = req.file.originalname
        }
        else {
            newDoc.file = doc.file
        }
        if (doc){
           
            
            //update
            doc= await Forms.findOneAndUpdate(
                                     {_id: req.params.id},
                                     {$set: newDoc},
                                     {new : true}
                                     );
         res.json(doc);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Announcement
router.delete('/:id', async (req,res)=>{
    try {
         await Forms.findOneAndRemove({_id: req.params.id});
         res.json({msg: 'Form deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//Download a file by id
router.get('/download/:id', async (req,res)=>{
    try {
        const doc = await Forms.findOne({
            _id: req.params.id});
        if(!doc) 
        return res.status(400).json({msg: 'File not found'});

        var file=path.join('./client/public/uploads/forms', doc.file)  
        res.download(file);
        
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Document not found'});
        }
        res.status(500).send('server error');
    }
});

export default router;