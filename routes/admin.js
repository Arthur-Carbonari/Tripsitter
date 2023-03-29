import express from 'express';
const adminRouter = express.Router();

// Route for displaying the admin dashboard
adminRouter.get('/', (req, res) => {
    // Render the admin dashboard view
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

// Route for displaying the admin user control interface
adminRouter.route('/users')
    .get((req, res) => {
        // Code to display the list of users goes here
        res.render('admin/users', { title: 'Admin list of users' });
    })
    .post((req, res) => {
        // Code to create a new user goes here
    })
    .put((req, res) => {
        // Code to update a user goes here
    })
    .delete((req, res) => {
        // Code to delete a user goes here
    });

// Route for displaying the admin posts control interface
adminRouter.route('/posts')
.get((req, res) => {
    // Code to display the list of posts goes here
    res.render('admin/posts', { title: 'Admin list of posts' });
})
.post((req, res) => {
    // Code to create a new post goes here
})
.put((req, res) => {
    // Code to update a post goes here
})
.delete((req, res) => {
    // Code to delete a post goes here
});



export default adminRouter;
