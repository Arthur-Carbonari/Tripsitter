import express from 'express';

import Post from '../models/post.js';
import adminController from '../controllers/adminController.js';

const adminRouter = express.Router();

// Route for displaying the admin dashboard
adminRouter.get('/', (req, res) => { res.render('admin/dashboard', { title: 'Admin Dashboard' }) });

// Route for displaying the admin user control interface
adminRouter.route('/users')
    .get(adminController.usersGet)
    .post(adminController.usersPost)
    .patch(adminController.usersPatch)
    .delete(adminController.usersDelete)

// Route for displaying the admin posts control interface
adminRouter.route('/posts')
    .get((req, res) => { res.render('admin/posts', { title: 'Admin list of posts' }) })
    .post(adminController.postsPost)
    .put((req, res) => {
        // Code to update a post goes here
    })
    .delete((req, res) => {
        // Code to delete a post goes here
    });



export default adminRouter;
