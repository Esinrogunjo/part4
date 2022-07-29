const morgan = require("morgan");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

morgan.token("body", (req, res) => JSON.stringify(req.body));

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: "unknown endpoint" });

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  console.log("error handler working");

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }
  next(errorHandler);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const user = jwt.verify(req.token, process.env.SECRET);
  req.user = user.username;

  next();
};

module.exports = {
  morganMiddleware,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
