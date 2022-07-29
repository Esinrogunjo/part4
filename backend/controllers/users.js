const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  if (body.password.length < 7) {
    return res
      .status(400)
      .json({ error: "password must be greater than seven or equal to seven" })
      .end();
  }

  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = usersRouter;
