const Blog = require("../models/blog.model");

const blogs = [];

const defaultLikes = (obj) =>
  !obj.hasOwnProperty("likes") ? { ...obj, likes: 0 } : obj;

const nonExistingLikes = async () => {
  const receivedBlogs = await Blog.find({});
  return receivedBlogs.map((blog) => {
    if (!blog.hasOwnProperty("likes")) return { ...blog, likes: 0 };
    return blog.toJSON();
  });
};

const blogsInDb = async () => {
  const newBlogs = await Blog.find({});
  return newBlogs.map((blog) => blog.toJSON());
};

module.exports = { blogs, nonExistingLikes, defaultLikes, blogsInDb };
