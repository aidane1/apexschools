const middlewareDev = require (__dirname + '/middleware_dev');

const middlewareProd = require (__dirname + '/middleware_prod');

const middlewareAPI = require (__dirname + '/api_request_auth');

const fileUpload = require ('express-fileupload');

const cookieParser = require ('cookie-parser');

const helmet = require ('helmet');

const bodyParser = require ('body-parser');

const addRequestId = require ('express-request-id');

const express = require ('express');

const fs = require ('fs');

const getRawBody = require ('raw-body');

const contentType = require ('content-type');

let morganLogStream = fs.createWriteStream (abs_path ('/morgan.log'), {
  flags: 'a',
});

const morgan = require ('morgan');

morgan.token ('id', req => {
  return req.id;
});

let loggerFormat = ':id [:date[web]] ":method :url" :status :response-time ms';

let middleware = {
  helmet: helmet (),
  fileUpload: fileUpload (),
  bodyParserForm: bodyParser.urlencoded ({extended: false, limit: '50mb'}),
  staticServing: express.static (base_dir + '/public/'),
  bodyParserJSON: bodyParser.json ({limit: '50mb'}),
  rawBody: (req, res, next) => {
    if (req.query.blob) {
      getRawBody (
        req,
        {
          length: req.headers['content-length'],
          limit: '50mb',
          encoding: contentType.parse (req).parameters.charset,
        },
        function (err, string) {
          if (err) return next (err);
          req.files = {resource: string};
          next ();
        }
      );
    } else {
      next ();
    }
  },
  cookieParser: cookieParser (),
  responseError: (req, res, next) => {
    res.error = error => {
      res.send ({
        status: 'error',
        body: {
          error,
        },
      });
    };
    next ();
  },
  responseOkay: (req, res, next) => {
    res.okay = body => {
      res.send ({
        status: 'ok',
        body,
      });
    };
    next ();
  },
  morganOne: morgan (loggerFormat, {
    skip: (req, res) => {
      return res.statusCode > 400;
    },
    stream: morganLogStream,
  }),
  addRequestId: addRequestId (),
};
module.exports = function () {
  if (server_info.config.config_id == 'development') {
    middleware = {...middleware, ...middlewareDev};
  } else {
    middleware = {...middleware, ...middlewareProd};
  }
  middleware = {...middleware, ...middlewareAPI};
  return middleware;
};
