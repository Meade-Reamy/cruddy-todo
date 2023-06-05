const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// reads the file 'counterFile' and calls a function on the file data if successful
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0); // counter is initialized as 0
    } else {
      callback(null, Number(fileData)); // counter is present and we need to present it as a number
    }
  });
};

// adds a new number to the counterfile calls a callback if successful
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count); // looks at current count and makes it a padded number
  fs.writeFile(exports.counterFile, counterString, (err) => { // adds current count to file
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString); //update the counter with
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//  argument - (err, id) => {
//       expect(err).to.be.null;
//       expect(id).to.exist;
//       done();
//     })

exports.getNextUniqueId = function(callback) {
  readCounter((err, count) => {
    if (err) {
      throw ('error reading counter');
    }
    let newCounter = count + 1;
    counter = newCounter;

    writeCounter(newCounter, (err, counterString) => {
      if (err) {
        throw ('error setting id');
      }
      let id = counterString;
      callback(err, id);
    });
  });
};


// readcounter
  // takes the second passed in param
  // call write with the second param + 1
  // set counter = seond param + 1


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
