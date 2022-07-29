const blogs = require("../data/blogs");
const User = require("../models/user");

const dummy = (blog) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
  return likes;
};

const favoriteBlog = (blogs) => {
  const result = blogs.sort((a, b) => a.likes - b.likes);
  return result[result.length - 1];
};

const mostblogs = (blogs) => {
  const reducer = blogs.reduce((acc, cur) => {
    acc[cur.author] ? (acc[cur.author] += 1) : (acc[cur.author] = 1);
    return acc;
  }, []);
  const obj = Object.entries(reducer)
    .map((blog) => ({
      author: blog[0],
      blogs: blog[1],
    }))
    .sort((a, b) => b.likes - a.likes)[0];
  return obj;
};

const mostlikes = (blog) => {
  const reducer = blog.reduce((acc, cur) => {
    acc[cur.author]
      ? (acc[cur.author] += cur.likes)
      : (acc[cur.author] = cur.likes);
    return acc;
  }, []);

  console.log(reducer);
  const obj = Object.entries(reducer)
    .map((blog) => ({
      author: blog[0],
      likes: blog[1],
    }))
    .sort((a, b) => b.likes - a.likes)[0];
  return obj;
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostblogs,
  mostlikes,
  usersInDb,
};
