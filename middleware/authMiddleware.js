import * as dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

const authMiddleware = {

    authenticateUser: (req, res, next) => {

        const token = req.cookies.jwt_token

        if(!token) return next()

        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            
            if(err) return next()

            res.locals.username = decodedToken.username            
            res.locals.adminRights = decodedToken.adminRights
            
            next()
        })

    },

    requireAdminAuth: (req, res, next) => {
        
            if(!res.locals.adminRights) return res.redirect('/')
            
            next()   
    }
}
    
export default authMiddleware