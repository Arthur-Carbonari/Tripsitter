import * as dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

import User from '../models/user.js'

// middleware used to handle auth
const authMiddleware = {

    // checks if the user is logged in, if he is saves some information about him on the res locals
    authenticateUser: async (req, res, next) => {

        const token = req.cookies.jwt_token

        if (!token) return next()

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {

            if (err) return next()

            try {
                const user = await User.findById(decodedToken.id)

                res.locals._id = user._id
                res.locals.username = user.username
                res.locals.adminRights = user.adminRights

            } catch (error) {
                return next()
            }

            next()
        })

    },

    // only allows users that are logged in to procced
    requireUserAuth: (req, res, next) => {

        if (!res.locals.username) return res.status(401).json({loggedIn: false})

        next()
    },

    // only allows admins to procced
    requireAdminAuth: (req, res, next) => {

        if (!res.locals.adminRights) return res.redirect('/')

        next()
    }
}

export default authMiddleware