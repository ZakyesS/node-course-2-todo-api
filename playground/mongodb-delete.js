const {MongoClient, ObjectID} = require('mongodb'); //ES6 , ObjectID(Constructor)--> para le dices que tenga esa propiedad.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    //Insertar datos.
    const db = client.db('TodoApp'); //TodoApp es la base de datos.
    
    
    //delete many
    // db.collection('Todos').deleteMany({text: 'Prueba'}).then((result) => {
    //   console.log(result);  
    // });

    //delete one
    // db.collection('Todos').deleteOne({text: 'Prueba'}).then((result) => {
    //     console.log(result);
    // });


    //findOneAndDelete

    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=> {
    //     console.log(result);
    // });

    // challenge
    // eliminar con el metodo delete many
    //eliminar con el método findOneAndDelete uno de los documentos pasándole el id.

   // db.collection('Users').deleteMany({name: 'Yune'}); tambien se puede hacer asi.

    db.collection('Users').deleteMany({name: 'Yune'}).then((results) => {
    console.log('He encontrado mas de un doc con el mismo nombre.');
    console.log('Eliminado');
    console.log(results.result.n);
    }, (err) => {
    console.log('Anybody with that name.');
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5ad39c375fb08a150514f9fc')}).then((result) => {
        console.log('Deleted');
    }, (err) => {
        console.log('User not deleted');
    });


client.close();
});