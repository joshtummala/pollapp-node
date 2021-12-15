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
  if (req.session.profile) {
    questionDao
      .createQuestion({
        owner_id: req.session.profile._id,
        group_id: req.body.group_id,
        question: req.body.question,
        options: req.body.options,
      })
      .then((question) => res.json(question))
      .catch((reason) => res.sendStatus(400));
    return;
  }
  res.sendStatus(403);
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
          .then((status) => res.send(status))
          .catch((reason) => res.sendStatus(400));
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
    .findAllQuestionsLike(req.query.question, req.query.group, req.query.owner)
    .then((questions) => res.json(questions))
    .catch((reason) => res.sendStatus(400));
};
const updateQuestion = (req: any, res: any) => {
  if (req.session.profile) {
    questionDao.findQuestionById(req.params.questionId).then((question) => {
      if (question) {
        question.responses.set(req.session.profile._id, req.body.response);
        question.save();
        res.json(question);
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(403);
  }
};

export default (app: any) => {
  app.get("/api/question/:questionId", findQuestionById);
  app.post("/api/question", createQuestion);
  app.delete("/api/question/:questionId", deleteQuestion);
  app.get("/api/questions/search", searchQuestions);
  app.put("/api/question/:questionId", updateQuestion);
};
