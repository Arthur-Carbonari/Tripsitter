import Article from "../models/Article.js";
import Categorie from "../models/Categorie.js";

const blogController = {


    /**
     * Controller function to handle GET request to display articles on the blog page.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves with rendering the blog page with articles.
     */
    blogGet: async (req, res) => {

        // gets the current page and the category from the query or sets it to default
        const currentPage = req.query.page || 1;
        const category = req.query.category || null;

        // number of articles per page
        const perPage = 4

        let articles
        let totalArticles

        // if category was specify we get only the articles of that category
        if (category) {
            const categoryDocument = await Categorie.findOne({ tag: category.toLowerCase() })

            articles = await Article.find({ _id: { $in: categoryDocument.articles } }).lean()

            totalArticles = articles.length

            const startIndex = (currentPage - 1) * perPage
            articles = articles.slice(startIndex, startIndex + perPage);
        }
        // otherwise we get all articles
        else {

            totalArticles = await Article.countDocuments()
            articles = await Article.find().skip((currentPage - 1) * perPage).limit(perPage).lean();

        }

        // and render the blog page
        res.render('blog', { title: 'Blog', year: new Date().getFullYear(), articles, category, currentPage, pages: Math.ceil(totalArticles / perPage) });
    },

    /**
     * Controller function to handle GET request to display an article by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves with rendering the article page.
     */
    blogIdGet: async (req, res) => {

        const article = await Article.findById(req.params.id).lean()

        if (article) {
            res.render('article', { title: article.title, year: new Date().getFullYear(), article: article });
        } else {
            res.status(404).send('Post not found');
        }

    },

    /**
     * Controller function to handle POST request to add a new comment to an article.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves with adding a new comment to an article.
     */
    commentsPost: async (req, res) => {
        try {

            const body = req.body.body

            // if the body is empty send an error
            if (!body) return res.status(400).json({ body: { message: "Comment can't be empty." } })

            // get the article that the comment was made on
            const article = await Article.findById(req.params.id)

            if (!article) {
                return res.status(404).send('Post not found')
            }

            const comment = {
                username: res.locals.username,
                body,
                date: new Date()
            }

            // add comment to the article and save it
            article.comments.push(comment)
            await article.save()

            // get back the comment document from the article (this is needed cause the id is used in the front end)
            const newComment = article.comments.slice(-1)[0];

            // send back the comment to the client
            res.status(201).json({ sucess: true, newComment })

        } catch (error) {
            console.error(error)
            res.status(500).send('Internal Server Error')
        }
    },

    /**
     * Controller function to handle DELETE request to delete a comment from an article.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves with deleting a comment from an article.
     */
    commentsDelete: async (req, res) => {

        try {

            // gets article
            const article = await Article.findById(req.params.id)

            if (!article) {
                return res.status(404).send('Post not found')
            }

            // gets the comment id from the req body
            const commentId = req.body.commentId

            // finds its index
            const index = article.comments.findIndex(comment => comment._id == commentId);

            // if the user didnt the comment and he inst an admin the request is recused 
            if (!(article.comments[index].username === res.locals.username || res.locals.adminRights)) {
                return res.status(400).json({ sucess: false })
            }

            // otherwise the comment is removed from the article 
            article.comments.splice(index, 1);

            await article.save()

            res.status(201).json({ sucess: true })


        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error')
        }
    }


}

export default blogController