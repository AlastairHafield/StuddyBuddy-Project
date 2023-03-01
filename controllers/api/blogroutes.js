const express = require("express");
const router = express.Router();
const { User, Blog, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// get all blogs and users/comments
router.get("/blog", (req, res) => {
  Blog.findAll({ include: [User, Comment] })
    .then((dbBlogs) => {
      res.json(dbBlogs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});

// get blog with user and comment
router.get("/blog:id", (req, res) => {
  Blog.findByPk(req.params.id, { include: [User, Comment] })
    .then((dbBlog) => {
      res.json(dbBlog);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});

// create new blog post
router.post("/blog", (req, res) => {
  // check user is logged in
  // if no user in session, send messsage
  if (!req.session.user) {
    return res.status(401).json({ msg: "Please login!" });
  }
  // create blog post with title and content input by user; user id from session data
  Blog.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.session.user.id,
  })
    // date is "createdAt"
    .then((newBlog) => {
      res.json(newBlog);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});

// update post - withAuth fx
router.put("/blog:id", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Please login!" });
  }
  Blog.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedBlog) => {
      res.json(updatedBlog);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});

router.delete("/blog:id", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Please login!" });
  }
  Blog.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((delBlog) => {
      res.json(delBlog);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});

module.exports = router;