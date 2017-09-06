'use strict';

//the entry point, will be what is listening.

const debug = require('debug')('http:index');
const server = require('../lib/server');
const PORT = process.end.PORT || 3010;

debug('#index.js');

server.listen(PORT, () => {(`Listening on ${PORT}`);});
