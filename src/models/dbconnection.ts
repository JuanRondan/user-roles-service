import { connect, connection } from 'mongoose';
//const mongoose = require( 'mongoose' );

//var dbURI = "mongodb://localhost/trainingApp";
var dbURI = "mongodb://server/uma";
if (process.env.NODE_ENV === 'production') {
    console.log("production environment detected");
    dbURI = "mongodb://server/uma";
}

connect(dbURI);

connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
