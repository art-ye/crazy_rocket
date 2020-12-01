const { readdirSync } = require('fs');
const { join } = require('path');
const { messages } = require('../../config');


const readDirectory = (dir) => {
  const directory = join(__dirname, dir);
    return  readdirSync(directory)
    .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js' && file.slice(0, -3) in messages)
    .map(file => [ directory, file ]);
    
};


const handlers = readDirectory('./game').concat(readDirectory('./chat'))
.reduce((obj, item) => {
    const name = item[1].slice(0, -3);
    obj[name] = require(join(item[0], item[1]));
    return obj;
  }, {});

module.exports = handlers;
