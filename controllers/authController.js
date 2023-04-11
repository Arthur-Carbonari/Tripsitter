
import jwt from 'jsonwebtoken'

import User from "../models/user.js";

//max age is of 1 day
const maxAge = 1 * 24 * 60 * 60

/**
 * Create a new JWT token with the given user ID
 *
 * @param {string} id - The ID of the user to create a token for
 * @returns {string} The newly created JWT token
 */
const createAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge })
}

/**
 * A controller for handling authentication-related requests
 */
const authController = {

    /**
     * Handle a POST request to log a user in
     *
     * @param {object} req - The HTTP request object
     * @param {object} res - The HTTP response object
     */
    loginPost: async (req, res) => {

        try {
            const { emailOrUsername, password } = req.body
                        
            const user = await User.login(emailOrUsername, password)

            // Create a new JWT token for the logged-in user
            const authToken = createAuthToken(user._id)

            // Set the JWT token as an HTTP-only cookie
            res.cookie('jwt_token', authToken, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ sucess: true });

        } catch (err) {

            if(err.message === "Username or password incorrect"){

                res.status(400).json({emailOrUsername: {message: err.message}})
                return
            }

            res.status(400).json(err)
        }
    },

    /**
     * Handle a POST request to create a new user account
     *
     * @param {object} req - The HTTP request object
     * @param {object} res - The HTTP response object
     */
    signupPost: async (req, res) => {
        try {

            const { firstName, lastName, email, username, password } = req.body

            // Check if email already exists in the database and create a new user if it does not
            const newUser = await User.create( {firstName, lastName, email, username, password})

            // Create a new JWT token for the newly created user
            const authToken = createAuthToken(newUser._id)

            // Set the JWT token as an HTTP-only cookie
            res.cookie('jwt_token', authToken, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ sucess: true });

        } catch (err) {

            let response = {sucess: false}
            
            // Check if error is emails or username already registered to website
            if(err.code === 11000){

                // if it is we need to compose the error message

                // error message for taken email
                if(err.keyValue['email']){
                    response['email'] = {message: "Account already associated with this email"}
                }
                // error message for taken username
                if(err.keyValue['username']){
                    response['username'] = {message: "Username is unavailable"}
                }

            }
            // if its not, moongose already generates the error messages for us
            else{
                response = err.errors
            }

            res.status(400).json(response)
        }
    },

    /**
     * Handle a GET request to logout a user account
     *
     * @param {object} req - The HTTP request object
     * @param {object} res - The HTTP response object
     */
    logoutGet: (req, res) => {

        // logout user by destroying the token
        res.clearCookie('jwt_token');

        // redirect to home page
        res.redirect('/')
    }

}

// Export the controller
export default authController