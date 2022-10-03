const { google } = require("googleapis");
const sheets = google.sheets("v4");
require("dotenv").config();

const jwtClient = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace("\\n", "\n"),
  [
    "https://www.googleapis.com/auth/spreadsheets"
  ],
  null,
  process.env.GOOGLE_KEY_ID
);
jwtClient.authorize(function (err, tokens) {
  console.log(tokens);
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});
const addSchool = async (school) => {
  // service account auth

};
module.exports = {
  addSchool,
};
