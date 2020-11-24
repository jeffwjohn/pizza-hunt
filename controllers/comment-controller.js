const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
          .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              { $push: { comments: _id } },
                 // Note here that we're using the $push method to add the comment's _id to the specific pizza we want to update. The $push method works just the same way that it works in JavaScript—it adds data to an array. All of the MongoDB-based functions like $push start with a dollar sign ($), making it easier to look at functionality and know what is built-in to MongoDB and what is a custom noun the developer is using.
              { new: true }
                 //  Because we passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included).
            );
          })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

      addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $push: { replies: body } },
          { new: true, runValidators: true } 
        )
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

      // remove reply
      removeReply({ params }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $pull: { replies: { replyId: params.replyId } } },
          { new: true }
        )
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => res.json(err));
      },
      
// Now, for the removeComment() method, remember that not only do we need to delete the comment, but we also need to remove it from the pizza it’s associated with. First we'll delete the comment, then we'll use its _id to remove it from the pizza.

  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = commentController;