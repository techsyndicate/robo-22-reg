const ejs = require("ejs");
const { SendError } = require("./error");

const renderFile = (file, data) => {
  return new Promise((resolve) => {
    ejs.renderFile(file, data, (err, result) => {
      if (err) {
        console.log(err);
        SendError(err);
      }
      resolve(result);
    });
  });
};

module.exports = { renderFile };
