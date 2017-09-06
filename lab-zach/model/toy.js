'use strict';

//this will be our toy constructor logic?

const debug = require('debug')('http:model-toy');

// This is for randomly generated ID numbers.
const uuid = require('uuid/v4');

//this is so we can export it to another files usage.
module.exports = function (name, desc) {
  //this is using debug instead of console logging
  debug(`model-toy: ${name} created`);
  this.name = name;
  this.desc = desc;
  this._id = uuid();
};
