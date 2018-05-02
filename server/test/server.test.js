const expect = require('expect');   //libería para usarlo en test para esperar algo(comparar, mayor que, ....).
const request = require('supertest');   //libería para tests, para hacer request cuando se va a esperar algo de una direccion.
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//comprueba antes de hacer los tests:
beforeEach(populateUsers); 
beforeEach(populateTodos);

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

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => {done(e)});                
            });
    });

    it('Should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123abc`)
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    //Challenge
    it('Should update the todo', (done)=> {
        let hexId = todos[0]._id.toHexString();
        let text = "Update completed & completedAt";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text,
            })
            .expect(200)
            .expect((res) => {

                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');

            })
        .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done)=> {

        let hexId = todos[1]._id.toHexString();
        let text = "Update completed & completedAt!!";

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: false,
            text,
        })
        .expect(200)
        .expect((res) => {

            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();

        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    
    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});   //espera que el cuerpo de la solicitud sea igual a un obj vacío.
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);    //espera que el password no sea el mismo porque tiene que estar hasheado.
                    done();
                });
            });
    });

    it('Should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done);
    });

    it('Should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Password123!'
            })
            .expect(400)
            .end(done);
    });
});