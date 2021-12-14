import model from "./model";

const findAllQuestions = () => model.find();
const findQuestionById = (id: number) => model.findById(id);
const createQuestion = (question: any) => model.create(question);
const deleteQuestion = (id: string) => model.deleteOne({ _id: id });
const updateQuestion = (id: string, question: any) =>
  model.updateOne({ _id: id }, { $set: question });
const findAllQuestionsLike = (like: string) => model.find({question: RegExp(`/${like}/`)})

export default {
  findAllQuestions,
  findQuestionById,
  createQuestion,
  deleteQuestion,
  updateQuestion,
  findAllQuestionsLike,
};
