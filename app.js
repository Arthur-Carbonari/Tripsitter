import express from "express"
import { engine } from 'express-handlebars';

import mainRouter from "./routes/mainRouter.js";

const app = express();

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'))
app.use(mainRouter)

app.listen(5000)

console.log("Listening on port 5000")