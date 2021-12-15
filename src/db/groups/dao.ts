import model from "./model";

const findAllGroups = () => model.find();
const findGroupById = (id: string) => model.findById(id);
const createGroup = (group: any) => model.create(group);
const deleteGroup = (id: string) => model.deleteOne({ _id: id });
const updateGroup = (id: string, group: any) =>
  model.updateOne(
    { _id: id },
    {
      $set: group,
    }
  );
const findAllGroupsLike = (titleLike: string, topicLike: string) =>
  model.find({
    $or: [
      { title: RegExp(titleLike) },
      { topic: RegExp(topicLike) },
    ],
  });
export default {
  findAllGroups,
  findGroupById,
  createGroup,
  deleteGroup,
  updateGroup,
  findAllGroupsLike,
};
