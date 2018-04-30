let {User} = require('./../models/user');

/* middleware para comprobar al usuario que se autentifica*/

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token).then((user) => {    //busca el token(con el header pasado en la solicitud)
        if(!user){
            return Promise.reject();    //si no hay user, devuelve el reject de una promise.
        }

        // modificamos la solicitud con el user y el token que encontri buscando por el token.
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {   //si no hay éxito al buscar el user, enviará un error con un 401 -> Unauthorized.
        res.status(401).send();
    });
};

module.exports = {authenticate};