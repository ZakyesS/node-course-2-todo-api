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


// ----------------- POST todos ---------------------

app.post('/todos', authenticate, async (req, res) => {
    const todo = new Todo({       //Se va a crear una nueva instancia del modelo todo, 
        text: req.body.text,    //en el que la propiedad text va a contener lo que viene del mét post, del cuerpo y del text.
        _creator: req.user._id,
    });

    try {
        const doc =  await todo.save();
        res.send(doc);

    } catch(e) {
        res.status(400).send(e);    //respuesta.estado(400).envia(error);
    }
});



// ----------------- GET todos ---------------------

app.get('/todos', authenticate,  async (req, res) => {
    try{
        const todos = await Todo.find({
            _creator: req.user._id,
        });
        res.send({todos});
    } catch(e) {
        res.status(400).send(e);
    }
});


// ----------------- GET todos by id ---------------------

app.get('/todos/:id', authenticate, async (req, res) => {
    try{
        const id = req.params.id;  //params -> parametro con la key -> :id
        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id,
        });
        if(!todo){
            return res.status(404).send();
        }       
        res.send({todo}); // {todo} --> objeto que tiene la propiedad todo, por lo tanto es un array. 
    } catch(e) {
        res.status(400).send();
    }
});


// ----------------- DELETE todos by id ---------------------

app.delete('/todos/:id', authenticate, async(req, res) => {    //al método le quise llamar delete, se puede llamar como se quiera.
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    try{
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id,
        });
        if(!todo){ 
            return res.status(404).send();
        }
        res.send({todo});
    } catch(e) {
        res.status(400).send()
    }
});    


// ----------------- PATCH todos by id ---------------------

app.patch('/todos/:id', authenticate, async (req, res) => {
    try{
        const id = req.params.id;
        const body = _.pick(req.body, ['text', 'completed']); //pick --> coge un objeto, y un array de las propiedades que quieres actualizar 
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

        const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});        
    } catch(e) {
        res.status(400).send();
    }
});


// ------------- POST /users --------------------

app.post('/users', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send(e);    
    }
});

// --------------  GET /users/me -------------------
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);    
});

// -------------- POST /users/login {email, password} -----------------------

app.post('/users/login', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password); //se llama al mét findByCredentials y se le pasa el email y el pass.
        const token = await user.generateAuthToken();

        res.header('x-auth', token).send(user); //se envia como respuesta el header x-auth con el token y el user.
    } catch(e) {
        res.status(400).send();
    }
}); 



// ----------------- DELETE /users/me/token --------------------

app.delete('/users/me/token', authenticate, async (req, res) => { //una vez que el user está logueado, para desloguearse hay que borra el token.
    try{
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
});


app.listen(port, () =>{
    console.log(`Started up at port ${port}`);
});
module.exports = {app};