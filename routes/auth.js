// routes/auth.js

import express from 'express';
const authRouter = express.Router();

// Route for displaying the user login/registration form and to login an existing user
authRouter.route('/')
    .get((req, res) => {
        res.render('auth', { title: 'Login', year: new Date().getFullYear() });
    })
    .post((req, res) => {
        // login user here
    });

// Post route to register a new user
authRouter.post('/register', (req, res) => {
});

// Route for handling user logout
authRouter.get('/logout', (req, res) => {

    // logout user here

    res.redirect('/');
});

export default authRouter;
