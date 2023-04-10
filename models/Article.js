import mongoose from 'mongoose';
import validator from 'validator';


const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    trim: true
  },
  coAuthors: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    validate: [tags => {
      console.log(tags);
      return tags.filter(tag => !validator.isAlphanumeric(tag)).length == 0
    }, 'Tags can only contain alphanumeric characters']
  },
  imageURL: {
    type: String,
    required: true,
    trim: true,
    validate: [validator.isURL, "Image URL is invalid"]
  },
  imageDescription: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Article', articleSchema);
