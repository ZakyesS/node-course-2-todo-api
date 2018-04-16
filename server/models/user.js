let mongoose = require('mongoose');

let User = mongoose.model('User', {
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1,
    }
});

module.exports =  {User};