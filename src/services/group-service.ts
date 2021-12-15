import groupDao from "../db/groups/dao";

const verifyAdmin = (req: any) =>
  req.session.profile && req.session.profile.role === "ADMIN";
const verifyAdminOrOwner = (req: any, group: any) =>
  verifyAdmin(req) ||
  (req.session.profile && group.owner_id === req.session.profile._id);
const findGroupById = (req: any, res: any) =>
  groupDao
    .findGroupById(req.params.groupId)
    .then((group) => {
      if (group) {
        res.json(group);
        return;
      }
      res.sendStatus(404);
    })
    .catch((reason) => {
      console.error(reason);
      res.sendStatus(400);
    });
const createGroup = (req: any, res: any) => {
  if (req.session.profile) {
    groupDao
      .createGroup({
        owner_id: req.session.profile._id,
        title: req.body.title,
        topic: req.body.topic,
      })
      .then((group) => res.json(group))
      .catch((reason) => {
        console.log(reason);
        res.sendStatus(400);
      });
    return;
  }
  res.sendStatus(403);
};
const deleteGroup = (req: any, res: any) => {
  groupDao.findGroupById(req.params.groupId).then((group) => {
    if (verifyAdminOrOwner(req, group)) {
      console.log(group);
      groupDao
        .deleteGroup(req.params.groupId)
        .then((status) => res.send(status))
        .catch((reason) => {
          console.log(reason);
          res.sendStatus(400);
        });
      return;
    }
    res.sendStatus(403);
  });
};
const updateGroup = (req: any, res: any) => {
  groupDao.findGroupById(req.params.groupId).then((group) => {
    let newMembers = group.members;
    if (req.body.remove_members) {
      newMembers = newMembers.filter(
        (member: string) => member in req.body.remove_members
      );
    }
    if (req.body.add_members) {
      newMembers.push(...req.body.add_members);
    }
    groupDao
      .updateGroup(req.params.groupId, {
        title: req.body.title || group.title,
        topic: req.body.topic || group.topic,
        members: newMembers,
      })
      .then((group: any) => res.json(group))
      .catch((reason) => {
        console.log(reason);
        res.sendStatus(400);
      });
  });
};
const searchGroups = (req: any, res: any) => {
  groupDao
    .findAllGroupsLike(req.query.title, req.query.topic)
    .then((groups) => res.json(groups))
    .catch((reason) => {
      console.log(reason);
      res.sendStatus(400);
    });
};

export default (app: any) => {
  app.get("/api/group/:groupId", findGroupById);
  app.post("/api/group", createGroup);
  app.delete("/api/group/:groupId", deleteGroup);
  app.put("/api/group/:groupId", updateGroup);
  app.get("/api/groups/search", searchGroups);
};
