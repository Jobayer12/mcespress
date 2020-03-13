const express = require("express");
const Token = require("../token/index");
const adminController = require("../controller/adminController");
const authController = require("../controller/authController");
const authorController = require("../controller/authorController");
const paperController = require("../controller/paperinfoController");
const reviewerController = require("../controller/reviewerController");
const userController = require("../controller/userController");
const volumeController = require("../controller/volumeController");

const router = express.Router();

const catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

router.post(
  "/api/v0/auth/signup",
  authController.validateSignup,
  authController.signup
);

router.post("/api/v0/auth/signin", authController.signin);
router.post(
  "/api/v0/auth/resetPassword",
  authController.isAlreadyLoggedIn,
  authController.restPassword
);
router.get(
  "/api/v0/auth/verifyEmail/:VerifiedCode",
  authController.verifyEmail
);
router.get("/api/v0/auth/signout", authController.signout);

router.param("userId", userController.getUserById);

//paper part

router.get("/api/v0/all-paper", Token.verifyToken, paperController.allPaper);

router.post(
  "/api/v0/submitPaper",
  Token.verifyToken,
  Token.checkUserLogingStatus,
  volumeController.runningVolume,
  // paperController.uploadPdf,
  // paperController.saveJournalfile,
  paperController.submitPaper
);

//Volume part
router.get(
  "/api/v0/admin/volume/status/:id",
  Token.verifyToken,
  Token.checkLoginStatus,
  volumeController.currentVolume
);

router.post(
  "/api/v0/admin/add-volume",
  Token.verifyToken,
  Token.checkLoginStatus,
  volumeController.addVolume
);

//Reviewer part

router.put(
  "/api/v0/admin/add-reviewer/:paperId/update",
  Token.verifyToken,
  Token.checkLoginStatus,
  paperController.getReviewerDetails,
  paperController.addReviewer
);

// add keyword and reviewer

router.put(
  "/api/v0/admin/add-keyword/:paperId/update",
  Token.verifyToken,
  Token.checkLoginStatus,
  paperController.addKeyword
);

module.exports = router;

// router.get("/api/v0/current/papers");
// router.get("/api/v0/past/papers");
// router.get("/api/v0/reviwer");
// router.get('/api/v0/admin/dashboard')
// router.post('/api/v0/reviewer/update/papers')
// router.post("/api/v0/admin/update/papers");
