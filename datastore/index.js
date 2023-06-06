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


exports.readOne = (id, callback, err = null) => {
  if (err) {
    throw (err);
  } else {
    console.log(id);
    fs.readFile(exports.dataDir + `/${counter.zeroPaddedNumber(Number(id))}.txt`, (err, data) => {
      if (err) {
        //throw (err);
        callback(err, null);
      } else {
        callback(err, { id: counter.zeroPaddedNumber(id), text: data.toString() });
      }
    });
  }
};

// todos.readOne('notAnId', (err, todo) => {
//   expect(err).to.exist;
//   done();
// });


exports.update = (id, text, callback, err = null) => {
  if (err) {
    throw ('error updating');
  }
  fs.exists(exports.dataDir + `/${counter.zeroPaddedNumber(id)}.txt`, (e) => {
    if (!e || err) {
      err = true;
      callback(err, null);
    } else {
      fs.writeFile(exports.dataDir + `/${counter.zeroPaddedNumber(id)}.txt`, text, (err) => {
        if (err) {
          callback(err, null);
        }
        callback(err, {id: id, text: text});
      });
    }

  });
};

/*
if (err) {
      throw ('error in create');
    }
    fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
      if (err) {
        throw ('err creating file');
      }
      callback(err, { id, text });
    });
*/

exports.delete = (id, callback, err = null) => {
  if (err) {
    throw ('error deleting');
  }
  fs.unlink(exports.dataDir + `/${counter.zeroPaddedNumber(id)}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(err, id);
    }
  });
};

// if err
  // throw err
// if exists
  // fs.unlink(path, (err) => throw err})

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); // dataDirectory/data/09322.txt

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
