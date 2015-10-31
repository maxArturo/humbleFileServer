'use strict';
var http       = require('http');
var path       = require('path');
var url        = require('url');
var FileServer = require('./file_server');

var fileList = new FileServer();

var server = http.createServer((request, response) => {
  var requestedPath = url.parse(request.url).pathname;

  // ignore favicon requests
  if (requestedPath === '/favicon.ico') {
    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
    response.end();
    return;
  }

  fileList.listDirectory(requestedPath, (err, links) => {
    if (err) {
      console.log(err);
      response.end('Oops! An error occurred');
    }
    response.write("<!DOCTYPE html><html>");
    response.write("<h2>Hello! Here are the files served: </h2>");
    response.end(links.join(''));
  });
});

server.listen(8080, function() {
  console.log('listening on port 8080...');
});
