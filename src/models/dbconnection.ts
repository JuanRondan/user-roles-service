import { connect, connection } from 'mongoose';
//const mongoose = require( 'mongoose' );

var dbURI = "mongodb://localhost/trainingApp";
//var dbURI = "mongodb://35.185.27.211:27017/uma";

connect(dbURI)
    .then( db => {
        console.log("Connected to mongoose");
    })
    .catch( err => {
        console.log("Error: ", err);
    });

/* connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
}); */
