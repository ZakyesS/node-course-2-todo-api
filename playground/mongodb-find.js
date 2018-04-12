// const MongoClient = require('mongodb').MongoClient; //ES5
const {MongoClient, ObjectID} = require('mongodb'); //ES6 , ObjectID(Constructor)--> para le dices que tenga esa propiedad.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    //Insertar datos.
    const db = client.db('TodoApp'); //TodoApp es la base de datos.
    
    // find() --> retorna un cursor que es un puntero a los documentos que hayan
    // toArray() -->  es un array de los docs, por lo que se tiene un array de objetos, que tienen la propiedad id, text y completed.
    // toArray() returna una promise

    // db.collection('Todos').find({
    //     _id: new ObjectID('5ace0937f436aa618d6cb17e')
    // }).toArray().then((docs) => {
    //     //si tiene éxito y encuentra los docs
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 3));
    // }, (err) => { // si no hay éxito.
    //     console.log('Unable to fetch todos', err);
    // });

    // count() devuelve una callback funct pero se puede usar una promise.
    // db.collection('Todos').find().count().then((count) => {
    //     //si tiene éxito y encuentra los docs
    //     console.log(`Todos count: ${count} `);
    // }, (err) => { // si no hay éxito.
    //     console.log('Unable to fetch todos', err);
    // });


    db.collection('Users').find({name: 'Dan'}).toArray().then((docs) => {
        if(docs.length != 0){
          return  console.log('Docs with that name --> ', docs);
        }
        console.log('Anybody with that name. ERROR: [', err, ']');
    });

     client.close();
});
