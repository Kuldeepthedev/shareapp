const express = require('express');
const showsavepostRoute = express.Router();
require('mongoose');
require('dotenv').config();
const Post = require('../database/PostSchema');

showsavepostRoute.post('/showsaveposts', async (req, resp) => {
    const {username} = req.body

    try {
        let posts = await Post.find()
        const userSavedPosts = posts.filter(post => post.Saveby.includes(username));
        if(userSavedPosts.length > 0){
        
        resp.status(200).json(userSavedPosts);
    }
    } catch (error) {
        resp.status(400).json('Error in finding posts');
    }
});

module.exports = showsavepostRoute;
