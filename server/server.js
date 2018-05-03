require('./config/config');
const _ = require('lodash');

const {ObjectID} = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');


let {mongoose} = require('./db/mongoose');  //se le require la conexión que es un js que está exportado en db/
//es lo mismo ./db/mongoose.js que ./db/mongoose, se puede obviar la extensión.

let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');


let app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); //express usa el met use, y se le pasa como parm el bodyParser 
                            //que va a ser un obj y se le pasa el .json() para que lo convierta a string.

// app.post('/todos', (req, res) => {
//     console.log(req.body);
// });

app.post('/todos', (req, res) => {
    let todo = new Todo({       //Se va a crear una nueva instancia del modelo todo, 
        text: req.body.text,    //en el que la propiedad text va a contener lo que viene del mét post, del cuerpo y del text.
    });

    todo.save().then((doc) => { //se guarda la instancia(el save() devuelve una promise).
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);    //respuesta.estado(400).envia(error);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

/*
Challenge 
    validar id{
        Si no es un id -> devolver un 404 con un send vacio.
    }

    buscar por id{
        exito{
            si hay un todo -> enviarlo
            sino hay --> enviar un 404 con cuerpo vacío.
            }
        },
        no exito { enviar 400 y un cuerpo vacío.}
    }
*/

app.get('/todos/:id', (req, res) => {   
    let id = req.params.id;  //params -> parametro con la key -> :id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo){return res.status(404).send();}
       
        res.send({todo}); // {todo} --> objeto que tiene la propiedad todo, por lo tanto es un array. 
    }).catch((e) => {
        res.status(400).send();
    });
});

/*
Challenge
    - obtener id
    - validarlo -> si no lo es retorna 404
    - remover doc(todo) por id
        - exito {
            - si no hay doc -> enviar 404
            - si lo hay -> enviarlo con 200
        }, 
        - error{
            - enviar 400 con cuerpo vacío.
        }
*/

app.delete('/todos/:id', (req, res) => {    //al método le quise llamar delete, se puede llamar como se quiera.
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){ return res.status(404).send();}
        
        res.send({todo});
    }).catch((e) => {
        res.status(400).send()
    });

});    

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']); //pick --> coge un objeto, y un array de las propiedades que quieres actualizar 
                        // y lo hace sin tener que hacerlo nosotros a mano, el pick actualiza automáticamente.

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){  //si es un la propiedad completed de body es un boolean y completede === true.
        body.completedAt = new Date().getTime();    //getTime --> devuelve un timestamp de js.
    }else{ //sino es un boolean o no está completo.
        body.completed = false;
        body.completedAt = null;
    }
    /*
    el findByIdAndUpdate del mongoose es muy parecido al update de mongo, tienes que pasarle 4 campos(filtro,
    el campo a actualizar con el operador, las opciones y una callback o promise).
    En este caso se le pasan como parámetros a este método:
        - filtro(id).
        - campo a actualizar -> operador $set: y campo body.
        - opcion -> new: que es como el returnOriginal del mongodb.
        - promise.
    */
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

// ------------- POST /users --------------------
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);  //se puede decir al Constructor que use el pick

    user.save().then((doc) => { 
       return user.generateAuthToken();
        // res.send(doc);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);    
    });
});

// private route
// la ruta '/users/me' llama a authenticate y devuelve el usuario si es correcto.

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);    
});

// -------------- POST /users/login {email, password} -----------------------
app.post('/users/login', (req, res) => {
    
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {  //se llama al mét findByCredentials y se le pasa el email y el pass.
       
        return user.generateAuthToken().then((token) => {   //si éxito se genera un nuevo token para ese user(que no tenía).
        
            res.header('x-auth', token).send(user); //se envia como respuesta el header x-auth con el token y el user.
       });
    }).catch((e) => {
        res.status(400).send();
    });

});

// ----------------- DELETE /users/me/token --------------------
app.delete('/users/me/token', authenticate, (req, res) => { //una vez que el user está logueado, para desloguearse hay que borra el token.
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () =>{
    console.log(`Started up at port ${port}`);
});
module.exports = {app};