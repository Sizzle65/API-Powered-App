const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.addItem(request, response, params);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/dnd.jpg') {
    htmlHandler.getBackground(request, response);
  } else if (parsedUrl.pathname === '/getCharacter') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.getCharacter(request, response, params);
  } else if (parsedUrl.pathname === '/addItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.addItem(request, response, params);
  } else if (parsedUrl.pathname === '/activateItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.activateItem(request, response, params);
  } else if (parsedUrl.pathname === '/deleteItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.deleteItem(request, response, params);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
};

// const handleHead = (request, response, parsedUrl) => {

// };

const handlePut = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/activateItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.activateItem(request, response, params);
  }
};

const handleDelete = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/deleteItem') {
    const params = query.parse(parsedUrl.query);
    jsonHandler.deleteItem(request, response, params);
  }
};

const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);

  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
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
