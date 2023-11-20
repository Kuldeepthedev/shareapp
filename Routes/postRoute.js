const express = require('express');
const postRoute=  express.Router();
require('mongoose');
require('dotenv').config();
const Post = require('../database/PostSchema')

var fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid')

const multer  = require('multer')
const DIR = './uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const  upload = multer({
    storage: storage,
    limits: { fileSize: 150000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
postRoute.post('/userpost', upload.single('post'), async (req, resp) => {
    const url = req.protocol + '://' + req.get('host')
    const { username, Description , Profileimage } = req.body;
    let Image = url + '/uploads/' + req.file.filename
     
    
   
    try {
        
            const savepost = await Post.create(
                 {
                        username:username,
                        Description:Description,
                        Postimage:Image,
                        Profileimage: Profileimage,
                        Like:"0",
                        Likeby: [],
                        Save:"0"
                        

                    }
              
            );
            if (savepost) {
                     resp.status(200).json("post Saved");
                }
            
        }
    
           catch (error) {
        resp.status(400).json("Bad request");
    }
})
postRoute.post('/postlike', async (req, resp) => {
    const { username, Postid } = req.body;

    try {
        const post = await Post.findOne({ _id: Postid });

        if (post) {
            if (post.Likeby.includes(username)) {
                
                let newlike = post.Like - 1;
                await Post.updateOne({ _id: Postid }, { $pull: { Likeby: username }, $set: { Like: newlike } });
            } else {
                
                let newlike = post.Like + 1;
                await Post.updateOne({ _id: Postid }, { $push: { Likeby: username }, $set: { Like: newlike } });
            }
        }

        const updatedPost = await Post.findOne({ _id: Postid });
        resp.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

postRoute.post('/postsave', async (req, resp) => {
    const { username, Postid } = req.body;

    try {
        const post = await Post.findOne({ _id: Postid });

        if (post) {
            if (post.Saveby.includes(username)) {
                
                let newSave = post.Save - 1;
                await Post.updateOne({ _id: Postid }, { $pull: { Saveby: username }, $set: { Save: newSave } });
            } else {
                
                let newSave = post.Save + 1;
                await Post.updateOne({ _id: Postid }, { $push: { Saveby: username }, $set: { Save: newSave } });
            }
        }

        const updatedPost = await Post.findOne({ _id: Postid });
        resp.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});


postRoute.post('/comment', async (req, resp) => {
    const { username, comment, postid,Profileimg } = req.body;
    try {
        const post = await Post.findOne({ _id: postid });
        if (post) {
            const addcomment = await Post.updateOne({ _id: postid }, {
                $push: {
                    Comment: {
                        username: username,
                        comment: comment,
                        Profileimage:Profileimg,
                        date: new Date()
                    }
                }
            });
            resp.status(200).json({ message: 'Comment added successfully' });
        } else {
            resp.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = postRoute;
