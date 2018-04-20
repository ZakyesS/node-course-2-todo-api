const expect = require('expect');   //libería para usarlo en test para esperar algo(comparar, mayor que, ....).
const request = require('supertest');   //libería para tests, para hacer request cuando se va a esperar algo de una direccion.
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
}];


beforeEach((done) => {      //comprueba antes de hacer.
    
    //borra toda la collecion Todo y acaba el test
    Todo.remove({}).then(() => {; //expression syntax --> lo mismo es esto:
    // Todo.remove({}).then(() => {
    //     done();
    // })
    return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () =>{  //describimos el grupo 'POST /todos' para los test de esa rura para el met POST.

    it('Should create a new todo', (done) => {  //se le pasa el done(para saber mocha cuando el test finaliza) al test 'deberia crear un nuevo todo'.
        let text = 'Test todo text';

        request(app)    // haces un request del app(que son métd del server.js)
            .post('/todos') //le dices que ponga la ruta '/todos'.
            .send({text})   //envíe la string text.
            .expect(200)    //espera un 200
            .expect((res) => {  //funcion con expect al que le pasas res(solicitud que habrá hecho el usuario).
                expect(res.body.text).toBe(text);   //espera(solicitud.cuerpo.texto).sea(texto).
            })
            .end((err, res) => {    //finaliza con una arrow que se le pasa err y res.
                if(err){ return done(err);};    //si hay error, devuelve done(finaliza el test) con el err.
                
                Todo.find({text}).then((todos) => {   //Sino, busca en la collection Todo(todos los todos) y haces unan promise, pasándole los todos.
                    //si hay exito
                    expect(todos.length).toBe(1);   
                    expect(todos[0].text).toBe(text);
                    done(); //finaliza el test.
                }).catch((e) => done(e));   //si no hay exito prueba (e) -> finaliza con el error.
            });
    });

    it('Should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){ return done(err);};

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)   //toHexString --> convierte un objtect a id en string.
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    //challenge

    it('Should return 404 if todo not found', (done) =>{
        let hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);

    });
    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    });
}); 
