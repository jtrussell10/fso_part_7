const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const user = request.user;
  const userid = user.id;

  if (blog.user.toString() === userid.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(400).send({ error: "Invalid" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const id = request.params.id;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    ...(body.user ? { user: body.user } : {}),
  };

  await Blog.findByIdAndUpdate(id, updatedBlog);

  const updatedEntry = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  if (updatedEntry) {
    response.status(200).json(updatedEntry);
  } else {
    response.status(404).send({ error: "Blog not found" });
  }
});


blogsRouter.post("/:id/comments", async (request, response) => {
  const id = request.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }
    const body = request.body;
    const newComment = {
      content: body.content,
      date: new Date() // add current date
    };
    
    const updatedBlog = {
      ...blog._doc,
      comments: blog.comments ? blog.comments.concat(newComment) : [newComment]
    };

    const updatedEntry = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });

    if (updatedEntry) {
      return response.status(201).json(newComment);
    } else {
      return response.status(404).json({ error: "Blog not found after update" });
    }
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({ error: "Something went wrong" });
  }
});




module.exports = blogsRouter;
