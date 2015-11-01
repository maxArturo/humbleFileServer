'use strict';
require('babel-core/register');

const http       = require('http');
const FileServer = require('./file_server');

const rootDir = process.argv[2] || './hosted_files';
const port = process.argv[3] || 8080;

const fileServer = new FileServer(rootDir);

const server = http.createServer((request, response) => {
  fileServer.serve(request, response);
});

server.listen(port, function() {
  console.log(`listening on port ${port}...`);
});
