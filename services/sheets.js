const { google } = require("googleapis");
const addSchool = async (school) => {
  const sheets = google.sheets("v4");
  // service account auth
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace("\\n", "\n"),
    [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
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
};
module.exports = {
  addSchool,
};
