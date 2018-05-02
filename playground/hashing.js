const {SHA256} = require('crypto-js');  //librería para encriptar en js
const jwt = require('jsonwebtoken');    //libería para encriptar en js pero con los métodos sign y verify.
const bcrypt = require('bcryptjs');     // librería para hashear.

// -----------  ENCRIPTAR USANDO BCRYPT -------------

let password = '123abc!';
/*
    se le pasan 2 arg(1º una sync funct(10 = nº rondas para generar la Salt) y 2º una callback(err, salt)).
        *Cuanto mayor sea el nº más tiempo tomará el algoritmo.
*/

bcrypt.genSalt(10, (err, salt) => { 
    // password(se le pasa como primer parám al hash porque es lo que queremos hashear).
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);  
    });
});

//comparar el password hasheado con el del texto plano para ver si son el mismo:
let hashedPassword = '$2a$10$GJG0R2RFdPPxG016XKMEeuEUR4EZyVQtO5ow/DCi/lexMAH1RS0/m';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});



// // -------- ENCRIPTAR USANDO JSONWEBTOKEN -------------

// let data = {
//     id: 10,
// };

// let token = jwt.sign(data, 'somesecret');    //coge el dato y encripta y devuelve el valor.
// console.log(token);
// let decoded = jwt.verify(token, 'somesecret');      //coge el dato encriptado y se segura de que no está manipulado.
// console.log('decoded:', decoded);



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

