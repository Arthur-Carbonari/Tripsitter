import express from "express"

import homeRouter from "./home.js"
import blogRouter from "./blog.js"

const mainRouter = express.Router()

mainRouter.use("/", homeRouter)
mainRouter.use("/blog", blogRouter)

export default mainRouter