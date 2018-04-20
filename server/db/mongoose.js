let mongoose = require('mongoose');

mongoose.Promise = global.Promise; //para que el mongoose use las promises.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose};