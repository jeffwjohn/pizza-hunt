const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');
// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them.

// So for the most part, this feels a lot like Sequelize. We essentially create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types. We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: 'You need to provide a pizza name!',
        trim: true
        // Notice the trim option that's been added, which works just like the JavaScript .trim() method and removes white space before and after the input string. You'll find that useful when working with username and password data.
      },
      createdBy: {
        type: String,
        required: true,
        trim: true
      },
      
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
      // To use a getter in Mongoose, we just need to add the key get to the field we are looking to use it with in the schema. Just like a virtual, the getter will transform the data before it gets to the controller(s).
    },
    size: {
        type: String,
        required: true,
        // If you were to provide a custom error message for the required option here, you wouldn't receive it if you provide a size that isn't listed in the enum option. If you want to provide a custom message for enumerable values, you need to look into implementing the validate option Mongoose lets you use, where you can create a custom function to test the values, just like you did with Inquirer!
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
// PizzaSchema.virtual('commentCount').get(function() {
//     return this.comments.length;
//   });

// let's update the pizza's virtual commentCount so that it includes all replies as well:
PizzaSchema.virtual('commentCount').get(function() {
    // Like .map(), the array prototype method .reduce() executes a function on each element in an array. However, unlike .map(), it uses the result of each function execution for each successive computation as it goes through the array. This makes it a perfect candidate for getting a sum of multiple values.
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  });

  // create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

// The .reduce() method can do more than just tally up sums, though. What if you needed to get the average years of experience of a team of software developers? Sure, you could write a for loop with some logic. Or, instead, you could write a clean map and reduce function.

// Review the following code:

// const developers = [
//   {
//     name: "Eliza",
//     experience: 7,
//     role: "manager"
//   },
//   {
//     name: "Manuel",
//     experience: 2,
//     role: "developer"
//   },
//   {
//     name: "Kim",
//     experience: 5,
//     role: "developer"
//   }
// ];

// function calculateAverage(total, years, index, array) {
//   total += years;
//   return index === array.length-1 ? total/array.length: total
// }

// const average = developers.map(dev => dev.experience).reduce(calculateAverage);
// In this case, map grabs just the years of experience from each developer. Then .reduce() is used to continually add on to a value within the scope of the method known as the accumulator, then divide by the length of the entire array. The built-in .reduce() method is great for calculating a value based off of the accumulation of values in an array.

// You may not use .reduce() that often, but when you do, you'll find it can provide very elegant and clean solutions.