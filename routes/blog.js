const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Blog = require("../models/blog")
const Comment = require("../models/comment")

const router = express.Router();

// Define the upload folder path
const uploadPath = path.join(__dirname, "..", "public", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  try {
    // Find blog by ObjectId
    const blog = await Blog.findById(req.params.id).populate("createdBy");
const comments = await Comment.find({blogId : req.params.id }).populate("createdBy")
console.log("comments",comments)
    // If not found, send 404
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Render blog.ejs with the found blog
    res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (err) {
    // Handle invalid ObjectId or other errors
    console.error(err.message);
    res.status(400).send("Invalid blog ID");
  }
});
 
router.post("/comment/:blogId", async (req,res) => {
 await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy:req.user._id,
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})


router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
   coverImageURL: req.file.filename

  });
  res.redirect(`/blog/${blog._id}`);
});



module.exports = router;
