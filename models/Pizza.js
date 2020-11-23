const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');
// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them.

// So for the most part, this feels a lot like Sequelize. We essentially create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types. We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema({
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
      // To use a getter in Mongoose, we just need to add the key get to the field we are looking to use it with in the schema. Just like a virtual, the getter will transform the data before it gets to the controller(s).
    },
    size: {
      type: String,
      default: 'Large'
    },
    //Notice the empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.
    toppings: [],
    comments: [
        {
              // Specifically, we need to tell Mongoose to expect an ObjectId and to tell it that its data comes from the Comment model.
          type: Schema.Types.ObjectId,
          ref: 'Comment'
        }
      ]
  },
  // we need to tell the schema that it can use virtuals:
  {
    toJSON: {
      virtuals: true,
      getters: true
      //  we'll need to tell the Mongoose model that it should use any getter function we've specified.
    },
    id: false
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
  );
// Virtuals allow you to add virtual properties to a document that aren't stored in the database. They're normally computed values that get evaluated when you try to access their properties. For example, once everything is set up correctly, you'll want to be able to access the number of comments on a pizza with the following statement:

// const pizza = await Pizza.findOne()
// pizza.commentCount // 5

  // Virtuals allow us to add more information to a database response so that we don't have to add in the information manually with a helper before responding to the API request.
  
  // Get total count of comments and replies on retrieval:
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
  });

  // create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;