import questionDao from "../db/questions/dao";

const verifyAdmin = (req: any) =>
  req.session.profile && req.session.profile.role === "ADMIN";
const findQuestionById = (req: any, res: any) => {
  questionDao.findQuestionById(req.params.questionId).then((question) => {
    if (question) {
      res.json(question);
      return;
    }
    res.sendStatus(404);
  });
};
const createQuestion = (req: any, res: any) => {
  questionDao.createQuestion(req.body).then((question) => res.json(question));
};
const deleteQuestion = (req: any, res: any) => {
  questionDao.findQuestionById(req.params.questionId).then((question) => {
    if (question) {
      if (
        verifyAdmin(req) ||
        (req.session.profile && req.session.profile._id === question.owner_id)
      ) {
        questionDao
          .deleteQuestion(req.params.questionId)
          .then((status) => res.send(status));
        return;
      }
      res.sendStatus(403);
      return;
    }
    res.sendStatus(404);
  });
};
const searchQuestions = (req: any, res: any) => {
  questionDao
    .findAllQuestionsLike(req.query.question)
    .then((questions) => res.json(questions));
};

export default (app: any) => {
  app.get("/api/question/:questionId", findQuestionById);
  app.post("/api/question", createQuestion);
  app.delete("/api/question/:questionId", deleteQuestion);
  app.get("/api/question/search", searchQuestions);
};
