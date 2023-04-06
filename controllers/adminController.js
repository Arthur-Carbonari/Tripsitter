import Post from '../models/post.js';
import User from '../models/user.js';

const adminController = {

    usersGet: async (req, res) => {

        try {
            const users = await User.find({})
            res.json(users);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }

    },

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

    usersPatch: async (req, res) => {
        try {

            const { _id, ...updatedUser } = req.body

            const user = await User.findById(_id)

            for(let key in updatedUser){
                user[key] = updatedUser[key]
            }

            await user.validate()

            user.save()

            console.log("sucess", user);

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

            console.log(response);

            res.status(400).json(response)
        }
    },

    usersDelete: async (req, res) => {
        
        try {
            
            const { _id } = req.body;

            console.log(req.body);
    
            // Delete the user with the given ID from the database
            await User.findByIdAndDelete(_id)

            console.log("here on the server");

            res.status(201).json({ sucess: true})


        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting user'); 
        }
    },

    // admin Posts controllers

    postsPost: async (req, res) => {

        // Code to create a new post goes here
        try {

            const { title, content, imagePath, imageDescription } = req.body;

            // Create a new post object
            const newPost = new Post({
                title,
                content,
                imagePath,
                imageDescription,
            });

            // Save the new post object to MongoDB
            await newPost.save();

            res.status(201).json({ message: "Post created successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    
    }
}

export default adminController