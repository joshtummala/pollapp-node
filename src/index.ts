import SETTINGS from "./settings";

import express = require("express");
const app = express();

import bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import cors = require("cors");
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

import session = require("express-session");
import mongodb_session = require("connect-mongodb-session");
const MongoDBStore = mongodb_session(session);
const store = new MongoDBStore({
  uri: SETTINGS.MONGO_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: SETTINGS.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    saveUninitialized: true,
    resave: true,
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
