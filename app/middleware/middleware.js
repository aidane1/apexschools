const middlewareDev = require(__dirname + "/middleware_dev");

const middlewareProd = require(__dirname + "/middleware_prod");

const middlewareAPI = require(__dirname + "/api_request_auth");

const fileUpload = require('express-fileupload');

const helmet = require("helmet");

const bodyParser = require("body-parser");

const addRequestId = require('express-request-id');

const express = require("express");

const fs = require("fs");

let morganLogStream = fs.createWriteStream(abs_path("/morgan.log"), {flags: "a"});

const morgan = require("morgan");

morgan.token("id", (req) => {
    return req.id;
});

let loggerFormat = ':id [:date[web]] ":method :url" :status :response-time ms';

let middleware = {
    helmet: helmet(),
    fileUpload: fileUpload(),
    bodyParserForm: bodyParser.urlencoded({extended: false}),
    staticServing: express.static(base_dir + "/public/"),
    bodyParserJSON: bodyParser.json(),
    responseError: (req, res, next) => {
        res.error = (error) => {
            res.send({
                status: "error",
                body: {
                    error
                }
            })
        }
        next();
    },
    responseOkay: (req, res, next) => {
        res.okay = (body) => {
            res.send({
                status: "ok",
                body,
            })
        }
        next();
    },
    morganOne: morgan(loggerFormat,{
        skip: (req, res) => {
            return res.statusCode > 400;
        },
        stream: morganLogStream,
    }),
    addRequestId: addRequestId(),
}
module.exports = function() { 
    if (server_info.config.config_id == "development") {
        middleware = {...middleware, ...middlewareDev};
    } else {
        middleware = {...middleware, ...middlewareProd};
    }
    middleware = {...middleware, ...middlewareAPI};
    return middleware;
};