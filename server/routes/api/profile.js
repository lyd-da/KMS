import express from 'express';
import {check, validationResult } from 'express-validator';

import Department from '../../models/departments.js';
import User from '../../models/user.js';
import Profile from '../../models/members.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/me',auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',
        ['name','email', 'avatar']);
        
        if (!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    } catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
 
 });
router.post('/:id', [ auth,
    check('position', 'Position is required').not().isEmpty(),
    check('dep_name', 'Department name is required').not().isEmpty(),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {position, dep_name} = req.body;
    const profileFields = {};
    profileFields.user = req.params.id;
    if(position) profileFields.position = position;
    if(dep_name) profileFields.dep_name = dep_name;

    try{
        let profile = await Profile.findOne({user: req.params.id});

        if (profile){
            //update
            profile = await Profile.findOneAndUpdate(
                {user: req.params.id},
                {$set: profileFields},
                {new : true});

       
            return res.json(profile);
        }
        //create
        
        let dep = await Department.findOne({dep_name:dep_name});

        profile = new Profile(profileFields);
        await profile.save();
        let members = await Profile.findOne({dep_name}).countDocuments();
       
        Department.updateOne({dep_name:dep_name},{$set:{total_members:members}},function(err,updated){
                if(err)
                {console.log(err);}
                else{
                 console.log(members);
                }
        });
            
        
        res.json(profile);
       
        
    }catch(err){
        console.error(err.meassage);
        res.status(500).send('server error');
    }
    
});
//retrive all profiles
router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name','email', 'avatar'], {model: User});
        res.json(profiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//retrive all profiles
router.get('/:dep_name', async (req,res)=>{
    try {
       // const profiles = await Profile.find({dep_name:req.params.dep_name}).populate('user', ['name','email', 'avatar'], {model: User});
        const profiles = await User.find({dep_name:req.params.dep_name});
        res.json(profiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//get members/user/:user_id
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name','email', 'avatar'], {model: User});
        if(!profile) 
        return res.status(400).json({msg: 'Profile not found'});

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('server error');
    }
});

//remove profile and user
router.delete('/', auth, async (req,res)=>{
    try {
        //removing profile
         await Profile.findOneAndRemove({user: req.user.id});
         //removing user
         await User.findOneAndRemove({_id: req.user.id});
         res.json({msg: 'User deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove profile and user
router.delete('/:id', async (req,res)=>{
    try {
        //removing profile
         await Profile.findOneAndRemove({_id: req.params.id});
         //removing user
         
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;