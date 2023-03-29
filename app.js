import express from "express"
import { engine } from 'express-handlebars';

import mainRouter from "./routes/mainRouter.js";

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(mainRouter)

app.listen(5000)

console.log("Listening on port 5000")