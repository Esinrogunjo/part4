const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();

const mongoose = require("mongoose");

const cors = require("cors");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

logger.info("connecting to MongoUrl");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Mongoose connected successfully"))
  .catch((err) => logger.error("Mongoose is not connected", err));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.morganMiddleware);

app.use("/api/blogs", middleware.tokenExtractor, blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "tested") {
  const testingRouter = require("./controllers/testingRouter");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
