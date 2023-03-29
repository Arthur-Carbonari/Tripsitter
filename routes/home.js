import express from 'express';

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('home', { title: 'My Blog', year: new Date().getFullYear() });
});

export default homeRouter;
