import SETTINGS from "./settings";

import express = require("express");
const app = express();

import bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import cors = require("cors");
app.use(cors());

import session = require("express-session");
app.use(
  session({
    secret: SETTINGS.SESSION_SECRET,
    cookie: {},
    saveUninitialized: true,
    resave: false,
  })
);

import mongoose = require("mongoose");
mongoose.connect(SETTINGS.MONGO_URL);

import userService from "./services/user-service";
userService(app);
import groupService from "./services/group-service";
groupService(app);
import questionService from "./services/question-service";
questionService(app);

app.listen(SETTINGS.PORT, () => {
  console.log(`Server is running on port ${SETTINGS.PORT}`);
});
