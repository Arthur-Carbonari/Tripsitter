import express from "express"

const app = express()

app.get('/', (req, res) => {
    res.send("Welcome to the home page")
})

app.listen(5000)

console.log("Listening on port 5000")