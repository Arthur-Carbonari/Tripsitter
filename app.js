import * as dotenv from 'dotenv'
dotenv.config()
import express from "express"
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';

import mainRouter from "./routes/mainRouter.js";

const app = express();

const PORT = process.env.PORT || 3000

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Fatal Error connecting to MongoDB:\n', error);
        process.exit(1);
    }
};
await connectToMongoDB();

// Setup view engine handlebars
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// Setup middleware
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

//Router
app.use(mainRouter)

app.listen(PORT)

console.log("Listening on port", PORT)