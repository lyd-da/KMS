import express from 'express';
import {check, validationResult } from 'express-validator';
import Department from '../../models/departments.js';
import Profile from '../../models/members.js';
import Announcements from '../../models/announcements.js';
import Forms from '../../models/forms.js';
import User from '../../models/user.js';

const router = express.Router();

router.post('/', [ 
    check('dep_name', 'Derpartment name is required').not().isEmpty(),
    
    // check('identifier', 'Department identifier is required').not().isEmpty(),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newDep = req.body;
        const {dep_name}=req.body
        let dep = await Department.findOne({dep_name});

        if (dep){
            return res.status(400).json({errors: [{msg: 'The department already exists'}]});
        }
        let members = await User.find({dep_name}).countDocuments();
        newDep.total_members = members;
       
        //create new department
        dep = new Department(newDep);
        await dep.save();
        res.json(dep);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all Departments
router.get('/', async (req,res)=>{
    try {
        const dep = await Department.find().sort({_id: -1});
        res.json(dep);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//retrive all Departments projects
router.get('/projects', async (req,res)=>{
    var i=0;
    var projects=[];
    var ongoing={}
    var completed={}
    try {
        const dep = await Department.find().sort({_id: -1});
        dep.forEach(project=>{
            if(project.ongoing !== ''){
                ongoing= project.ongoing;
                // pro.completed= project.completed;
                
                projects.push(ongoing)
            }
            if(project.completed !== ''){
                completed= project.completed;
                // pro.completed= project.completed;
                
                projects.push(completed)
            }
          
        })
       // projects = JSON.parse(projects)
       //console.log(projects)
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//get dep/:dep_name 
router.get('/:dep_name', async (req,res)=>{
    try {
        const dep = await Department.findOne({dep_name : req.params.dep_name});
        if(!dep) 
        return res.status(400).json({msg: 'Department not found'});

        res.json(dep);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Department not found'});
        }
        res.status(500).send('server error');
    }
});
//get dep/:_id 
router.get('/id/:id', async (req,res)=>{
    try {
        const dep = await Department.findOne({_id : req.params.id});
        if(!dep) 
        return res.status(400).json({msg: 'Department not found'});

        res.json(dep);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Department not found'});
        }
        res.status(500).send('server error');
    }
});
//update Announcement
router.put('/:dep_name', async (req,res)=>{
    try {
        const newDep = req.body;
        let dep = await Department.findOne({dep_name: req.params.dep_name});
        let members = await User.find({dep_name: req.params.dep_name}).countDocuments();
        newDep.total_members = members;
        if (dep){
            //update
         dep= await Department.findOneAndUpdate(
                                     {dep_name: req.params.dep_name},
                                     {$set: newDep},
                                     {new : true}
                                     );
        
        Announcements.updateMany({dep_name:req.params.dep_name},{$set:{dep_name:newDep.dep_name}},function(err,updated){
            if(err)
            {console.log(err);}
            else{
               // console.log(newDep.dep_name)   
            }
            });
        User.updateMany({dep_name:req.params.dep_name},{$set:{dep_name:newDep.dep_name}},function(err,updated){
            if(err)
            {console.log(err);}
            else{
               // console.log(newDep.dep_name)
                
            }
            });
        Forms.updateMany({dep_name:req.params.dep_name},{$set:{dep_name:newDep.dep_name}},function(err,updated){
            if(err)
            {console.log(err);}
            else{
               // console.log(newDep.dep_name)
                
            }
            });
        
        
         res.json(dep);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//add completed project
router.put('/completed/:dep_id', [ 
    check('name', 'Project name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
    }
    try {
        const newDep = req.body;
        let dep = await Department.findOne({_id: req.params.dep_id});
        
        dep.completed.unshift(newDep);

        await dep.save();
         res.json(dep);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//edit completed project
router.put('/completededit/:dep_id/:id', async (req,res)=>{
   
    try {
        const newDep = req.body;
        let dep = await Department.findOne({_id: req.params.dep_id});
       
        if (dep) {

            const removeIndex= dep.completed.map(item => item.id).indexOf(req.params.id);

            dep.completed.splice(removeIndex,1);
        
            dep.completed.unshift(newDep);

            await dep.save();

            
            res.json(dep);
         }
        
        
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }

})
//remove completed project
router.delete('/:dep_id/:project_id', async (req,res)=>{

    try {
        let dep = await Department.findOne({_id: req.params.dep_id});

        const removeIndex= dep.completed.map(item => item.id).indexOf(req.params.project_id);

        dep.completed.splice(removeIndex,1);
        await dep.save();
         res.json({msg: 'Project deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//add ongoing project
router.put('/ongoing/:dep_id', [ 
    check('name', 'Project name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    ], async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
    }
    try {
        const newDep = req.body;
        let dep = await Department.findOne({_id: req.params.dep_id});
        
        dep.ongoing.unshift(newDep);

        await dep.save();
         res.json(dep);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//edit ongoing project
router.put('/ongoingedit/:dep_id/:id', async (req,res)=>{
   
    try {
        const newDep = req.body;
        let dep = await Department.findOne({_id: req.params.dep_id});
       
        if (dep) {

            const removeIndex= dep.completed.map(item => item.id).indexOf(req.params.id);

            dep.ongoing.splice(removeIndex,1);
        
            dep.ongoing.unshift(newDep);

            await dep.save();

            
            res.json(dep);
         }
        
        
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }

})
//remove ongoing project
router.delete('/ongoing/:dep_id/:project_id', async (req,res)=>{

    try {
        let dep = await Department.findOne({_id: req.params.dep_id});

        const removeIndex= dep.ongoing.map(item => item.id).indexOf(req.params.project_id);

        dep.ongoing.splice(removeIndex,1);
        await dep.save();
         res.json({msg: 'Project deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//add faq project
router.put('/faq/:dep_id', 
     async (req,res)=>{
       
    const newDep = req.body;
    try {
        
        let dep = await Department.findOne({_id: req.params.dep_id});
        
       // dep.faq.questions.unshift(newDep);

       // await dep.save();
         res.json(dep.faq.questions);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Announcement
router.delete('/:dep_id', async (req,res)=>{
    try {
         await Department.findOneAndRemove({_id: req.params.dep_id});
         res.json({msg: 'Department deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;