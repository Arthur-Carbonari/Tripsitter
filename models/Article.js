import mongoose from 'mongoose';

// this package has lots of build in validation function
import validator from 'validator';

// Define the schema for a comment
const commentSchema = new mongoose.Schema({

  // field stores the usename of the user that made the comment
  username: {
    type: String,
    required: true
  },

  // field stores the body of the comment
  body: {
    type: String,
    required: true
  },

  // field stores the date and time of the comment
  date: {
    type: Date,
    default: Date.now
  },
});

// Define the schema for an article
const articleSchema = new mongoose.Schema({

  //field stores the title of the article
  title: {
    type: String,
    required: true,
    trim: true
  },

  //field stores the body of the article
  body: {
    type: String,
    required: true,
  },

  //field stores the author of the article
  author: {
    type: String,
    trim: true
  },

  //field stores the coAuthors of the article
  coAuthors: {
    type: String,
    trim: true
  },

  //field stores the tags of the article
  tags: {
    type: [String],

    // this validates that each one of the strings inside the tags array are only alphanumerical characters
    validate: [tags => {
      console.log(tags);
      return tags.filter(tag => !validator.isAlphanumeric(tag)).length == 0
    }, 'Tags can only contain alphanumeric characters in a comma separated list']
  },

  //field stores the url of the image of the article
  imageURL: {
    type: String,
    required: true,
    trim: true,
    validate: [validator.isURL, "Image URL is invalid"]
  },

  //field stores the description of the image of the article
  imageDescription: {
    type: String,
    required: true,
    trim: true
  },

  //field stores the date and time of the article
  date: {
    type: Date,
    default: Date.now,
  },

  //field stores all the comments made under the article
  comments: [commentSchema]
});

export default mongoose.model('Article', articleSchema);
