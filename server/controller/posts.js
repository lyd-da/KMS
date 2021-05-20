import Announcements from '../models/announcements.js'
export const getPosts = async (req, res) =>{
    try{
        const announcement= await Announcements.find();
        res.status(200).json(announcement);
    }catch(error){
        res.status(404).json({message :error.message})
    }
}

export const createPost = async (req, res) =>{
    const post =req.body;
    const newAnnounce = new Announcements(post)
    try{
        await newAnnounce.save();
        res.status(201).json(newAnnounce);
    }catch(error){
        res.status(404).json({message :error.message})
    }
}