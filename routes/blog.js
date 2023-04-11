// routes/blog.js

import express from 'express';

import blogController from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const blogRouter = express.Router();

// Route for displaying all posts
blogRouter.get('/', blogController.blogGet);

// Route for displaying a specific post
blogRouter.get('/:id', blogController.blogIdGet);

// add middleware here to protect following routes from non user access 
blogRouter.use(authMiddleware.requireUserAuth)

// route used for comments posting and deletion
blogRouter.route('/:id/comments')
    .post(blogController.commentsPost)
    .delete(blogController.commentsDelete)

export default blogRouter;
