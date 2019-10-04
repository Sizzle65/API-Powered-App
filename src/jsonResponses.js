const characters = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });

  response.write(JSON.stringify(object));

  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getCharacter = (request, response, params) => {
  const { name } = params;
  let responseJSON = {};

  let responseCode = 201;
  if (characters[name]) {
    responseCode = 200;
  } else {
    characters[name] = {
      name,
      inventory: [],
    };
  }

  responseJSON = characters[name];
  return respondJSON(request, response, responseCode, responseJSON);
};

const addItem = (request, response, params) => {
  let responseJSON = {
    message: 'Name, item, quantity, weight and price are required.',
  };
  let statusCode = 400;

  if (!params.name || !params.item || !params.quantity || !params.weight || !params.price) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    const count = characters[params.name].inventory.length;

    const randomId = Math.floor(Math.random() * 100000 + 1);

    characters[params.name].inventory[count] = {
      item: params.item,
      quantity: params.quantity,
      weight: params.weight,
      price: params.price,
      active: false,
      id: randomId,
    };
    responseJSON = characters[params.name];
    statusCode = 201;
  } else {
    responseJSON.message = 'Character not found.';
    responseJSON.id = 'notFound';
    statusCode = 404;
  }

  return respondJSON(request, response, statusCode, responseJSON);
};

const activateItem = (request, response, params) => {
  const responseJSON = {
    message: 'Name and item are required.',
  };
  let statusCode = 400;

  if (!params.name || !params.item) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    const { inventory } = characters[params.name];

    for (let x = 0; x < inventory.length; x++) {
      if (inventory[x].item === params.item) {
        inventory[x].active = true;
      }
    }
    return respondJSONMeta(request, response, 201);
  } else {
    responseJSON.message = 'Character not found.';
    responseJSON.id = 'notFound';
    statusCode = 404;
  }

  return respondJSON(request, response, statusCode, responseJSON);
};

const deleteItem = (request, response, params) => {
  const responseJSON = {
    message: 'Name and id are required.',
  };
  let statusCode = 400;

  if (!params.name || !params.id) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    const { inventory } = characters[params.name];

    for (let x = 0; x < inventory.length; x++) {
      if (inventory[x].id === params.id) {
        inventory.splice(x);
      }
    }
    return respondJSONMeta(request, response, 201);
  } else {
    responseJSON.message = 'Character not found.';
    responseJSON.id = 'notFound';
    statusCode = 404;
  }

  return respondJSON(request, response, statusCode, responseJSON);
};

module.exports = {
  getCharacter,
  addItem,
  activateItem,
  deleteItem,
};
