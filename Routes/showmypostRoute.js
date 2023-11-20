const express = require('express');
const showmypostRoute = express.Router();
require('mongoose');
require('dotenv').config();
const Post = require('../database/PostSchema');

showmypostRoute.post('/showmyposts', async (req, resp) => {
    const {username} = req.body

    try {
        let findpost = await Post.find({username:username})
        if(findpost){
        const posts = await Post.find({username:username});
        resp.status(200).json(posts);
    }
    } catch (error) {
        resp.status(400).json('Error in finding posts');
    }
});

module.exports = showmypostRoute;
