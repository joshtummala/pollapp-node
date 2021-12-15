import { model, Schema } from "mongoose";

const QuestionSchema = new Schema({
  owner_id: {
    type: String,
    required: true,
  },
  group_id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  responses: {
    type: Map,
    required: true,
    default: {},
  },
  options: {
    type: [String],
    required: true,
  },
});

export default model("Question", QuestionSchema);
