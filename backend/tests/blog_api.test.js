const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog.model");
const User = require("../models/user");
const app = require("../app");
const api = supertest(app);

const helper = require("../tests/blog_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const blogObject = helper.blogs.map((blog) => new Blog(blog));
  const promiseBlogArr = blogObject.map((blog) => blog.save());
  await Promise.all(promiseBlogArr);
}, 100000);

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  console.log("====================================");
  console.log(response);
  console.log("====================================");
  expect(response.body).toHaveLength(helper.blogs.length);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});

test("check unique identifier", async () => {
  const res = await api.get("/api/blogs");

  expect(res.body[0].id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});

beforeEach(async () => {
  const newUser = {
    username: "mikazozaa",
    password: "mikazozaa",
    name: "mikazozaa",
  };

  const loginUser = {
    username: "mikazozaa",
    password: "mikazozaa",
  };

  const result = await api.post("/api/users").send(newUser);

  const tokenResult = await api.post("/api/login").send(loginUser);

  headers = `bearer ${tokenResult.body.token}`;
});

test("verify new blog is posted successfully", async () => {
  const localDb = await helper.blogsInDb();
  const newBlog = localDb[0];

  await api
    .post("/api/blogs")
    .set("Authorization", headers)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const result = await api.get("/api/blogs");
  expect(result.body).toHaveLength(helper.blogs.length + 1);

  const contents = result.body.map((content) => content.title);
  expect(contents).toContain("First classs");
});

test("finding a specific blog", async () => {
  const localDb = await helper.blogsInDb();
  const localblog = localDb[0];

  const specificId = await api
    .get(`/api/blogs/${localblog.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedBLog = JSON.parse(JSON.stringify(localblog));
  expect(specificId.body).toEqual(processedBLog);
});

test("testing delete functionality", async () => {
  const localDb = await helper.blogsInDb();
  const blogToBeDeleted = localDb[0];

  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set("Authorization", headers)
    .expect(204);

  const lastBlog = await helper.blogsInDb();

  expect(lastBlog).toHaveLength(helper.blogs.length - 1);

  const title = lastBlog.map((blog) => blog.title);

  expect(title).not.toContain(blogToBeDeleted.title);
});

test("check if an obj has zero", async () => {
  const newBlog = {
    title: "Canonical reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };
  const likes = helper.defaultLikes(newBlog);
  expect(likes).toHaveProperty("likes");
});

test("missing data", async () => {
  const newBlog = {
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 0,
  };
  await api
    .post("/api/blogs")
    .set("Authorization", headers)
    .send(newBlog)
    .expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
