'use strict';
//debugger
const debug = require('debug')('http:server');

//express port to listen on, app object, and router object
const PORT = process.env.PORT || 3010;
const express = require('express');
const app = express();
const router = express.Router();

//middleware for parsing, cors headers, and error handling

//the .json at the end means I don't have to call it when I mount it?
const bodyParser = require('body-parser').json();

// this sets the cors headers to express when mounted?
const cors = require('../cors');

//makes error objects by status code?
const errorMiddleware = require('../error-middleware');

//routes (endpoints)
// router is called at the end to mount the endpoint?
require('../route/route-toy')(router);

//mounting to express
app.use(bodyParser);
app.use(cors);
app.use(router);
//always put testing last, so it catched all the modules before it
app.use(errorMiddleware);
