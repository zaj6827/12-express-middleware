'use strict';

// this file is setting up our persistance in the data folder..
// This also uses Promises, which I'm still shaky on.

//our debugger for the page
const debug = require('debug')('http:storage');

//our error object creator
const createError = require('http-error');

//our Toy constructor
const Toy = require('../model/toy');

//our Promisifying package, for use with fs.
const Promise = require('bluebird');

//the fs module, used to create new toys and store them in data directory, with bluebird mounted to be able to use resolve and reject. We're using the Prom suffix so we don't overwrite the original fs.writeFile functionality.
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});

//Finally, we're creating our storage module for use.

const storage = module.exports = {};

//Create method to make a new Toy instance in data directory.

storage.create = function(item) {
  debug('#create');

  return new Promise((resolve, reject) =>{
    //validation to make sure the new toy is legit.
    if(!item.name) return reject(createError(400, 'cannot create: name required.'));
    if(!item.desc) return reject(createError(400, 'cannot create: description required.'));

    //if it has all the requirements, make it!
    let toy = new Toy(item.name, item.desc);

    //After created, we write it to data, using bluebird to make sure everything is correct. (try catch!)
    return fs.writeFileProm(`${__dirname}/../data/toy/${toy._id}.json`, JSON.stringify(toy))
      .then( () =>{ resolve(toy);})
      .catch(reject);
    //The above is a bit confusing, but basically, if it fails in stringifying and writing the file, it'll catch and reject, so we don't goof up our code.
  });
};


//this is to fetch (get) an entry by it's _id
storage.fetchOne = function(itemId) {
  debug('#fetchOne');

  //using bluebird, we use promises for validation
  return new Promise((resolve, reject) => {
    if (!itemId) return reject(createError(400, 'cannot get item : id required.'));

    //If it passes validation, try to get, with additional bluebird validation..

    return fs.readFileProm(`${__dirname}/../data/toy/${itemId}.json`)
    //grab the item by id, it comes back as a buffer
      .then(buff => {
        try {
          //if the buffer is good, use it
          let toy = JSON.parse(buff.toString());
          return resolve(toy);
        }
        //if the buffer is bad, catch and return error
        catch(e) {
          return reject(e);
        }
      })
      //if the ID is bad, instantly reject?
      .catch(reject);
  });
};


storage.fetchAll = function (schema) {
  debug('#fetchAll');
  //TODO return everything by schema, in this case toy.

  return new Promise((resolve, reject) => {
    if(!schema) {return reject(createError(400, 'error : schema is required.'));}

    fs.readdirProm(`${__dirname}/../data/${schema}.json`)
      .then((files) => {
        try{
          return resolve(files);
        }
        catch(e) { return reject(e);}
      })
      .catch(reject);
  });
};


storage.update = function(item) {
  debug('#update');
  // TODO Use put to update an existing item. Use id?

  return new Promise((resolve, reject) => {
    if(!item._id) {return reject(createError(400, 'error : itemId required.'));}
    if(!item.name) {return reject(createError(400, 'error : item name is required.'));}
    if(!item.desc) {return reject(createError(400, 'error : item description required.'));}

    let toy = new Toy(item._id, item.name, item.desc);

    fs.writeFileProm(`${__dirname}/../data/toy/${item._id}.json`)
      .then(resolve(toy))
      .catch((e) => {return reject(e);});
  });
};

storage.destroy = function(itemId) {
  debug('#destroy');
  //TODO use delete to get rid of item by id? Also, after deleting, use fetchAll to return an array of items that still exist.
  
};
