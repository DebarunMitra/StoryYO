const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const StorySchema = new Schema({
  title:{
    type:String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  topic: {
    type: String,
    default:'public'
  },
  status: {
    type: String,
    default:'public'
  },
  point:{
    type: Number,
    default:0
  },
  allowComments: {
    type: Boolean,
    default:true
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{
      type: Schema.Types.ObjectId,
      ref:'users'
    }
  }],
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  date:{
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('stories', StorySchema, 'stories');
