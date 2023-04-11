import express from "express"

// imports the sub routers
import homeRouter from "./home.js"
import blogRouter from "./blog.js"
import authRouter from "./auth.js"
import adminRouter from "./admin.js"

// imports the middleware
import authMiddleware from "../middleware/authMiddleware.js"

// the main router for the website localized on the root of the site /, will organize all subroutes on it here
const mainRouter = express.Router()

// add auth router
mainRouter.use("/auth", authRouter)

// add middleware to authenticate if user is logged in or not on all other routes, this doesnt stop the user from proceding only checks if its logged in and stores info about the user if he is
mainRouter.use(authMiddleware.authenticateUser)

// adds home router
mainRouter.use("/", homeRouter)

// add blog router
mainRouter.use("/blog", blogRouter)

// add admin router
mainRouter.use("/admin", authMiddleware.requireAdminAuth, adminRouter)

// Define a 404 middleware function that handles all requests that do not match any routes
mainRouter.use((req, res, next) => {
    res.status(404).send('Sorry, page not found');
});
  

export default mainRouter