const express = require('express');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/pizza-hunt', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));

// Think back to how you created servers in previous applications. We've used both of the following approaches:

// Set it up so that the routes directory holds not only the routes but also the functionality for those endpoints to perform.

// Tightly follow MVC patterns and hold both the routes and functionality in a controllers directory.

// Both of the preceding server structures are perfectly acceptable, and you may encounter both as you work with other developers. But how about a structure that separates routes and functionality completely? For this project, you’ll create the functionality in controllers and the endpoints in routes. You’ll end up with more files but much cleaner code.
