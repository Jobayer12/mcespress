const multer = require("multer");
const mongoose = require("mongoose");
const Post = mongoose.model("Paper");
const md5 = require("md5");
const path = require("path");

let fileName = null;

const imageuploadOption = {
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "static/uploads");
    },
    filename: function(req, file, cb) {
      let fileFullName = md5`(${req.user._id}${Date.now()})`;
      fileName = `static/uploads/${fileFullName}${path.extname(
        file.originalname
      )}`;

      cb(null, fileName);
    }
  }),

  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      return cb(new Error("Only pdfs are allowed"));
    }

    cb(null, true);
  }
};

exports.uploadPdf = multer(imageuploadOption).single("pdf");

exports.saveJournalfile = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.body.pdf = fileName;

  next();
};

exports.submitPaper = async (req, res) => {
  const userinfo = JSON.parse(req.userinfo);
  req.body.postedBy = userinfo.user.information._id;
  const post = await new Post(req.body).save();

  await Post.populate(post, {
    path: "postedBy",
    select: "_id name"
  });
  // fileName = null;
  return res.json(post);
};
