import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from "validator";

// Define the schema for a User
const userSchema = new mongoose.Schema({

    // field stores the user email
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [ validator.isEmail, "Please enter a valid email address"]
    },

    // field stores the user username
    username: {
        type: String,
        require: [true, "Username is required"],
        unique: [true, "Username already in use"],
        minlength: [5, "Minimum username length is 5 characters"],
        validate: [ value => validator.matches(value, "^[a-zA-Z0-9_\.\-]*$"), "Username can only contain letters, numbers, '_' , '.' , and '-'"]
    },

    // field stores the user first name
    firstName: {
        type: String,
        require: [true, "First name is required"],
        validate: [ validator.isAlpha, "Invalid First Name"]
    },

    // field stores the user last name
    lastName: {
        type: String,
        require: [true, "Last name is required"],
        validate: [ validator.isAlpha, "Invalid Last Name"]
    },

    // field stores the user cryptographied password
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: [8, "Minimum password length is 8 charaters"],
        validate: [ validator.isStrongPassword, "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"]
    },

    // field stores if the user has admin rights or not
    adminRights: {
        type: Boolean,
        default: false
    }
})

// This function will before saving an user in the database, will add a salt to the password do increase security
userSchema.pre('save', async function(next) {

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

// This function is responsible for logging the user in
userSchema.statics.login = async function( emailOrUsername, password ){
    
    let user
    
    // checks if the user has logged in with an email or its username, and gets the matching user if any
    if( validator.isEmail(emailOrUsername)){
        user = await this.findOne( {email: emailOrUsername})
    }
    else{
        user = await this.findOne({ username: emailOrUsername})
    }

    // if the user was found it compares the password the used in the login field with the one saved in the database, the password are compared after being crytographied
    if(user){
        const auth = await bcrypt.compare(password, user.password)

        //if the password matches user is logged in, otherwise error is thrown
        if(auth) return user 
        
        throw new Error("Username or password incorrect")
    }
    else{
        throw new Error("Username or password incorrect")
    }

}

export default mongoose.model('user', userSchema)