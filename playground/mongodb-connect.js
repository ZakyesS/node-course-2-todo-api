// const MongoClient = require('mongodb').MongoClient; //ES5
const {MongoClient, ObjectID} = require('mongodb'); //ES6 , ObjectID(Constructor)--> para le dices que tenga esa propiedad.

let person = {name: 'Ire', edad:23};
let {name} = person;
console.log('1er / Person name: ', name, '/ Obj Person', person);

let person2 = {name: 'Yuneysa', age: 22};
let {name2} = person2;
console.log('2do / Person name: ', name2, 'Obj Person2', person2);

/*El connect, lleva dos parametros , el primero es la url a la que conectar y la segunda
una arrow, para manejar el error de conexion o los datos si hay éxito. */
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    /* El return del if, es una forma de salir de una función, y no se ejecutará el else, 
    por lo tanto el console de debajo(que sería el else, y no hace falta ponerlo, se sobreentiende),
    no se ejecutaría.*/

    //Insertar datos.
   /* const db = client.db('TodoApp'); //TodoApp es la base de datos.

    db.collection('Todos').insertOne({ //Todos es el modelo a usar.
        text: 'Writing Something2',
        completed: false,
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 3));
    })

    //Challenge --> Insertar nuevo doc en Users(name, age, location)
    db.collection('Users').insertOne({
        name: 'Yune3',
        age: 27,
        location: 'Bañaderos',
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert User');
        }
        console.log('Date to insert user: ', result.ops[0]._id.getTimestamp());
    });
*/
    client.close(); //cerrar la conexión a la DB.
});
