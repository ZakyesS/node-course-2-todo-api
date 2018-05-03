const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'ysuarez@20h.es',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }],
}, {
    _id: userTwoId,
    email: 'test@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }],
}];


const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
}];

const populateTodos = (done) => {  
    
    //borra toda la collection Todo 
    Todo.remove({}).then(() => {; //expression syntax --> lo mismo es esto:
    // Todo.remove({}).then(() => {
    //     done();
    // })
    return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
        //borra toda la collection User 
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]); //retorna una promise con un array de arrays.
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};