import model from "./model";

const findAllQuestions = () => model.find();
const findQuestionById = (id: number) => model.findById(id);
const createQuestion = (question: any) => model.create(question);
const deleteQuestion = (id: string) => model.deleteOne({ _id: id });
const updateQuestion = (id: string, question: any) =>
  model.updateOne({ _id: id }, { $set: question });
const findAllQuestionsLike = (question: string, group: string, owner: string) =>
  model.find({
    $or: [
      { question: RegExp(question) },
      { group_id: RegExp(group) },
      { owner_id: RegExp(owner) },
    ],
  });

export default {
  findAllQuestions,
  findQuestionById,
  createQuestion,
  deleteQuestion,
  updateQuestion,
  findAllQuestionsLike,
};
