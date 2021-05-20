import express from 'express';
import {check, validationResult } from 'express-validator';
import  gravatar  from "gravatar";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../../models/user.js'
import Profile from '../../models/members.js';
import Role from '../../models/role.js'
import Position from '../../models/position.js';
import Department from '../../models/departments.js';

const router = express.Router();

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('role', 'Role is required').not().isEmpty(),
    check('dep_name', 'Department name is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('password', 'Please enter a pasword with 6 or more characters').isLength({ min:6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, role, password, dep_name, position} = req.body;

    try{
        let user = await User.findOne({email});

        if (user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            role,
            avatar,
            dep_name,
            position,
            password
        });

        const salt= await bcrypt.genSalt(10);

        user.password= await bcrypt.hash(password,salt);
        await user.save();

        const payload ={
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) =>{
                if(err) throw err;
                res.json({token})
            }); 
        
    }catch(err){
        console.error(err.meassage);
        res.status(500).send('server error');
    }
    
});
//GET ALL USERS
router.get('/', async (req,res)=>{
    try {
        const users = await User.find().sort({name: 1});
        res.json(users);
    } catch (err) { 
        console.error(err);
        res.status(500).send('server error');
    }
})
//get USER/:id
router.get('/:id', async (req,res)=>{
    try {
        const user = await User.findOne({_id: req.params.id});
        if(!user) 
        return res.status(400).json({msg: 'User not found'});

        res.json(user);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'User not found'});
        }
        res.status(500).send('server error');
    }
});
//get USER/search/:keyword
router.get('/search/:keyword', async (req,res)=>{
    try {
        const keyword = req.params.keyword;
        const user = await User.find({$or:[{name:new RegExp(keyword,'i')},{email :new RegExp(keyword,'i')},{position :new RegExp(keyword,'i')}]}).sort({name: 1});
        if(!user) 
        return res.status(400).json({msg: 'User not found'});

        res.json(user);
    }catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'User not found'});
        }
        res.status(500).send('server error');
    }
});
//update user
router.put('/:id', async (req,res)=>{
    try {
       const newUser = req.body;
        let user = await User.findOne({_id: req.params.id});

        if (user){
            //update
         user= await User.findOneAndUpdate(
                                     {_id: req.params.id},
                                     {$set: newUser},
                                     {new : true}
                                     );
        let members = await User.find({dep_name:newUser.dep_name}).countDocuments();
         Department.updateOne({dep_name:newUser.dep_name},{$set:{total_members:members}},function(err,updated){
                if(err)
                {console.log(err);}
                else{
                 console.log(members);
                }
        });
         res.json(user);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove User
router.delete('/:id', async (req,res)=>{
    try {
         await User.findOneAndRemove({_id: req.params.id});
         //removing profile
         await Profile.findOneAndRemove({user: req.params.id});
         res.json({msg: 'User data and the related profile is deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})


// Role and Positions
//GET ALL Role
router.get('/role', async (req,res)=>{
    try {
        const users = await Role.find().sort({_id: -1});
        res.json(users);
    } catch (err) { 
        console.error(err);
        res.status(500).send('server error');
    }
})
//Add role
router.post('/role', [ 
    check('type', 'Role type is required').not().isEmpty()
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newPosition = req.body;
        const {position}=req.body
        let role = await Role.findOne({position});

        if (role){
            return res.status(400).json({errors: [{msg: 'The Role already exists'}]});
        }
        //create new department
        role = new Role(newRole);
        await role.save();
        res.json(role);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//update role
router.put('/role/:id', async (req,res)=>{
    try {
        const newRole = req.body;
        let role = await Role.findOne({_id: req.params.id});

        if (role){
            //update
         role= await Role.findOneAndUpdate(
                                     {_id: req.params.id},
                                     {$set: newRole},
                                     {new : true}
                                     );
         res.json(role);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove Role
router.delete('/role/:id', async (req,res)=>{
    try {
         await Role.findOneAndRemove({_id: req.params.id});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})


//GET ALL poistion
router.get('/position', async (req,res)=>{
    try {
        const position = await Position.find().sort({_id: -1});
        res.json(position);
    } catch (err) { 
        console.error(err);
        res.status(500).send('server error');
    }
})
//Add position
router.post('/position', [ 
    check('position', 'Position name is required').not().isEmpty()
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newPosition = req.body;
        const {position}=req.body
        let pos = await Position.findOne({position});

        if (pos){
            return res.status(400).json({errors: [{msg: 'The poistion already exists'}]});
        }
        //create new department
        pos = new Position(newPosition);
        await pos.save();
        res.json(pos);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//update Position
router.put('/position/:id', async (req,res)=>{
    try {
        const newPosition = req.body;
        let pos = await Position.findOne({_id: req.params.id});

        if (pos){
            //update
         pos= await Position.findOneAndUpdate(
                                     {_id: req.params.id},
                                     {$set: newPosition},
                                     {new : true}
                                     );
         res.json(pos);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//remove position
router.delete('/position/:id', async (req,res)=>{
    try {
         await Position.findOneAndRemove({_id: req.params.id});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;