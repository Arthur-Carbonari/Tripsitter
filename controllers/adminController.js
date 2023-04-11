import Article from '../models/Article.js';
import Categorie from '../models/Categorie.js';
import User from '../models/user.js';

const adminController = {

    /**
     * Method for getting all the user in the database
     */
    usersGet: async (req, res) => {

        try {
            const users = await User.find({})
            res.json(users);
        } catch (err) {
            res.status(500).send('Internal server error');
        }

    },

    /**
     * Method to post a new user to the database
     */
    usersPost: async (req, res) => {
        try {

            const { firstName, lastName, email, username, password, adminRights } = req.body

            //check if email exists in db
            const newUser = await User.create( {firstName, lastName, email, username, password, adminRights})

            console.log(newUser);

            res.status(201).json({ sucess: true, newUser });

        } catch (err) {

            let response = {sucess: false}
            
            // Check if error is emails or username already registered to website
            if(err.code === 11000){

                // if it is we need to compose the error message

                // error message for taken email
                if(err.keyValue['email']){
                    response['email'] = {message: "Account already associated with this email"}
                }
                // error message for taken username
                if(err.keyValue['username']){
                    response['username'] = {message: "Username is unavailable"}
                }

            }
            // if its not, moongose already generates the error messages for us
            else{
                response = err.errors
            }

            res.status(400).json(response)
        }  
    },

    /**
     * Controller to update the user in the database
     */
    usersPatch: async (req, res) => {
        try {

            // gets values from the body
            const { _id, username, firstName, lastName, email, adminRights } = req.body

            // gets the user
            const user = await User.findById(_id)

            // update user fields
            user.username = username
            user.firstName = firstName
            user.lastName = lastName
            user.email = email
            user.adminRights = adminRights
            
            // validates the user
            await user.validate()
            
            // then saves it
            await user.save()

            res.status(201).json({ sucess: true, user });

        } catch (err) {
            console.log(err);
            let response = { sucess: false }

            // Check if error is emails or username already registered to website
            if (err.code === 11000) {

                // if it is we need to compose the error message

                // error message for taken email
                if (err.keyValue['email']) {
                    response['email'] = { message: "Account already associated with this email" }
                }
                // error message for taken username
                if (err.keyValue['username']) {
                    response['username'] = { message: "Username is unavailable" }
                }

            }
            // if its not, moongose already generates the error messages for us
            else {
                response = err.errors
            }

            res.status(400).json(response)
        }
    },

    // controller method for deleting a user from the db
    usersDelete: async (req, res) => {
        
        try {
            
            // gets the user id
            const { _id } = req.body;
    
            // Delete the user with the given ID from the database
            await User.findByIdAndDelete(_id)

            res.status(201).json({ sucess: true, userId: _id})

        } catch (err) {
            console.error(err);
            res.status(500).send(err.errors); 
        }
    },


    // method to get all the articles from the database
    articlesGet: async(req, res) => {

        try {
            const articles = await Article.find({}).lean()

            res.json(articles);
        } catch (err) {
            res.status(500).send('Internal server error');
        }

    },

    // controller method to post a new article to the database
    articlesPost: async (req, res) => {

        // Code to create a new post goes here
        try {

            // get all the vars from the req body
            const { title, body, coAuthors, imageURL, imageDescription } = req.body;

            // checks if tags exists, if it does parse it, otherwise set it to default
            const tags =  req.body.tags ? req.body.tags.split(",").map(tag => tag.toLowerCase().trim()) : ['misc']

            // sets the author name to the username of who made the post
            const author = res.locals.username

            // Create a new post object
            const newArticle = new Article({
                title,
                body,
                author,
                coAuthors,
                tags,
                imageURL,
                imageDescription
            });

            // Save the new post object to MongoDB
            const articleDocument = await newArticle.save();

            await addTags(tags, articleDocument._id)

            res.status(201).json({ sucess:true, newArticle });
        } catch (err) {
            console.log(err);
            res.status(500).json(err.errors);
        }
    
    },

    // controller method to update a article
    articlesPatch: async (req, res) => {
        try {

            // get details from the req body
            const { _id, ...updatedArticle } = req.body


            // checks if tags exists, if it does parse it, otherwise set it to default
            updatedArticle.tags = req.body.tags ? req.body.tags.split(",").map(tag => tag.toLowerCase().trim()) : ['misc']

            const article = await Article.findById(_id)

            // gets the deleted and the added tags
            const deletedTags = article.tags.filter(tag => !updatedArticle.tags.includes(tag))
            const newTags = updatedArticle.tags.filter(tag => !article.tags.includes(tag))

            // update article, validate and save it
            for(let key in updatedArticle){
                article[key] = updatedArticle[key]
            }
            
            await article.validate()
            
            await article.save()

            // delete it from deleted tags and added to its added tags
            await deleteTags(deletedTags, _id)
            await addTags(newTags, _id)
            

            res.status(201).json({ sucess: true, article});

        } catch (err) {
            console.log(err);
            res.status(400).json(err.errors)
        }
    },


    // controller method to delete an article from the db
    articlesDelete: async (req, res) => {
        
        try {
            
            const { _id } = req.body;
    
            // Delete the article with the given ID from the database
            const article = await Article.findByIdAndDelete(_id)

            //delete the article from its categories tag
            if(article){
                await deleteTags(article.tags, _id)
            }

            res.status(201).json({ sucess: true, articleId: _id})


        } catch (err) {
            console.error(err);
            res.status(500).send(err.errors); 
        }
    },
}

// this function add the article id to all its tags elements
async function addTags(tags, articleId){

    tags.forEach(async tag => {
        const category = await Categorie.findOne({tag})

        if(category){
            category.articles.push(articleId)
            category.save()
        }
        else{
            const newCategory = new Categorie({tag, articles: [articleId]})
            await newCategory.save()
        }

    });

}

//this function removes the article id from its tags elements
async function deleteTags(tags, articleId){

    tags.forEach(async tag => {
        const category = await Categorie.findOne({tag})

        const categoryArticles = category.articles.filter(article => article != articleId)

        category.articles = categoryArticles

        await category.save()
    })

}

export default adminController