const blogsRouter = require("express").Router();
const userExtractor = require("../utils/middleware").userExtractor;
const Blog = require("../models/blog.model");
const User = require("../models/user");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog ? res.json(blog) : res.status(404).end();
});

blogsRouter.post("/", userExtractor, async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201).json(savedBlog);
});

blogsRouter.post("/:id", async (req, res) => {
  const { text } = req.body;

  const blog = await Blog.findById(req.params.id);

  try {
    const blogComment = await new Comment({
      text,
    }).save();

    blog.comment = blog.comment.concat(blogComment);
    await blog.save();
    res.status(201).json(blogComment);
  } catch (error) {
    console.log(error);
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const blog = await Blog.findById(req.params.id);

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (blog.user.toString() !== decodedToken.id) {
    return res.status(401).json({ error: "Authentication failed!" });
  }

  blog.remove();
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
  const updatedblog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  });

  const blog = { updatedblog, likes: req.body.likes };
  const update = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(update);
});

module.exports = blogsRouter;
