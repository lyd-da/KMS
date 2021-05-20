import express from 'express';
import {check, validationResult } from 'express-validator';

import Events from '../../models/events.js';

const router = express.Router();

router.post('/', [ 
    check('event_name', 'Event name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newEvent = req.body;
        
        //create new department
        const events = new Events(newEvent);
        await events.save();
        res.json(events);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all services
router.get('/', async (req,res)=>{
    try {
        const events = await Events.find().sort({date:1});
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//get service/:service_id
router.get('/:event_id', async (req,res)=>{
    try {
        const event = await Events.findById(req.params.event_id);
        if(!event) 
        return res.status(400).json({msg: 'Event not found'});

        res.json(event);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Event not found'});
        }
        res.status(500).send('server error');
    }
});

//get dep/:dep_name
router.get('/dep/:dep_name', async (req,res)=>{
    try {
        const event = await Events.find({dep_name:req.params.dep_name});
        if(!event) 
        return res.status(400).json({msg: 'Event not found'});

        res.json(event);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Event not found'});
        }
        res.status(500).send('server error');
    }
});
//update service
router.put('/:event_id', async (req,res)=>{
    try {
        const newEvent = req.body;
        let event = await Events.findOne({_id: req.params.event_id});

        if (event){
            //update
            event= await Events.findOneAndUpdate(
                                     {_id: req.params.event_id},
                                     {$set: newEvent},
                                     {new : true}
                                     );
         res.json(event);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Announcement
router.delete('/:event_id', async (req,res)=>{
    try {
         await Events.findOneAndRemove({_id: req.params.event_id});
         res.json({msg: 'Event deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;