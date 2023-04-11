import mongoose from "mongoose";
import validator from "validator";

// Define the schema for a Category
const categorySchema = new mongoose.Schema({

    // field stores the category tag name
    tag: {
        type: String,
        unique: true,
        lowercase: true,
        validation: [validator.isAlphanumeric, 'Tag can only include alphanumerica characters']
    },

    // field stores the id of all articles in this category
    articles: {
        type: [String],
        default: []
    }
})

export default mongoose.model('category', categorySchema)