const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// borrar toda la collection.
Todo.remove({}).then((result) => {  //se le tiene que pasar al remove algo no puede estar 
                                    // vacío, por tanto se le pasa el array {}, que quiere decir que es toda la collection. 
    console.log(result);
});

// borrar el primero que encuentre.
Todo.findOneAndRemove({_id: '5ad4ede80dfb6c7e000767db'}).then((todo) => {   //en la promise puede ser todo o doc.
    console.log(todo);
});


// borrar pasándole el id(que busque y luego borre).

Todo.findByIdAndRemove('5ad4ede80dfb6c7e000767db').then((todo) => {
    console.log(todo);
});