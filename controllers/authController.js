import * as dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

import User from "../models/user.js";

//max age is of 1 day
const maxAge = 1 * 24 * 60 * 60

const createAuthToken = (id, username, adminRights) => {
    return jwt.sign({ id, username, adminRights }, process.env.JWT_SECRET, { expiresIn: maxAge })
}

const authController = {


    loginPost: async (req, res) => {

        try {
            const { emailOrUsername, password } = req.body
            
            const user = await User.login(emailOrUsername, password)

            const authToken = createAuthToken(user._id, user.username, user.adminRights)

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

    signupPost: async (req, res) => {
        try {

            const { firstName, lastName, email, username, password } = req.body

            //check if email exists in db
            const newUser = await User.create( {firstName, lastName, email, username, password})

            const authToken = createAuthToken(newUser._id, newUser.username, newUser.adminRights)

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

    logoutGet: (req, res) => {

        // logout user by destroying the token
        res.clearCookie('jwt_token');

        // redirect to home page
        res.redirect('/')
    }

}

// Export the controller
export default authController