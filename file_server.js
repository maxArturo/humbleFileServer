'use strict';
const fs   = require('fs');
const url  = require('url');
const path = require('path');

const FileServer = function (root) {
  this.root = root;
};

FileServer.prototype.serve = function (req, res) {
  const requestedPath = this.root + url.parse(req.url).pathname;
  debugger;

  // ignore favicon requests
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return;
  }

  // serve directly if what's requested is a file
  if (fs.statSync(requestedPath).isFile()) {
    // serve file
    let stream = fs.createReadStream(requestedPath);
    stream.pipe(res);
  } else {
    listDirectory(requestedPath, (err, links) => {
      if (err) {
        console.log(err);
        res.end('Oops! An error occurred - check your path and try again.');
        return;
      }

      res.write('<!DOCTYPE html><html>');
      res.write('<h2>Hello! Here are the files served: </h2>');
      res.end(links.join(''));
    });
  }
}

const generateLink = (filePath) => {
  return '<p><a href="' + filePath + '">' + path.basename(filePath) +
    '</a></p>';
};

const pathGenerator = (dirPath) => {
  return (file) => {
    let fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory())
      fullPath = path.basename(fullPath) + '/';
    return fullPath;
  }
};

const listDirectory = (dirPath, cb) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) { return cb(err); }
    const generatePath = pathGenerator(dirPath);
    const directoryList = files.map(generatePath).map(generateLink);
    directoryList.unshift('<p><a href="' + './..' + '">..</a></p>');
    cb(null, directoryList);
  });
};

module.exports = FileServer;
