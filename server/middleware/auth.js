import jwt from 'jsonwebtoken';
import config from 'config';


export default function(req, res, next){
    //get token from header
    const token = req.header('x-auth-token');

    //check if not token
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }
    //verfiy token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user=decoded.user;
        next();
    }catch(err){
        return res.status(401).json({msg:'Token is not valid'});
    }
}