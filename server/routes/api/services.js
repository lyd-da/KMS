import express from 'express';
import {check, validationResult } from 'express-validator';
import Services from '../../models/services.js';

const router = express.Router();

router.post('/', [ 
    check('service_name', 'Service name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newService = req.body;
        const {service_name}=req.body
        let service = await Services.findOne({service_name});

        if (service){
            return res.status(400).json({errors: [{msg: 'The department already exists'}]});
        }
        //create new department
        service = new Services(newService);
        await service.save();
        res.json(service);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all services
router.get('/', async (req,res)=>{
    try {
        const services = await Services.find().sort({_id: -1});
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//get service/:service_id
router.get('/:service_id', async (req,res)=>{
    try {
        const service = await Services.findById(req.params.service_id);
        if(!service) 
        return res.status(400).json({msg: 'Service not found'});

        res.json(service);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Service not found'});
        }
        res.status(500).send('server error');
    }
});
//update service
router.put('/:service_id', async (req,res)=>{
    try {
        const newService = req.body;
        let service = await Services.findOne({_id: req.params.service_id});

        if (service){
            //update
            service= await Services.findOneAndUpdate(
                                     {_id: req.params.service_id},
                                     {$set: newService},
                                     {new : true}
                                     );
         res.json(service);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Announcement
router.delete('/:service_id', async (req,res)=>{
    try {
         await Services.findOneAndRemove({_id: req.params.service_id});
         res.json({msg: 'Service deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;