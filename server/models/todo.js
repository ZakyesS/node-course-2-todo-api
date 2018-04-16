let mongoose = require('mongoose');  //se llama a la libreria mongoose

//mongoose.model --> método para crear un modelo en mongoose.
// Tiene dos parámetros(1º la string que es el nombre del modelo, 2º un objeto que tiene las propiedades del modelol).
let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }, 
    completedAt: {  //completedAt --> timestamp en el que se completó la tarea(Todo).
        type: Number,
        default: null,
    }
});

module.exports = {Todo}; //se exporta el modelo que es igual al objeto Todo.
