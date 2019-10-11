// Characters object to hold all the character information
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

const deactiveAllItems = (name) => {
  for (let index = 0; index < characters[name].inventory.length; index++) {
    characters[name].inventory[index].active = false;
  }
};

// Grabs the selected character or creates them if they don't exist
const getCharacter = (request, response, params) => {
  // Deactivate all items for all characters to handle page refreshes,
  // ensuring all items get added to UI properly
  const names = Object.keys(characters);
  for (let index = 0; index < names.length; index++) {
    deactiveAllItems(names[index]);
  }

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

const getCharacterMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

// Add item to the characters inventory array
const addItem = (request, response, params) => {
  let responseJSON = {
    message: 'Name, item, quantity, weight and price are required.',
  };
  let statusCode = 400;

  if (!params.name || !params.item || !params.quantity || !params.weight || !params.price) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    const count = characters[params.name].inventory.length;

    // Creates a random item id for each item
    const randomId = Math.floor(Math.random() * 100000 + 1);

    // Sets the passed in values for the item and adds it to the inventory
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

// Sets the specific items active property to true to ensure it is added to the inventory UI
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

// Sets the items active property to false to ensure they aren't added to the UI
const deactivateItem = (request, response, params) => {
  const responseJSON = {
    message: 'Character does not exist.',
  };
  let statusCode = 400;

  if (characters[params.name]) {
    deactiveAllItems(params.name);

    responseJSON.message = 'Character item deactivation successful.';
    statusCode = 200;
  }

  return respondJSON(request, response, statusCode, responseJSON);
};

// Deletes selected item from the characters inventory array
const deleteItem = (request, response, params) => {
  const responseJSON = {
    message: 'Name and id are required.',
  };
  let statusCode = 400;

  if (!params.name || !params.id) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    for (let x = 0; x < characters[params.name].inventory.length; x++) {
      // Finds the specific item per the item id and splices it from the array
      if (characters[params.name].inventory[x].id.toString() === params.id) {
        characters[params.name].inventory.splice(x, 1);
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

// Clears current inventory for selected character
const clearInventory = (request, response, params) => {
  const responseJSON = {
    message: 'Name is required.',
  };
  let statusCode = 400;

  if (!params.name) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    // Empties the characters inventory array
    characters[params.name].inventory = [];
    return respondJSONMeta(request, response, 201);
  } else {
    responseJSON.message = 'Character not found.';
    responseJSON.id = 'notFound';
    statusCode = 404;
  }

  return respondJSON(request, response, statusCode, responseJSON);
};

// Deletes selected character from the characters object
const deleteCharacter = (request, response, params) => {
  const responseJSON = {
    message: 'Name is required.',
  };
  let statusCode = 400;

  if (!params.name) {
    responseJSON.id = 'missingParams';
  } else if (characters[params.name]) {
    // Deletes the character from the characters object
    delete characters[params.name];
    return respondJSONMeta(request, response, 201);
  } else {
    responseJSON.message = 'Character not found.';
    responseJSON.id = 'notFound';
    statusCode = 404;
  }

  return respondJSON(request, response, statusCode, responseJSON);
};

const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getCharacter,
  addItem,
  activateItem,
  deactivateItem,
  deleteItem,
  clearInventory,
  deleteCharacter,
  getCharacterMeta,
  notRealMeta,
};
