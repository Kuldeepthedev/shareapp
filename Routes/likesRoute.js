const express = require('express');
const likesRoute = express.Router();
const updatelike = require('../database/likeSchema')
require('mongoose');
require('dotenv').config();
likesRoute.post('/updatelike', async(req,resp)=>{
    const {username, Postid, like } = req.body;
    try{
        const post = await updatelike.findOne({PostId:Postid})
        if(post){
            if(like===1){
                let newlike = post.Like+1
                const updlike = await updatelike.updateOne({PostId:Postid},{$set:{Like:newlike}})
            }
            else if(like===0){
                let newdislike = post.Like-1
                const updislike = await updatelike.updateOne({PostId:Postid},{$set:{Like:newdislike}})
            }
        }
        else{
            const makelike = await updatelike.create({
                PostId:Postid,
                Like:like
            })
        }
        return  resp.status(200).json(post)
        

        
    }
    catch(error){

    }
})
module.exports = likesRoute;