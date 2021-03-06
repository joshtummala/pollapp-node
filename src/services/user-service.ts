import userDao from "../db/users/dao";
import bcrypt = require("bcrypt");
import SETTINGS from "../settings";

const verifyAdmin = (req: any) =>
  req.session.profile && req.session.profile.role === "ADMIN";
const verifyAdminOrOwner = (req: any) =>
  verifyAdmin(req) ||
  (req.session.profile && req.params.userId === req.session.profile._id.toString());
const findAllUsers = (req: any, res: any) => {
  if (verifyAdmin(req)) {
    userDao.findAllUsers().then((users) => res.json(users));
  } else {
    res.sendStatus(401)
  };
};
const findUserById = (req: any, res: any) => {
  userDao
    .findUserById(req.params.userId)
    .then((user) => {
      if (user) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
        });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((reason) => {
      console.log(reason);
      res.sendStatus(400);
    });
};
const deleteUser = (req: any, res: any) => {
  if (verifyAdminOrOwner(req)) {
    userDao
      .deleteUser(req.params.userId)
      .then((status) => res.send(status))
      .catch((reason) => res.sendStatus(400));
  } else {
    res.sendStatus(401);
  }
};
const updateUser = (req: any, res: any) => {
  if (verifyAdminOrOwner(req)) {
    userDao
      .updateUser(req.params.userId, req.body)
      .then((status) => res.send(status))
      .catch((reason) => {
        console.log(reason);
        res.sendStatus(400);
      });
  } else {
    res.sendStatus(401);
  }
};
const login = (req: any, res: any) => {
  userDao
    .findByUsername(req.body.username)
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          if (same) {
            req.session.profile = user;
            res.json(user);
            return;
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((reason) => {
      console.log(reason);
      res.sendStatus(400);
    });
};
const register = (req: any, res: any) => {
  userDao.findByUsername(req.body.username).then((user) => {
    if (user) {
      res.sendStatus(404);
      return;
    }
    userDao.findUserByEmail(req.body.email).then((user) => {
      if (user) {
        res.sendStatus(404);
        return;
      }
      bcrypt.hash(req.body.password, SETTINGS.SALT_ROUNDS, (err, hash) => {
        req.body.password = hash;
        userDao
          .createUser(req.body)
          .then((user) => {
            req.session.profile = user;
            res.json(user);
          })
          .catch((reason) => {
            console.log(reason);
            res.sendStatus(400);
          });
      });
    });
  });
};
const profile = (req: any, res: any) => res.json(req.session["profile"]);
const logout = (req: any, res: any) => res.send(req.session.destroy());

export default (app: any) => {
  app.get("/api/user/:userId", findUserById);
  app.post("/api/user", register);
  app.post("/api/login", login);
  app.post("/api/logout", logout);
  app.delete("/api/user/:userId", deleteUser);
  app.put("/api/user/:userId", updateUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/profile", profile);
};
