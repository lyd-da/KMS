import express from 'express';
import {check, validationResult } from 'express-validator';
import Gallary from '../../models/gallary.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, './client/public/gallary')
    },
    filename: (req, file, callback) =>{
        callback(null, file.originalname)
    }
})
const upload = multer({storage: storage});

router.post('/', upload.single('image'), [ 
    check('title', 'Title is required').not().isEmpty(),
    
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newGallary = {
            title: req.body.title,
            link: req.body.link,
            date: req.body.date,
            
        };     
        if(req.file){
            newGallary.image = req.file.originalname
        }
        else{
            newGallary.image= ''
        }
        console.log(newGallary.image)  
        //create new announcement
       const gallary = new Gallary (newGallary);
        await gallary.save();
        res.json(gallary);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all Gallary
router.get('/', async (req,res)=>{
    try {
        const gallary = await Gallary.find().sort({ date: -1 });
        res.json(gallary);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//get announce/:announce_id
// router.get('/:announce_id', async (req,res)=>{
//     try {
//         const announce = await Announcements.findById(req.params.announce_id);
//         if(!announce) 
//         return res.status(400).json({msg: 'Announcement not found'});

//         res.json(announce);
//     }catch (err) {
//         console.error(err.message);
//         if(err.kind == 'ObjectId'){
//             return res.status(400).json({msg: 'Announcement not found'});
//         }
//         res.status(500).send('server error');
//     }
// });

//get announce/:dep_name
router.get('/:id', async (req,res)=>{
    try {
        const gallary = await Gallary.findById(req.params.id);
        
        res.json(gallary);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Gallary not found'});
        }
        res.status(500).send('server error');
    }
});

//update Announcement
router.put('/:image_id', upload.single('image'), async (req,res)=>{
    try {
        const newGallary = {
            title: req.body.title,
            link: req.body.link,
            date: req.body.date,
            
        };  
        if(req.file){
            newGallary.image = req.file.originalname
        }
          
        
        let gallary = await Gallary.findById(req.params.image_id);

        if (gallary){
            //update
         gallary= await Gallary.findOneAndUpdate(
                                     {_id: req.params.image_id},
                                     {$set: newGallary},
                                     {new : true}
                                     );
         res.json(gallary);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Gallary
router.delete('/:id', async (req,res)=>{
    try {
         await Gallary.findOneAndRemove({_id: req.params.id});
         res.json({msg: 'Image deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;