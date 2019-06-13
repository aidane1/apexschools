
const mongoose = require("mongoose");

const chalk = require("chalk");

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

module.exports = function(config) {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.database, {useNewUrlParser: true});

        mongoose.connection.on('connected', function(){
            console.log(connected("Mongoose default connection is open to ", config.database));
            resolve();
        });

        mongoose.connection.on('error', function(err){
            console.log(error("Mongoose default connection has occured "+err+" error"));
            reject(err);
        });

        mongoose.connection.on('disconnected', function(){
            console.log(disconnected("Mongoose default connection is disconnected"));
        });

        process.on('SIGINT', function(){
            mongoose.connection.close(function(){
                console.log(termination("Mongoose default connection is disconnected due to application termination"));
                process.exit(0)
            });
        });
    });   
}