import express from "express"

import homeRouter from "./home.js"
import blogRouter from "./blog.js"
import authRouter from "./auth.js"

const mainRouter = express.Router()

mainRouter.use("/", homeRouter)
mainRouter.use("/blog", blogRouter)
mainRouter.use("/auth", authRouter)

export default mainRouter