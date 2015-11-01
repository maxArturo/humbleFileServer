'use strict';
var fs   = require('fs');
var path = require('path');

// namespace object for module
var FileServer = function () {};


var generateLink = (filePath) => {
  return '<p><a href="' + filePath + '">' + path.basename(filePath) +
    '</a></p>';
};

var pathGenerator = (dirPath) => {
  return (file) => {
    let fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory())
      fullPath = path.basename(fullPath) + '/';
    return fullPath;
  }
};

FileServer.prototype.listDirectory = (dirPath, cb) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) { cb(err); }
    var generatePath = pathGenerator(dirPath);
    var directoryList = files.map(generatePath).map(generateLink);
    directoryList.unshift('<p><a href="' + './..' + '">..</a></p>');
    cb(null, directoryList);
  });
};

module.exports = FileServer;
