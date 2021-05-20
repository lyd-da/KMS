import express from 'express';
import auth from '../../middleware/auth.js';
import User from '../../models/user.js';
import {check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/',auth, async (req, res) => {
   try{
       const user = await User.findById(req.user.id).select('-password');
       res.json(user);
   } catch(err){
       console.log(err.message);
       res.status(500).send('Server error');
   }

});

//user authentication 
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required ').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ 
        return res.status(400).json({errors: errors.array()});
    }

    const { email, password} = req.body;

    try{
        let user = await User.findOne({email});

        if (!user){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res
            .status(400)
            .json({errors: [{msg: 'Invalid Credentials  '}]});
        }

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


export default router; 