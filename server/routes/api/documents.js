import express from 'express';
import {check, validationResult } from 'express-validator';
import Documents from '../../models/documents.js';

import multer from 'multer';
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, './client/public/uploads/')
    },
    filename: (req, file, callback) =>{
        callback(null, file.originalname)
    }
})
const upload = multer({storage: storage});

router.post('/', upload.single('docFile'), [ 
    check('doc_name', 'Document name is required').not().isEmpty(),
    
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newDoc = req.body;
        if(req.file){
            newDoc.docFile = req.file.originalname
        }
        else{
            newDoc.docFile= ''
        }
        //create new department
        let doc = new Documents(newDoc);
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
        const doc = await Documents.find().sort({ _id: -1 });
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//get document/:doc_id
router.get('/:id', async (req,res)=>{
    try {
        const doc = await Documents.findOne({
            _id: req.params.id});
        if(!doc) 
        return res.status(400).json({msg: 'Document not found'});

        res.json(doc);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Document not found'});
        }
        res.status(500).send('server error');
    }
});
//get document/:doc_id
router.get('/dep/:dep_name', async (req,res)=>{
    try {
        const doc = await Documents.find({
            dep_name: req.params.dep_name});
        if(!doc) 
        return res.status(400).json({msg: 'Document not found'});

        res.json(doc);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Document not found'});
        }
        res.status(500).send('server error');
    }
});
//update doc
router.put('/:doc_id', upload.single('docFile'), async (req,res)=>{
    try { 
        const newDoc =req.body

        let doc = await Documents.findOne({_id: req.params.doc_id});
         if(req.file){
            newDoc.docFile = req.file.originalname
        }
        else {
             newDoc.docFile = doc.docFile
        }
        if (doc){
            //update
            doc= await Documents.findOneAndUpdate(
                                     {_id: req.params.doc_id},
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
router.delete('/:doc_id', async (req,res)=>{
    try {
         await Documents.findOneAndRemove({_id: req.params.doc_id});
         res.json({msg: 'Document deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//Download a file by doc_name
router.get('/download/:id', async (req,res)=>{
    try {
        const doc = await Documents.findOne({
            _id: req.params.id});
        if(!doc) 
        return res.status(400).json({msg: 'File not found'});

        var file=path.join('./client/public/uploads', doc.docFile)  
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