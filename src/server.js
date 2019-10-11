const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.addItem(request, response, params);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
};

// Handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/dnd.jpg') {
    htmlHandler.getBackground(request, response);
  } else if (parsedUrl.pathname === '/getCharacter') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.getCharacter(request, response, params);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
};

// Handle HEAD requests
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getCharacter') {
    jsonHandler.getCharacterMeta(request, response);
  } else {
    jsonHandler.notRealMeta(request, response);
  }
};

// Handle PUT requests
const handlePut = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/activateItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.activateItem(request, response, params);
  } else if (parsedUrl.pathname === '/deactivateItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.deactivateItem(request, response, params);
  }
};

// Handle DELETE requests
const handleDelete = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/deleteItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.deleteItem(request, response, params);
  } else if (parsedUrl.pathname === '/clearInventory') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.clearInventory(request, response, params);
  } else if (parsedUrl.pathname === '/deleteCharacter') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.deleteCharacter(request, response, params);
  }
};

// Recieves the request and calls the appropriate method
const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);

  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'PUT') {
    handlePut(request, response, parsedUrl);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
