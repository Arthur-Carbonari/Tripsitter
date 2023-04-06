import express from "express"

// imports the sub routers
import homeRouter from "./home.js"
import blogRouter from "./blog.js"
import authRouter from "./auth.js"
import adminRouter from "./admin.js"

// imports the middleware
import authMiddleware from "../middleware/authMiddleware.js"

const mainRouter = express.Router()

mainRouter.use("/auth", authRouter)

mainRouter.use(authMiddleware.authenticateUser)

mainRouter.use("/", homeRouter)
mainRouter.use("/blog", blogRouter)

mainRouter.use("/admin", authMiddleware.requireAdminAuth, adminRouter)

export default mainRouter