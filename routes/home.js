import express from 'express';

import Post from '../models/Article.js';

const homeRouter = express.Router();

// route for the home of the blog
homeRouter.get('/', async (req, res) => {
    const posts = await Post.find().sort({ date: 'desc' }).limit(10).lean();
    
    res.render('home', { title: 'My Blog', year: new Date().getFullYear(), posts: posts});
});

export default homeRouter;
