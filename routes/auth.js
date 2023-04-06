// routes/auth.js

import express from 'express';

import authController from '../controllers/authController.js';

const authRouter = express.Router();

// Route for displaying the user login/registration form and to login an existing user
authRouter.post('/login', authController.loginPost)

// Post route to register a new user
authRouter.post('/signup', authController.signupPost)

// Route for handling user logout
authRouter.get('/logout', authController.logoutGet)

export default authRouter;
