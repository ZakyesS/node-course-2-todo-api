const mongoose = require('mongoose');
const validator = require('validator'); // llamar a la librería validator para validar el email.
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1,
        unique: true,
        validate: {
            //Custom function
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },

            // O se puede hacer sin una custom func que tb servirá el método(ya que devuelve true si es un email o false si no lo es).
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    // tokens --> array de objetos, caracteristica de MONGO DB, pero no disponible en SQL DB
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    }],
});

UserSchema.methods.toJSON = function() {    //para que convierta y devuelva al user un objeto con el id y el email(los demas datos del user no tiene por qué verlos).
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {   //UserSchema.methods.nombrequequeramosparaelmét --> es un objeto donde van los nuestros porpios métodos.
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    //user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

let User = mongoose.model('User', UserSchema);

module.exports =  {User};