'use strict';

var fs = require('fs');

// namespace object for module
var FileServer = function () {};

var generateLinks = (path, dirArray, cb) => {
  var links = dirArray.map((file) => {
    var filePath = path + '/' + file;
    return '<p><a href=' + filePath + '>' + file + '</a></p>'
  });
  cb(undefined, links);
}

// debugger;
FileServer.prototype.listDirectory = (path, cb) => {
  fs.readdir(path, (err, files) => {
    if (err) { cb(err); }
    generateLinks(path, files, cb);
  });
};

module.exports = FileServer;
