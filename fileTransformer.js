/**
 * To fix the error with JEST when it encounter an image (See package.json specification).
 */
const path = require("path");

module.exports = {
  process(filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  },
};
