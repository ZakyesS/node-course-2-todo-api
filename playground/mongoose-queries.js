const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = '5ad4a77fe956256f2f51e0cb';

//ObjectID.isValid(id) --> para validar si un numero es un id. Devuelve true o false.
if(!ObjectID.isValid(id)){
    console.log('ID not valid'); 
}

// con este método lo que se obtiene es un array de todos
Todo.find({
    _id: id,    //con mongoose no hace falta crear un objeto, si se le dice que es un id, el coge la string y la pasa a id.
}).then((todos) => {
    console.log('Todos', todos);
});
// con este un solo todo.
Todo.findOne({
    _id: id,
}).then((todo) => {
    console.log('Todo', todo);
});

//buscar por id
Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log("Id not found");
    }
    console.log('Todo By Id', todo);
}).catch((e) => console.log(e));


// Challenge 
const {User} = require('./../server/models/user');

User.findById('5ad3c5394590db5a639322e5').then((user) => {
    if(!user){
        return console.log('Unable to find user');
    }
    console.log('User: ', user);
}).catch((e) => {console.log(e)});