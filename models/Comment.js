const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Now we'll work on integrating replies with comments. Just like comments, we could use another model for replies, but it’s not really necessary since we'll never query for just reply data. Instead, let's take advantage of some of the flexibility that MongoDB provides and create replies as a subdocument array for comments. To normalize it, we'll create a schema for it.
const ReplySchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment _id
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      replyBody: {
        type: String
      },
      writtenBy: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },
    {
        toJSON: {
          getters: true
        }
    }
  );

  
const CommentSchema = new Schema({
  writtenBy: {
    type: String
  },
  commentBody: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  replies: [ReplySchema]
  // Note that unlike our relationship between pizza and comment data, replies will be nested directly in a comment's document and not referred to.
 
},
{
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
  });
  
const Comment = model('Comment', CommentSchema);

module.exports = Comment;
