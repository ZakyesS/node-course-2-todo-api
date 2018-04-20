let mongoose = require('mongoose');

mongoose.Promise = global.Promise; //para que el mongoose use las promises.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {  //se exporta para que lo puedan usar los demás js.
    mongoose    //es lo mismo que en ES5 mongoose: mongoose.
};