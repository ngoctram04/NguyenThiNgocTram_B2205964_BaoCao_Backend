import dotenv from "dotenv";
dotenv.config();

export default {
  app: {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "secret_key",
  },
  db: {
    uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library",
  },
};
