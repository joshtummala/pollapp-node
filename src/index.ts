import SETTINGS from "./settings";

import express = require("express");
const app = express();

import bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import cors = require("cors");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

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
    cookie: {
      sameSite: "none",
      secure: false,
      httpOnly: true,
    },
    resave: true,
    saveUninitialized: true,
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

app.listen(SETTINGS.PORT, () => {
  console.log(`Server is running on port ${SETTINGS.PORT}`);
});

export default app;
