const dummy = require("../utils/list_helper").dummy;
const totalLikes = require("../utils/list_helper").totalLikes;
const favoriteBlog = require("../utils/list_helper").favoriteBlog;
const mostblogs = require("../utils/list_helper").mostblogs;
const mostlike = require("../utils/list_helper").mostlikes;

const blogs = require("../data/blogs");

test("dummy return one", () => {
  const blogs = [];
  const result = dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe("favourite blog", () => {
  const blog = {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  };

  test("this is the highest block", () => {
    const result = favoriteBlog(blogs);
    expect(result).toEqual(blog);
  });
});

describe("mostblogs", () => {
  const sample = {
    author: "Robert C. Martin",
    blogs: 3,
  };

  test("cheking for mostblogs", () => {
    const result = mostblogs(blogs);
    console.log(result);
    expect(result).toEqual(sample);
  });
});

describe("mostlike blogs", () => {
  const sample = {
    author: "Edsger W. Dijkstra",
    likes: 17,
  };

  test("testing most like blog", () => {
    const result = mostlike(blogs);
    expect(sample).toEqual(result);
  });
});
