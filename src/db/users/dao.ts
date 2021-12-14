import model from "./model";

const findAllUsers = () => model.find();
const findUserById = (id: string) => model.findById(id);
const findUserByEmail = (email: string) => model.findOne({ email });
const findByUsername = (username: string) => model.findOne({ username });
const createUser = (user: any) => model.create(user);
const deleteUser = (id: string) => model.deleteOne({ _id: id });
const updateUser = (id: string, user: any) =>
  model.updateOne({ _id: id }, { $set: user });

export default {
  findAllUsers,
  findUserById,
  findUserByEmail,
  findByUsername,
  createUser,
  deleteUser,
  updateUser,
};
