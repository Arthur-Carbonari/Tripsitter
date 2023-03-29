// routes/blog.js

import express from 'express';

const blogRouter = express.Router();

// Route for displaying all posts
blogRouter.get('/', (req, res) => {
    res.render('blog', { title: 'Blog', year: new Date().getFullYear() });
});

// Route for displaying a specific post
blogRouter.get('/:id', (req, res) => {

    const id = req.params.id;
    console.log("post id is ", id);

    const post = { title: "Title of the post" } // later change this to get the post

    if (post) {
        res.render('post', { title: post.title, year: new Date().getFullYear(), postId: id });
    } else {
        res.status(404).send('Post not found');
    }
});

export default blogRouter;
