import express from 'express';
import {check, validationResult } from 'express-validator';
import Comment from '../../models/comment.js';

const router = express.Router();

router.post('/', [ 
    check('comment', 'The text field is empty').not().isEmpty(),
    
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newComment = req.body;
        
       const comment = new Comment(newComment);
        await comment.save();
        res.json(comment);      
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});
//retrive all comment
router.get('/', async (req,res)=>{
    try {
        const comment = await Comment.find().sort({date: -1});
        res.json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
//retrive comment by dep_name
router.get('/:dep_name', async (req,res)=>{
    try {
        const comment = await Comment.find({commented_on: req.params.dep_name}).sort({date: -1});
        res.json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})

//remove comment
router.delete('/:comment_id', async (req,res)=>{
    try {
         await Comment.findOneAndRemove({_id: req.params.comment_id});
         res.json({msg: 'Comment deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
})
export default router;