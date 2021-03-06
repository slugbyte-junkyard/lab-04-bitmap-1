'use strict';

const fs = require('fs');
const transform = require('./transform.js');

module.exports = exports = {};

exports.read = function(invert, gray, scale, callback){
  fs.readFile(`${__dirname}/../../assets/finger-print.bmp`, function(err, data){
    if(err) throw err;
    let fingerData = data;
    exports.bmp = {};
    exports.bmp.header = fingerData.toString('utf-8', 0,2);
    exports.bmp.size = fingerData.readUInt32LE(2);
    exports.bmp.offset = fingerData.readUInt32LE(10);
    exports.bmp.width = fingerData.readUInt32LE(18);
    exports.bmp.height = fingerData.readUInt32LE(22);
    exports.bmp.colors = fingerData.slice(54, exports.bmp.offset);
    exports.bmp.pixels = transform.convert(exports.bmp.colors);
    // transformations
    if (invert) exports.bmp.pixels = transform.invert(exports.bmp.pixels);
    if (gray) exports.bmp.pixels = transform.gray(exports.bmp.pixels);
    if (scale) exports.bmp.pixels = transform.scaleGreen(exports.bmp.pixels);
    exports.bmp.pixels = transform.revert(exports.bmp.pixels).toString('hex');
    fingerData.write(exports.bmp.pixels, 54, exports.bmp.offset);
    fs.writeFile(`${__dirname}/../data/newbmp.bmp`, fingerData, err => {
      if (err) throw err;
      callback(fingerData);
    });
  });
};
