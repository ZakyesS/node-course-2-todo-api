const mongoose = require('mongoose');
const validator = require('validator'); // llamar a la librería validator para validar el email.
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    //user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

// Para eliminar el token del usuario registrado y poder desloguearse.
UserSchema.methods.removeToken = function(token) {
    let user = this;

    return user.update({
        $pull: {    //$pull --> elimina todo lo que contiene un array(tokens).
            tokens: {token}
                // token: token
        }
    });
};


//
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
};

UserSchema.statics.findByCredentials = function(email, password) {  //nuevo mét para que busque por el email y el pass.
    let User = this;
    
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => { //compara el passw pasado(text plano) con el que hay en la db(hasheado).
                if(res){
                    resolve(user);  //si res === true resuelve y envia el user.
                }
                else{
                    reject();   //rechaza y envia cuerpo vacío.
                }
            });
            
        });
    });
};


UserSchema.pre('save', function(next) { //antes de guardar haz lo siguiente:
    let user = this;
    if(user.isModified('password')){    //comprobar si el password es modificado.
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) =>{
            user.password = hash;    //cambiamos el password en texto plano al password hasheado.
            next();
            });
        });
    }else{
        next();
    }
});


let User = mongoose.model('User', UserSchema);

module.exports =  {User};