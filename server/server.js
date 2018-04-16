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

app.listen(3000, () =>{
    console.log('Started on port 3000');
});