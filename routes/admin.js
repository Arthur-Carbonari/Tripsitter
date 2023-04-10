import express from 'express';

import Post from '../models/Article.js';
import adminController from '../controllers/adminController.js';

const adminRouter = express.Router();

// Route for displaying the admin dashboard
adminRouter.get('/', (req, res) => { res.render('adminDashboard', { title: 'Admin Dashboard' }) });

// Route for displaying the admin user control interface
adminRouter.route('/users')
    .get(adminController.usersGet)
    .post(adminController.usersPost)
    .patch(adminController.usersPatch)
    .delete(adminController.usersDelete)

// Route for displaying the admin articles control interface
adminRouter.route('/articles')
    .get(adminController.articlesGet)
    .post(adminController.articlesPost)
    .put((req, res) => {
        // Code to update a article goes here
    })
    .delete(adminController.articlesDelete);



export default adminRouter;
