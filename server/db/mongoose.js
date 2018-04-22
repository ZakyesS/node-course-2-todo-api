let mongoose = require('mongoose');

mongoose.Promise = global.Promise; //para que el mongoose use las promises.
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};