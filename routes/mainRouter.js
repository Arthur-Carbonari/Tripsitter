import express from "express"

import homeRouter from "./home.js"

const mainRouter = express.Router()

mainRouter.use('/', homeRouter)

export default mainRouter