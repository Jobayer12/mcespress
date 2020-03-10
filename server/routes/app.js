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
router.post(
  "/api/v0/submitPaper/:userId",
  Token.verifyToken,
  // paperController.uploadPdf,
  // paperController.saveJournalfile,
  paperController.submitPaper
);
// router.get("/api/v0/current/papers");
// router.get("/api/v0/past/papers");
// router.get("/api/v0/reviwer");
// router.get('/api/v0/admin/dashboard')
// router.post('/api/v0/reviewer/update/papers')
// router.post("/api/v0/admin/update/papers");

router.post(
  "/api/v0/admin/add-volume",
  Token.verifyToken,
  volumeController.addVolume
);

module.exports = router;
