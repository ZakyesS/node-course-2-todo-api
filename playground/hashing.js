const {SHA256} = require('crypto-js');  //librería para encriptar en js
const jwt = require('jsonwebtoken');    //libería para encriptar en js pero con los métodos sign y verify.


// -------- ENCRIPTAR USANDO JSONWEBTOKEN -------------

let data = {
    id: 10,
};

let token = jwt.sign(data, 'somesecret');    //coge el dato y encripta y devuelve el valor.
console.log(token);
let decoded = jwt.verify(token, 'somesecret');      //coge el dato encriptado y se segura de que no está manipulado.
console.log('decoded:', decoded);



// -------- ENCRIPTAR USANDO CRYPTO -------------

// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4,
// };
// let token = {
//     data, //es lo mismo -> data: data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
// };

// // //para probar que se ha modificado los datos:
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash){
//     console.log('Data was not changed');
// }
// else{
//     console.log('Data was changed. Do not trust!!');
// }

