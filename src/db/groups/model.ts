import { model, Schema } from "mongoose";

const GroupSchema = new Schema({
  owner_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  members: {
    type: [String],
    required: true,
    default: [],
  },
});

export default model("Group", GroupSchema);
