const express = require('express');
const showpostRoute = express.Router();
require('mongoose');
require('dotenv').config();
const Post = require('../database/PostSchema');

showpostRoute.get('/showposts', async (req, resp) => {
    try {
        const posts = await Post.find();
        resp.status(200).json(posts);
    } catch (error) {
        resp.status(400).json('Error in finding posts');
    }
});

module.exports = showpostRoute;
