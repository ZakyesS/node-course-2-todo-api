const {MongoClient, ObjectID} = require('mongodb'); //ES6 , ObjectID(Constructor)--> para le dices que tenga esa propiedad.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    //Insertar datos.
    const db = client.db('TodoApp'); //TodoApp es la base de datos.

    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5ace0937f436aa618d6cb17e') //filter(filtro que se usa para buscar)
    // }, {
    //     $set: {      //update(el campo que se quiere actualizar y con que operador)
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false  //options
    // }). then((result) => {     // callback(o puede ser una promise).
    //     console.log(result);
    // });

    // Challenge
    // cambiar el nombre del modelo 'Users' e incrementar la edad del mismo.

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5ace0937f436aa618d6cb17f')
    }, {
        $set : {
            name: 'Yuneysa'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log('Result:');
        console.log(result);

    });

    client.close();
});