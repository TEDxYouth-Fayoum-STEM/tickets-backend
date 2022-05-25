import { config as dotenv } from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv({ path: "./dev.env" });

export default {
  // server
  port: parseInt(<string>process.env.PORT) || 3000,
  host: <string>process.env.HOST,
  frontendHost: <string>process.env.FRONTEND_HOST,
  // request limits
  req: {
    maxBodySize: parseInt(<string>process.env.MAX_REQ_BODY_SIZE) * 1024,
    maxFieldNameSize: parseInt(<string>process.env.MAX_FIELD_NAME_SIZE),
    maxFieldSize: parseInt(<string>process.env.MAX_FIELD_SIZE),
    maxFilesSize: parseInt(<string>process.env.MAX_FILES_SIZE) * (1024 * 1024)
  },
  // database
  db: {
    str: <string>process.env.DB_STR,
    db: <string>process.env.DB
  },
  // cloudinary
  cloudinary: {
    name: <string>process.env.CLOUD_NAME,
    key: <string>process.env.CLOUD_KEY,
    secret: <string>process.env.CLOUD_SECRET
  },
  logPwd: <string>process.env.LOG_PWD
};
