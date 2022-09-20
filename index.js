const express = require("express");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();
const mongoose = require("mongoose");
const layouts = require("express-ejs-layouts");
const { SendError } = require("./services/error");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(layouts);

const indexRouter = require("./routes/indexRoute");
const inviteRouter = require("./routes/inviteRoute");

app.use(indexRouter);
app.use("/invite", inviteRouter);

const pass = process.env.MONGO_PASS;
const link = `mongodb+srv://techsyndicate:${pass}@cluster0.cjudlqb.mongodb.net/test`;

mongoose
  .connect(link, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to mongoDB");
    const port = 3000 || process.env.PORT;
    app.listen(port, () => {
      console.log(`App Listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log("Application has crashed");
    console.log(err);
    SendError(err);
  });
