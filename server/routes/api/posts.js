import express from 'express';

import {getPosts, createPost} from '../../controller/posts.js';
const router = express.Router();

router.get('/home', getPosts);
router.post('/home',createPost);
export default router;