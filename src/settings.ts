const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/webdev";
const PORT = process.env.PORT || 4000;
const SESSION_SECRET = "jumping japak";
const SALT_ROUNDS = 10;

export default {
  MONGO_URL,
  PORT,
  SESSION_SECRET,
  SALT_ROUNDS,
};
