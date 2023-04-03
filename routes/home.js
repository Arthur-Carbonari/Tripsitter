import express from 'express';

import Post from '../models/post.js';

const homeRouter = express.Router();

homeRouter.get('/', async (req, res) => {
    const posts = await Post.find().sort({ date: 'desc' }).limit(10).lean();
    
    posts.forEach( post => {
        post.date = post.date.toLocaleString()
    })

    res.render('home', { title: 'My Blog', year: new Date().getFullYear(), posts: posts});
});

export default homeRouter;
