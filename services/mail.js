const ejs = require("ejs");

const renderFile = (file) => {
  return new Promise((resolve) => {
    ejs.renderFile(file, (err, result) => {
      if (err) {
        logger.error(err);
      }
      resolve(result);
    });
  });
};

module.exports = { renderFile };
