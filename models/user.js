import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from "validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [ validator.isEmail, "Please enter a valid email address"]
    },

    username: {
        type: String,
        require: [true, "Username is required"],
        unique: [true, "Username already in use"],
        minlength: [5, "Minimum username length is 5 characters"],
        validate: [ value => validator.matches(value, "^[a-zA-Z0-9_\.\-]*$"), "Username can only contain letters, numbers, '_' , '.' , and '-'"]
    },

    firstName: {
        type: String,
        require: [true, "First name is required"],
        validate: [ validator.isAlpha, "Invalid First Name"]
    },


    lastName: {
        type: String,
        require: [true, "Last name is required"],
        validate: [ validator.isAlpha, "Invalid Last Name"]
    },

    password: {
        type: String,
        required: [true, "Password required"],
        minlength: [8, "Minimum password length is 8 charaters"],
        validate: [ validator.isStrongPassword, "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"]
    },

    adminRights: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next) {

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

userSchema.statics.login = async function( emailOrUsername, password ){
    
    let user
    
    if( validator.isEmail(emailOrUsername)){
        user = await this.findOne( {email: emailOrUsername})
    }
    else{
        user = await this.findOne({ username: emailOrUsername})
    }

    if(user){
        const auth = await bcrypt.compare(password, user.password)

        if(auth) return user 
        
        throw new Error("Username or password incorrect")
        
    }
    else{
        throw new Error("Username or password incorrect")
    }

}

export default mongoose.model('user', userSchema)