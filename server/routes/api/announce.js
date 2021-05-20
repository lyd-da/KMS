import express from 'express';
import {check, validationResult } from 'express-validator';
import Announcements from '../../models/announcements.js';
import multer from 'multer';

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

router.post('/', upload.single('announceImage'), [ 
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('dep_name', 'The department name posting this announcement is required').not().isEmpty(),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newAnnounce = {
            title: req.body.title,
            description: req.body.description,
            dep_name: req.body.dep_name,
            
        };     
        if(req.file){
            newAnnounce.announceImage = req.file.originalname
        }
        else{
            newAnnounce.announceImage= ''
        }
        console.log(newAnnounce.announceImage)  
        //create new announcement
       const announce = new Announcements(newAnnounce);
        await announce.save();
        res.json(announce);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all Announcements
router.get('/', async (req,res)=>{
    try {
        const announces = await Announcements.find().sort({ _id: -1 });
        res.json(announces);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//get announce/:announce_id
router.get('/:announce_id', async (req,res)=>{
    try {
        const announce = await Announcements.findById(req.params.announce_id);
        if(!announce) 
        return res.status(400).json({msg: 'Announcement not found'});

        res.json(announce);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Announcement not found'});
        }
        res.status(500).send('server error');
    }
});

//get announce/:dep_name
router.get('/dep/:dep_name', async (req,res)=>{
    try {
        const announce = await Announcements.find({dep_name: req.params.dep_name});
        
        res.json(announce);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Announcement not found'});
        }
        res.status(500).send('server error');
    }
});

//update Announcement
router.put('/:announce_id', upload.single('announceImage'), async (req,res)=>{
    try {
        const newAnnounce = {
            title: req.body.title,
            description: req.body.description,
            dep_name: req.body.dep_name,
            
        };  
        if(req.file){
            newAnnounce.announceImage = req.file.originalname
        }
          
        
        let announce = await Announcements.findOne({_id: req.params.announce_id});

        if (announce){
            //update
         announce= await Announcements.findOneAndUpdate(
                                     {_id: req.params.announce_id},
                                     {$set: newAnnounce},
                                     {new : true}
                                     );
         res.json(announce);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Announcement
router.delete('/:id', async (req,res)=>{
    try {
         await Announcements.findOneAndRemove({_id: req.params.id});
         res.json({msg: 'Announcement deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;