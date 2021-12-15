import SETTINGS from "./settings";

import express = require("express");
const app = express();

import bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import cors = require("cors");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

import session = require("express-session");
import mongodb_session = require("connect-mongodb-session");
const MongoDBStore = mongodb_session(session);
const store = new MongoDBStore({
  uri: SETTINGS.MONGO_URL,
  collection: "sessions",
});
app.set("trust proxy", 1);
app.use(
  session({
    secret: SETTINGS.SESSION_SECRET,
    cookie: {},
    store,
  })
);

import mongoose = require("mongoose");
mongoose
  .connect(SETTINGS.MONGO_URL)
  .then(() => console.log(`Connected to mongodb at ${SETTINGS.MONGO_URL}`));

import userService from "./services/user-service";
userService(app);
import groupService from "./services/group-service";
groupService(app);
import questionService from "./services/question-service";
questionService(app);

app.use(
  (
    err: { status: any; message: any },
    req: any,
    res: {
      status: (arg0: any) => void;
      render: (arg0: string, arg1: { message: any; error: {} }) => void;
    },
    next: any
  ) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {},
    });
  }
);

app.listen(SETTINGS.PORT, () => {
  console.log(`Server is running on port ${SETTINGS.PORT}`);
});

export default app;
