const mongoose = require("mongoose");
const User = mongoose.model("User");
const multer = require("multer");

// exports.getUsers = async () => {
//   const users = await User.find().select("_id email createdAt updatedAt");
//   res.json(users);
// };

// exports.getAuthUser = () => {};

exports.getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  req.profile = user;

  const profileId = mongoose.Types.ObjectId(req.profile._id);

  if (req.user && profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};
