const multer = require("multer");
const mongoose = require("mongoose");
const Paper = mongoose.model("Paper");
const User = mongoose.model("User");
const Volume = mongoose.model("Volume");
const md5 = require("md5");
const path = require("path");
const { sentReviewer } = require("../nodemailer");

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
  const info = JSON.parse(req.userinfo);
  const { _id } = JSON.parse(req.volumeId);
  req.body.postedBy = info.user.token._id;
  req.body.volume = _id;

  const paper = new Paper(req.body);

  paper
    .save()
    .then(response => {
      return res.status(200).json({
        message: {
          success: "paper submitted successfully"
        }
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: {
          error: err
        }
      });
    });
};

exports.getReviewerDetails = (req, res, next) => {
  const reviewerId = req.body;
  User.find()
    .select("email")
    .where("_id")
    .in(reviewerId)
    .where("isVerified")
    .in(true)
    .or([{ category: "author" }, { category: "admin" }])
    .exec()
    .then(async response => {
      let allemail = await response.map(item => {
        return item.email;
      });

      return allemail;
    })
    .then(result => {
      req.reviewerMail = JSON.stringify(result);

      return next();
    })
    .catch(err => {
      return res.status(400).json({
        message: {
          error: err
        }
      });
    });
};

exports.addReviewer = async (req, res) => {
  const { paperId } = req.params;
  const reviewerId = req.body;
  Paper.findById({ _id: paperId })
    .then(async response => {
      response.reviewer = [];

      return response;
    })
    .then(async result => {
      result.reviewer = reviewerId;
      await sentReviewer(JSON.parse(req.reviewerMail));
      return await result.save();
    })
    .then(update => {
      return res.status(200).json({
        message: {
          success: update
        }
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: {
          error: err
        }
      });
    });
};

exports.addKeyword = (req, res) => {
  const { paperId } = req.params;

  const keyword = req.body;
  console.log(keyword);
  Paper.findById({ _id: paperId })
    .then(async response => {
      response.keyword = [];

      keyword.map(item => {
        response.keyword.push(item);
      });

      return await response.save();
    })
    .then(result => {
      return res.status(200).json({
        message: {
          success: result
        }
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: {
          error: err
        }
      });
    });
};

exports.allPaper = (req, res) => {
  Paper.find()
    .populate("volume")
    .exec()
    .then(response => {
      // response.volume.find('')
      return res.status(200).json({
        response
      });
    })
    .catch(err => {
      return res.status(400).json({
        err
      });
    });
};
