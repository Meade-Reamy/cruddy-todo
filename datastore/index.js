const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error in create');
    }
    fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
      if (err) {
        throw ('err creating file');
      }
      callback(err, { id, text });
    });
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  counter.readCounter((err, count) => {
    if (err) {
      throw ('error reading files');
    }
    let data = [];
    if (count === 0) { // if there are no todos to read
      callback(err, data);
    }
    for (let idx = 1; idx <= count; idx++) { // if there is data to read
      fs.exists(exports.dataDir + `/${counter.zeroPaddedNumber(idx)}.txt`, (e) => {
        if (e) {
          let id = counter.zeroPaddedNumber(idx);
          data.push({ id: id, text: id });
        }
        if (data.length === count) {
          callback(err, data);
        }
      });
    }
    // console.log('data outside', data);
    // callback(err, data);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

/*
call readCounter
  callback to check if each file up to count exists
  if it does push to arr
  callback which takes an arr
*/


exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); // dataDirectory/data/09322.txt

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
