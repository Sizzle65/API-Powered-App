const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const background = fs.readFileSync(`${__dirname}/../client/dnd.jpg`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getBackground = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/jpg' });
  response.write(background);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBackground,
};
