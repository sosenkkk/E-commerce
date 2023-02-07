const http = require('http');

const express= require('express');

// const routes = require('./routes');

const app= express();

const server = http.createServer(app);

server.listen(3000);
