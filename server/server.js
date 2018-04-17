const {ObjectID} = require('mongodb');

let express = require('express');
let bodyParser = require('body-parser');


let {mongoose} = require('./db/mongoose');  //se le require la conexión que es un js que está exportado en db/
//es lo mismo ./db/mongoose.js que ./db/mongoose, se puede obviar la extensión.

let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

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

app.listen(3000, () =>{
    console.log('Started on port 3000');
});
